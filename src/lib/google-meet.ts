import { google } from 'googleapis';

// Google Calendar API を使用してGoogle Meetリンクを生成
export async function createGoogleMeetLink({
  summary,
  description,
  startTime,
  endTime,
  attendeeEmail,
}: {
  summary: string;
  description: string;
  startTime: Date;
  endTime: Date;
  attendeeEmail: string;
}): Promise<string | null> {
  try {
    // 環境変数チェック
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_CALENDAR_ID) {
      console.warn('Google Calendar API credentials not configured. Skipping Meet link generation.');
      return null;
    }

    // サービスアカウント認証
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // イベント作成（Google Meetリンク自動生成）
    const event = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      conferenceDataVersion: 1,
      requestBody: {
        summary,
        description,
        start: {
          dateTime: startTime.toISOString(),
          timeZone: 'Asia/Tokyo',
        },
        end: {
          dateTime: endTime.toISOString(),
          timeZone: 'Asia/Tokyo',
        },
        attendees: [
          {
            email: attendeeEmail,
          },
        ],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      },
    });

    // Google Meetリンクを返す
    return event.data.hangoutLink || null;
  } catch (error) {
    console.error('Error creating Google Meet link:', error);
    return null;
  }
}

// デモ用: ダミーのGoogle Meetリンクを生成（開発環境用）
export function createDummyMeetLink(): string {
  const randomId = Math.random().toString(36).substring(2, 15);
  return `https://meet.google.com/${randomId}`;
}
