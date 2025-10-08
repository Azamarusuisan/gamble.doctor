import { NextRequest, NextResponse } from "next/server";

function judgeRisk(score: number) {
  if (score <= 7) return "Low" as const;
  if (score <= 14) return "Moderate" as const;
  return "High" as const;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { score, answers } = body;

    if (typeof score !== "number" || score < 0 || score > 21) {
      return NextResponse.json(
        { error: { message: "スコアが不正です" } },
        { status: 400 }
      );
    }

    const risk = judgeRisk(score);
    const screeningId = `scr_${Date.now()}`;

    // モックデータとしてコンソールに出力
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 [DEMO] セルフチェック結果");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📝 スクリーニングID: ${screeningId}`);
    console.log(`📈 スコア: ${score}点`);
    console.log(`⚠️  リスクレベル: ${risk}`);
    console.log(`📋 回答: ${JSON.stringify(answers)}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    return NextResponse.json(
      { id: screeningId, risk },
      { status: 201 }
    );
  } catch (error) {
    console.error("Screening error:", error);
    return NextResponse.json(
      { error: { message: "内部エラーが発生しました" } },
      { status: 500 }
    );
  }
}
