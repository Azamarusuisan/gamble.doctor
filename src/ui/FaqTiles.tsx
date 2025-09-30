"use client";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqTilesProps {
  items: FaqItem[];
}

export function FaqTiles({ items }: FaqTilesProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <div key={index} className="card animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">{item.question}</h3>
          <p className="text-[15px] leading-relaxed text-slate-600">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}