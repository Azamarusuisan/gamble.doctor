import { NextRequest, NextResponse } from "next/server";

// システムプロンプト: ギャンブル依存症専門の相談AI
const SYSTEM_PROMPT = `あなたは「gambleやめる君」です。ギャンブル依存症に悩む方々をサポートする、温かく親身なAIアシスタントです。

## あなたの役割
- ギャンブル依存症に関する相談に、共感的かつ専門的に対応する
- 医療行為は行わず、適切なタイミングで専門医への相談を勧める
- 相談者の気持ちに寄り添い、前向きなサポートを提供する

## 対応方針
1. **共感と傾聴**: まず相談者の気持ちを受け止め、共感する
2. **非判断的態度**: 責めたり説教したりせず、理解を示す
3. **具体的な提案**: 実践可能な小さな一歩を提案する
4. **適切な紹介**: 必要に応じてセルフチェック(/check)や予約(/book)を案内

## 話し方
- 親しみやすく、温かい口調
- 専門用語は避け、わかりやすい言葉で
- 短めの文章で、読みやすく
- 絵文字は控えめに使用

## 重要な注意点
- 医療診断や治療は行わない
- 緊急性が高い場合は速やかに専門医や相談窓口を案内
- プライバシーに配慮し、相談内容は機密として扱う
- ギャンブル依存症は病気であり、意志の弱さではないことを伝える

## よくある相談への対応例
- **「やめられない」**: 依存症は病気であり、一人で抱え込まなくて良いことを伝える
- **「借金がある」**: 司法書士や弁護士への相談を勧める
- **「家族に知られたくない」**: 守秘義務と匿名相談の可能性を説明
- **「何から始めれば」**: セルフチェックや専門医への相談を提案`;

// デモ環境用のモックレスポンス生成
function generateMockResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // キーワードベースの簡易応答
  if (lowerMessage.includes("やめられない") || lowerMessage.includes("止められない")) {
    return "お話を聞かせていただき、ありがとうございます。ギャンブルをやめたいのにやめられない、その苦しさは本当におつらいですよね。\n\nギャンブル依存症は意志の弱さではなく、脳の病気です。一人で抱え込まず、専門家に相談することが回復への第一歩になります。\n\n当クリニックでは、オンラインで気軽に相談できる環境を整えています。まずはセルフチェックで現在の状態を確認してみませんか？";
  }

  if (lowerMessage.includes("借金") || lowerMessage.includes("お金")) {
    return "金銭的な問題を抱えていらっしゃるのですね。とても不安なお気持ちだと思います。\n\nギャンブルによる借金問題は、専門家のサポートで解決できることが多いです。司法書士や弁護士に相談することで、債務整理などの選択肢があります。\n\n当クリニックでも、必要に応じて専門機関をご紹介しています。まずは現状を整理するため、一度ご相談いただけますか？";
  }

  if (lowerMessage.includes("家族") || lowerMessage.includes("妻") || lowerMessage.includes("夫")) {
    return "ご家族との関係でお悩みなのですね。ギャンブル依存症は本人だけでなく、ご家族も大きな影響を受けます。\n\n当クリニックでは、ご本人だけでなくご家族の方からの相談も受け付けています。ご家族と一緒に回復を目指すサポートプログラムもご用意しています。\n\n一人で抱え込まず、まずはお気軽にご相談ください。";
  }

  if (lowerMessage.includes("予約") || lowerMessage.includes("診察")) {
    return "オンライン診療のご予約に興味を持っていただき、ありがとうございます。\n\n当クリニックでは、ご自宅から安心して診療を受けられるオンライン診療を提供しています。浦江晋平医師が、お一人お一人に寄り添った診療を行います。\n\n予約ページから、ご都合の良い日時をお選びいただけます。ご不明な点があれば、お気軽にお尋ねください。";
  }

  if (lowerMessage.includes("料金") || lowerMessage.includes("費用")) {
    return "料金についてのご質問ですね。\n\n初診は8,800円、再診は5,500円を目安としています。保険適用外のオンライン診療となりますが、ご自宅から受診できるメリットがあります。\n\n詳しい料金については、料金ページをご確認いただくか、予約時にご案内させていただきます。";
  }

  if (lowerMessage.includes("セルフチェック") || lowerMessage.includes("チェック")) {
    return "セルフチェックは、現在の状態を客観的に把握する良い方法です。\n\n7つの質問に答えるだけで、ギャンブル問題のリスクを簡易判定できます。結果は安全に保管され、診療時の参考資料としても活用できます。\n\nセルフチェックページから、ぜひお試しください。";
  }

  // デフォルトレスポンス
  return "お話を聞かせていただき、ありがとうございます。\n\nギャンブルに関するお悩みは、一人で抱え込まず相談することが大切です。当クリニックでは、専門医が親身になってサポートいたします。\n\n具体的にどのようなことでお困りですか？もう少し詳しく教えていただけると、より適切なアドバイスができるかもしれません。";
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    // 最後のユーザーメッセージを取得
    const lastUserMessage = messages
      .filter((m: { role: string }) => m.role === "user")
      .pop()?.content || "";

    // デモ環境用のモックレスポンス
    const mockResponse = generateMockResponse(lastUserMessage);

    // 本番環境では、ここでOpenAI APIを呼び出す
    // const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4",
    //     messages: [
    //       { role: "system", content: SYSTEM_PROMPT },
    //       ...messages
    //     ],
    //     temperature: 0.7,
    //     max_tokens: 500
    //   })
    // });

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("💬 [DEMO] gambleやめる君 チャット");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`👤 ユーザー: ${lastUserMessage}`);
    console.log(`🤖 AI応答: ${mockResponse}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return NextResponse.json({
      message: mockResponse
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
