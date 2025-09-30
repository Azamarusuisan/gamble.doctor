import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import crypto from "crypto";

// ビデオルーム作成スキーマ
const createRoomSchema = z.object({
  appointmentId: z.string(),
  provider: z.enum(["zoom", "teams", "meet", "custom"]),
  hostEmail: z.string().email(),
  participantEmail: z.string().email(),
  duration: z.number().min(15).max(120).default(30),
  scheduledStart: z.string()
});

// JWT風トークン生成（デモ用）
function generateAccessToken(roomId: string, userId: string, role: "host" | "participant") {
  const payload = {
    roomId,
    userId,
    role,
    exp: Date.now() + 3600000, // 1時間有効
    iat: Date.now()
  };

  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

// ビデオルーム作成
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createRoomSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "入力データが不正です", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { appointmentId, provider, hostEmail, participantEmail, duration, scheduledStart } = validation.data;

    // 予約確認
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
        slot: true
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // ルームIDとミーティングURL生成
    const roomId = `room_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
    const meetingPassword = crypto.randomBytes(4).toString('hex').toUpperCase();

    // プロバイダー別のURL生成
    const meetingUrls: Record<string, string> = {
      zoom: `https://zoom.us/j/${roomId.replace(/[^0-9]/g, '').slice(0, 10)}?pwd=${meetingPassword}`,
      teams: `https://teams.microsoft.com/l/meetup-join/${roomId}`,
      meet: `https://meet.google.com/${roomId.slice(-12)}`,
      custom: `https://video.gamble-doctor.jp/room/${roomId}`
    };

    const meetingUrl = meetingUrls[provider];

    // アクセストークン生成
    const hostToken = generateAccessToken(roomId, hostEmail, "host");
    const participantToken = generateAccessToken(roomId, participantEmail, "participant");

    // ビデオルーム情報
    const roomData = {
      roomId,
      appointmentId,
      provider,
      meetingUrl,
      meetingPassword,
      host: {
        email: hostEmail,
        accessToken: hostToken,
        joinUrl: `${meetingUrl}&token=${hostToken}`
      },
      participant: {
        email: participantEmail,
        accessToken: participantToken,
        joinUrl: `${meetingUrl}&token=${participantToken}`
      },
      scheduledStart,
      duration,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };

    // 予約にビデオURL追加
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        videoUrl: meetingUrl,
        metadata: {
          ...appointment.metadata as any,
          videoRoom: roomData
        }
      }
    });

    // 監査ログ
    await prisma.auditLog.create({
      data: {
        action: "video.room.created",
        entityId: roomId,
        entityType: "video",
        metadata: roomData
      }
    });

    return NextResponse.json({
      success: true,
      room: {
        roomId,
        meetingUrl,
        meetingPassword,
        provider,
        host: {
          email: hostEmail,
          joinUrl: roomData.host.joinUrl
        },
        participant: {
          email: participantEmail,
          joinUrl: roomData.participant.joinUrl
        }
      }
    });

  } catch (error) {
    console.error("Create video room error:", error);
    return NextResponse.json(
      { error: "ビデオルームの作成に失敗しました" },
      { status: 500 }
    );
  }
}

// ビデオルーム情報取得
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    const appointmentId = searchParams.get("appointmentId");

    if (!roomId && !appointmentId) {
      return NextResponse.json(
        { error: "ルームIDまたは予約IDが必要です" },
        { status: 400 }
      );
    }

    let roomData;

    if (appointmentId) {
      // 予約からビデオルーム情報を取得
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      });

      if (!appointment || !appointment.metadata) {
        return NextResponse.json(
          { error: "ビデオルーム情報が見つかりません" },
          { status: 404 }
        );
      }

      const metadata = appointment.metadata as any;
      roomData = metadata.videoRoom;
    } else {
      // 監査ログからビデオルーム情報を取得
      const log = await prisma.auditLog.findFirst({
        where: {
          action: "video.room.created",
          entityId: roomId
        }
      });

      if (!log) {
        return NextResponse.json(
          { error: "ビデオルームが見つかりません" },
          { status: 404 }
        );
      }

      roomData = log.metadata;
    }

    return NextResponse.json({
      success: true,
      room: roomData
    });

  } catch (error) {
    console.error("Get video room error:", error);
    return NextResponse.json(
      { error: "ビデオルーム情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// ビデオルーム開始/終了
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { roomId, action, userEmail } = body;

    if (!roomId || !action || !userEmail) {
      return NextResponse.json(
        { error: "必須パラメータが不足しています" },
        { status: 400 }
      );
    }

    // ルーム情報取得
    const roomLog = await prisma.auditLog.findFirst({
      where: {
        action: "video.room.created",
        entityId: roomId
      }
    });

    if (!roomLog) {
      return NextResponse.json(
        { error: "ビデオルームが見つかりません" },
        { status: 404 }
      );
    }

    const roomData = roomLog.metadata as any;

    // アクション処理
    let eventType = "";
    let statusUpdate = {};

    switch (action) {
      case "start":
        eventType = "video.room.started";
        statusUpdate = {
          status: "active",
          startedAt: new Date().toISOString(),
          startedBy: userEmail
        };
        break;

      case "end":
        eventType = "video.room.ended";
        statusUpdate = {
          status: "completed",
          endedAt: new Date().toISOString(),
          endedBy: userEmail,
          duration: roomData.startedAt
            ? Math.floor((new Date().getTime() - new Date(roomData.startedAt).getTime()) / 60000)
            : 0
        };
        break;

      case "join":
        eventType = "video.room.joined";
        statusUpdate = {
          participants: [
            ...(roomData.participants || []),
            {
              email: userEmail,
              joinedAt: new Date().toISOString()
            }
          ]
        };
        break;

      case "leave":
        eventType = "video.room.left";
        statusUpdate = {
          leftBy: userEmail,
          leftAt: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json(
          { error: "無効なアクションです" },
          { status: 400 }
        );
    }

    // 監査ログに記録
    await prisma.auditLog.create({
      data: {
        action: eventType,
        entityId: roomId,
        entityType: "video",
        metadata: {
          ...roomData,
          ...statusUpdate
        }
      }
    });

    // 録画URL生成（デモ用）
    let recordingUrl = null;
    if (action === "end") {
      recordingUrl = `https://recordings.gamble-doctor.jp/${roomId}/recording.mp4`;

      // 録画情報を監査ログに追加
      await prisma.auditLog.create({
        data: {
          action: "video.recording.available",
          entityId: roomId,
          entityType: "video",
          metadata: {
            recordingUrl,
            recordingDuration: (statusUpdate as any).duration,
            availableUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30日間有効
          }
        }
      });
    }

    return NextResponse.json({
      success: true,
      action,
      roomId,
      status: (statusUpdate as any).status || roomData.status,
      recordingUrl,
      message: `ビデオルームを${action === 'start' ? '開始' : action === 'end' ? '終了' : action}しました`
    });

  } catch (error) {
    console.error("Update video room error:", error);
    return NextResponse.json(
      { error: "ビデオルームの更新に失敗しました" },
      { status: 500 }
    );
  }
}