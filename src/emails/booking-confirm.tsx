type BookingConfirmParams = {
  name: string;
  date: string;
  time: string;
  doctor: string;
  videoUrl?: string;
};

export function renderBookingConfirmEmail({ name, date, time, doctor, videoUrl }: BookingConfirmParams) {
  const videoSection = videoUrl
    ? `
        <p style="line-height: 1.8;">
          診療当日は以下のURLからご入室ください：<br />
          <a href="${videoUrl}" style="color: #0f4c81;">${videoUrl}</a>
        </p>
      `
    : "";

  return `<!doctype html>
<html lang="ja">
  <body style="font-family: 'Noto Sans JP', Arial, sans-serif; background: #f4f6f8; padding: 24px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px;">
      <tbody>
        <tr>
          <td>
            <h1 style="color: #0f4c81; font-size: 20px; margin-bottom: 24px;">ギャンブルドクター ご予約確認</h1>
            <p style="line-height: 1.8;">こんにちは、${name} 様。</p>
            <p style="line-height: 1.8;">
              以下の内容でオンライン診療のご予約を受け付けました。
            </p>
            <ul style="padding-left: 20px; line-height: 1.8;">
              <li>診療日: ${date}</li>
              <li>開始予定: ${time}</li>
              <li>担当医: ${doctor}</li>
            </ul>
            ${videoSection}
            <p style="line-height: 1.8;">
              ※本メールはデモ環境からの送信です。決済および診療は確定していません。
            </p>
            <hr style="margin: 32px 0; border: 0; border-top: 1px solid #e5e7eb;" />
            <p style="font-size: 12px; color: #6b7280;">
              ギャンブルドクター（オンライン外来）<br />
              本メールは送信専用です。ご不明点は匿名相談フォームよりお問い合わせください。
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
}
