import nodemailer from 'nodemailer';

// Gmail transporter の作成
export const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
};

// 予約完了メール（患者向け）
export async function sendBookingConfirmationEmail({
  to,
  patientName,
  appointmentDate,
  appointmentTime,
  appointmentType,
  meetLink,
}: {
  to: string;
  patientName: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  meetLink?: string;
}) {
  const transporter = createTransporter();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Noto Sans JP', sans-serif;
          line-height: 1.8;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #00AEEF 0%, #00C6FF 100%);
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .content {
          background: #ffffff;
          padding: 30px 20px;
          border: 1px solid #e0e0e0;
        }
        .info-box {
          background: #f8f9fa;
          border-left: 4px solid #00AEEF;
          padding: 20px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .info-row {
          display: flex;
          margin-bottom: 12px;
        }
        .info-label {
          font-weight: bold;
          min-width: 120px;
          color: #555;
        }
        .info-value {
          color: #333;
        }
        .meet-button {
          display: inline-block;
          background: linear-gradient(135deg, #00AEEF 0%, #00C6FF 100%);
          color: white !important;
          text-decoration: none;
          padding: 15px 30px;
          border-radius: 25px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          background: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-radius: 0 0 10px 10px;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✓ ご予約完了のお知らせ</h1>
      </div>

      <div class="content">
        <p>${patientName} 様</p>

        <p>この度は、ギャンブルドクターをご予約いただき、誠にありがとうございます。<br>
        ご予約が完了いたしましたので、詳細をご確認ください。</p>

        <div class="info-box">
          <div class="info-row">
            <div class="info-label">診療日時：</div>
            <div class="info-value">${appointmentDate} ${appointmentTime}</div>
          </div>
          <div class="info-row">
            <div class="info-label">診療内容：</div>
            <div class="info-value">${appointmentType}</div>
          </div>
        </div>

        ${meetLink ? `
        <div style="text-align: center; margin: 30px 0;">
          <a href="${meetLink}" class="meet-button">
            📹 オンライン診療に参加する
          </a>
        </div>
        <p style="text-align: center; font-size: 14px; color: #666;">
          ※ 診療時間の5分前から入室可能です
        </p>
        ` : ''}

        <div class="warning">
          <strong>⚠️ キャンセルについて</strong><br>
          予約の24時間前までは無料でキャンセル可能です。<br>
          キャンセルをご希望の場合は、お早めにご連絡ください。
        </div>

        <p>ご不明な点がございましたら、いつでもお問い合わせください。<br>
        それでは、診療当日にお会いできることを楽しみにしております。</p>

        <p>ギャンブルドクター<br>
        ${process.env.NEXT_PUBLIC_APP_URL || 'https://gamble-doctor.com'}</p>
      </div>

      <div class="footer">
        このメールは自動送信されています。<br>
        心当たりのない場合は、お手数ですが破棄してください。
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'ギャンブルドクター'} <${process.env.GMAIL_USER}>`,
    to,
    subject: `【ギャンブルドクター】ご予約完了のお知らせ - ${appointmentDate}`,
    html: htmlContent,
    text: `
${patientName} 様

この度は、ギャンブルドクターをご予約いただき、誠にありがとうございます。
ご予約が完了いたしましたので、詳細をご確認ください。

■ 予約詳細
診療日時： ${appointmentDate} ${appointmentTime}
診療内容： ${appointmentType}

${meetLink ? `■ オンライン診療URL\n${meetLink}\n※ 診療時間の5分前から入室可能です\n` : ''}

■ キャンセルについて
予約の24時間前までは無料でキャンセル可能です。
キャンセルをご希望の場合は、お早めにご連絡ください。

ご不明な点がございましたら、いつでもお問い合わせください。
それでは、診療当日にお会いできることを楽しみにしております。

ギャンブルドクター
${process.env.NEXT_PUBLIC_APP_URL || 'https://gamble-doctor.com'}

---
このメールは自動送信されています。
心当たりのない場合は、お手数ですが破棄してください。
    `,
  };

  await transporter.sendMail(mailOptions);
}

// 新規予約通知（管理者向け）
export async function sendNewBookingNotificationToAdmin({
  patientName,
  patientEmail,
  patientPhone,
  appointmentDate,
  appointmentTime,
  appointmentType,
  bookingId,
}: {
  patientName: string;
  patientEmail: string;
  patientPhone?: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  bookingId: string;
}) {
  const transporter = createTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.warn('ADMIN_EMAIL is not set. Skipping admin notification.');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: 'Hiragino Sans', sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #00AEEF;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          background: #f8f9fa;
          padding: 20px;
          margin-top: 20px;
        }
        .info-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .info-table td {
          padding: 10px;
          border-bottom: 1px solid #ddd;
        }
        .info-table td:first-child {
          font-weight: bold;
          width: 150px;
        }
        .button {
          display: inline-block;
          background: #00AEEF;
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 5px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🔔 新規予約が入りました</h2>
        </div>

        <div class="content">
          <p>新しい予約が登録されました。以下の内容をご確認ください。</p>

          <table class="info-table">
            <tr>
              <td>予約ID</td>
              <td>${bookingId}</td>
            </tr>
            <tr>
              <td>患者名</td>
              <td>${patientName}</td>
            </tr>
            <tr>
              <td>メールアドレス</td>
              <td>${patientEmail}</td>
            </tr>
            ${patientPhone ? `
            <tr>
              <td>電話番号</td>
              <td>${patientPhone}</td>
            </tr>
            ` : ''}
            <tr>
              <td>診療日時</td>
              <td>${appointmentDate} ${appointmentTime}</td>
            </tr>
            <tr>
              <td>診療内容</td>
              <td>${appointmentType}</td>
            </tr>
          </table>

          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin" class="button">
              管理画面で確認する
            </a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `${process.env.EMAIL_FROM_NAME || 'ギャンブルドクター'} <${process.env.GMAIL_USER}>`,
    to: adminEmail,
    subject: `【管理者通知】新規予約: ${patientName} 様 - ${appointmentDate}`,
    html: htmlContent,
    text: `
新規予約通知

予約ID: ${bookingId}
患者名: ${patientName}
メールアドレス: ${patientEmail}
${patientPhone ? `電話番号: ${patientPhone}\n` : ''}診療日時: ${appointmentDate} ${appointmentTime}
診療内容: ${appointmentType}

管理画面: ${process.env.NEXT_PUBLIC_APP_URL}/admin
    `,
  };

  await transporter.sendMail(mailOptions);
}
