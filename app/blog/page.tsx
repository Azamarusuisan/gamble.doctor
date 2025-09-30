import Image from "next/image";
import { Section } from "@/ui/Section";
import { Card } from "@/ui/Card";

const posts = [
  {
    title: "ギャンブル依存症の初期サイン（仮）",
    excerpt: "家族が気づきにくい初期シグナルと、受診につなげる声かけのコツを紹介します。",
    category: "家族向け",
    reading: "5 分"
  },
  {
    title: "オンライン外来でできること・できないこと",
    excerpt: "オンライン診療の活用ポイントと対面が必要なケースの切り分けについて整理します。",
    category: "診療の進め方",
    reading: "7 分"
  },
  {
    title: "依存症治療と金融リテラシー",
    excerpt: "ギャンブル依存とお金の管理。家計の可視化ツールや支援制度（仮）を紹介します。",
    category: "お金の整理",
    reading: "6 分"
  }
];

export default function BlogPage() {
  return (
    <Section
      title="コラム（プレースホルダ）"
      description="CMS 連携前の暫定コンテンツです。AI 生成画像や仮タイトルでレイアウトを確認しています。"
    >
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.title} title={post.title} description={`${post.category} ｜ 約 ${post.reading}`}> 
            <Image
              src="/images/blog-abstract.svg"
              alt={`${post.category}のコラムを表す抽象イラスト`}
              width={320}
              height={180}
              className="h-auto w-full rounded-2xl"
            />
            <p className="text-sm text-slate-600">{post.excerpt}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
