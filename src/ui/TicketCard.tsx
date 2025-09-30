"use client";

interface TicketCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  note?: string;
  highlighted?: boolean;
}

export function TicketCard({ title, price, description, features, note, highlighted = false }: TicketCardProps) {
  return (
    <div className={`card h-full flex flex-col ${highlighted ? 'ring-2 ring-brand-primary' : ''}`}>
      {highlighted && (
        <div className="mb-4 inline-block rounded-full bg-brand-primary px-3 py-1 text-xs font-medium text-white">
          おすすめ
        </div>
      )}

      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>

      <div className="mb-4 h-16 flex items-center">
        <span className="text-4xl font-bold text-brand-primary">{price}</span>
        <span className="text-slate-600 ml-1">円</span>
      </div>

      <p className="text-[15px] text-slate-600 mb-6">{description}</p>

      <div className="space-y-3 mb-6 flex-grow">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2 text-[15px] text-slate-700">
            <svg className="h-5 w-5 text-brand-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{feature}</span>
          </div>
        ))}
      </div>

      {note && (
        <p className="text-xs text-slate-500 pt-4 border-t border-slate-200">{note}</p>
      )}
    </div>
  );
}