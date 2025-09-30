import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// iCalendarフォーマットの生成
function generateICS(appointment: any): string {
  const startDate = new Date(appointment.slot.start);
  const endDate = new Date(appointment.slot.end);

  // iCalendar日付フォーマット (YYYYMMDDTHHmmssZ)
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ギャンブルドクター//JP',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${appointment.id}@gamble-doctor.jp`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:ギャンブルドクター ${appointment.type === 'initial' ? '初診' : '再診'}`,
    `DESCRIPTION:患者名: ${appointment.patient.name}\\n` +
    `診療タイプ: ${appointment.type === 'initial' ? '初診' : '再診'}\\n` +
    `ビデオURL: ${appointment.videoUrl || '追って連絡いたします'}\\n` +
    `注意事項:\\n` +
    `・開始5分前にはビデオ通話の準備をお願いします\\n` +
    `・静かな環境でご参加ください\\n` +
    `・ご本人確認書類をご準備ください`,
    `LOCATION:${appointment.videoUrl || 'オンライン診療'}`,
    `STATUS:CONFIRMED`,
    `ORGANIZER;CN=ギャンブルドクター:mailto:clinic@gamble-doctor.jp`,
    `ATTENDEE;CN=${appointment.patient.name};RSVP=TRUE:mailto:${appointment.patient.email}`,
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    'DESCRIPTION:診療1時間前のお知らせ',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:EMAIL',
    'SUMMARY:明日の診療予約のお知らせ',
    'DESCRIPTION:明日の診療予約をお忘れなく',
    `ATTENDEE:mailto:${appointment.patient.email}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  return icsContent;
}

// 単一の予約をiCalendarファイルとしてダウンロード
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const email = searchParams.get("email");

    if (!appointmentId || !email) {
      return NextResponse.json(
        { error: "予約IDとメールアドレスが必要です" },
        { status: 400 }
      );
    }

    // 予約情報を取得
    const appointment = await prisma.appointment.findFirst({
      where: {
        id: appointmentId,
        patient: {
          email: email
        }
      },
      include: {
        slot: true,
        patient: true
      }
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // iCalendarファイルを生成
    const icsContent = generateICS(appointment);

    // ファイル名を生成
    const fileName = `appointment_${appointment.id}_${new Date(appointment.slot.start).toISOString().split('T')[0]}.ics`;

    // iCalendarファイルとして返す
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Generate ICS error:", error);
    return NextResponse.json(
      { error: "カレンダーファイルの生成に失敗しました" },
      { status: 500 }
    );
  }
}

// 複数の予約を一括でiCalendarファイルとしてダウンロード
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, startDate, endDate } = body;

    if (!email) {
      return NextResponse.json(
        { error: "メールアドレスが必要です" },
        { status: 400 }
      );
    }

    // 患者情報を取得
    const patient = await prisma.patient.findUnique({
      where: { email }
    });

    if (!patient) {
      return NextResponse.json(
        { error: "患者情報が見つかりません" },
        { status: 404 }
      );
    }

    // 条件を構築
    const whereCondition: any = {
      patientId: patient.id,
      status: { not: "canceled" }
    };

    if (startDate || endDate) {
      whereCondition.slot = {
        start: {}
      };
      if (startDate) {
        whereCondition.slot.start.gte = new Date(startDate);
      }
      if (endDate) {
        whereCondition.slot.start.lte = new Date(endDate);
      }
    }

    // 予約情報を取得
    const appointments = await prisma.appointment.findMany({
      where: whereCondition,
      include: {
        slot: true,
        patient: true
      },
      orderBy: {
        slot: {
          start: 'asc'
        }
      }
    });

    if (appointments.length === 0) {
      return NextResponse.json(
        { error: "予約が見つかりません" },
        { status: 404 }
      );
    }

    // 複数の予約を含むiCalendarファイルを生成
    const icsEvents = appointments.map(appointment => {
      const startDate = new Date(appointment.slot.start);
      const endDate = new Date(appointment.slot.end);

      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
      };

      return [
        'BEGIN:VEVENT',
        `UID:${appointment.id}@gamble-doctor.jp`,
        `DTSTAMP:${formatDate(new Date())}`,
        `DTSTART:${formatDate(startDate)}`,
        `DTEND:${formatDate(endDate)}`,
        `SUMMARY:ギャンブルドクター ${appointment.type === 'initial' ? '初診' : '再診'}`,
        `DESCRIPTION:診療タイプ: ${appointment.type === 'initial' ? '初診' : '再診'}`,
        `LOCATION:${appointment.videoUrl || 'オンライン診療'}`,
        `STATUS:CONFIRMED`,
        'END:VEVENT'
      ].join('\r\n');
    });

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ギャンブルドクター//JP',
      'CALSCALE:GREGORIAN',
      ...icsEvents,
      'END:VCALENDAR'
    ].join('\r\n');

    // ファイル名を生成
    const fileName = `appointments_${patient.id}_all.ics`;

    // iCalendarファイルとして返す
    return new NextResponse(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error("Generate bulk ICS error:", error);
    return NextResponse.json(
      { error: "カレンダーファイルの生成に失敗しました" },
      { status: 500 }
    );
  }
}