// 外部サービスの初期化と設定
import { google } from 'googleapis';

// ===== SendGridメール =====
export async function initSendGrid() {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid APIキーが設定されていません");
    return null;
  }

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  return sgMail;
}

// ===== Twilio SMS =====
export async function initTwilio() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    console.warn("Twilio認証情報が設定されていません");
    return null;
  }

  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return twilio;
}

// ===== Zoomビデオ =====
export async function initZoom() {
  if (!process.env.ZOOM_API_KEY || !process.env.ZOOM_API_SECRET) {
    console.warn("Zoom API認証情報が設定されていません");
    return null;
  }

  // JWT生成
  const jwt = require('jsonwebtoken');
  const payload = {
    iss: process.env.ZOOM_API_KEY,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1時間有効
  };

  const token = jwt.sign(payload, process.env.ZOOM_API_SECRET);

  return {
    token,
    apiKey: process.env.ZOOM_API_KEY
  };
}

// ===== 実際の使用例 =====

// SendGridでメール送信
export async function sendEmail(to: string, subject: string, html: string) {
  const sgMail = await initSendGrid();
  if (!sgMail) {
    console.log("SendGrid未設定のため、デモモードでメール送信をスキップ");
    return { demo: true, to, subject };
  }

  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL!,
      name: process.env.SENDGRID_FROM_NAME || 'ギャンブルドクター'
    },
    subject,
    html,
  };

  return await sgMail.send(msg);
}

// TwilioでSMS送信
export async function sendSMS(to: string, body: string) {
  const twilio = await initTwilio();
  if (!twilio) {
    console.log("Twilio未設定のため、デモモードでSMS送信をスキップ");
    return { demo: true, to, body };
  }

  const message = await twilio.messages.create({
    body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: to.startsWith('+81') ? to : `+81${to.replace(/^0/, '')}` // 日本の番号に変換
  });

  return message;
}

// Zoomミーティング作成
export async function createZoomMeeting(topic: string, startTime: Date, duration: number) {
  const zoom = await initZoom();
  if (!zoom) {
    console.log("Zoom未設定のため、デモURLを返します");
    return {
      demo: true,
      join_url: `https://zoom.us/j/demo-meeting-${Date.now()}`,
      password: 'DEMO123'
    };
  }

  const axios = require('axios');

  const response = await axios.post(
    'https://api.zoom.us/v2/users/me/meetings',
    {
      topic,
      type: 2, // スケジュールされたミーティング
      start_time: startTime.toISOString(),
      duration,
      timezone: 'Asia/Tokyo',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: false,
        waiting_room: true,
        audio: 'both',
        auto_recording: 'cloud',
      }
    },
    {
      headers: {
        'Authorization': `Bearer ${zoom.token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data;
}

// ===== Google Calendar API =====
export async function initGoogleCalendar() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    console.warn("Google Calendar API認証情報が設定されていません");
    return null;
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  return google.calendar({ version: 'v3', auth });
}

// Google Meetリンク付きカレンダーイベントを作成
export async function createGoogleMeetEvent(
  patientName: string,
  patientEmail: string,
  startTime: Date,
  endTime: Date,
  appointmentId: string
) {
  const calendar = await initGoogleCalendar();

  if (!calendar) {
    console.log("Google Calendar未設定のため、デモMeetリンクを生成");
    // デモモード: ランダムなMeetリンクを生成
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const part1 = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part2 = Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const part3 = Array(3).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    const meetCode = `${part1}-${part2}-${part3}`;
    return {
      demo: true,
      meetLink: `https://meet.google.com/${meetCode}`,
      eventId: `demo-${appointmentId}`
    };
  }

  try {
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      conferenceDataVersion: 1,
      requestBody: {
        summary: `オンライン診療 - ${patientName}様`,
        description: `ギャンブルドクター オンライン診療
患者様: ${patientName}
予約ID: ${appointmentId}

診療開始5分前にはGoogle Meetリンクからお入りください。`,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Asia/Tokyo',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Asia/Tokyo',
        },
        attendees: [
          { email: patientEmail },
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${appointmentId}-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24時間前
            { method: 'email', minutes: 60 },      // 1時間前
          ],
        },
      },
    });

    return {
      demo: false,
      meetLink: event.data.hangoutLink || '',
      eventId: event.data.id || '',
      htmlLink: event.data.htmlLink || ''
    };
  } catch (error) {
    console.error("Google Calendar APIエラー:", error);
    throw error;
  }
}