'use client';

import { StepBadge } from "./StepBadge";
import { PrepList } from "./PrepList";

interface PrepItem {
  icon: string;
  label: string;
}

interface FlowCardProps {
  step: number;
  title: string;
  minutes?: number;
  bullets: string[];
  prepItems?: PrepItem[];
  isEven?: boolean;
}

export function FlowCard({ step, title, minutes, bullets, prepItems, isEven = false }: FlowCardProps) {
  return (
    <div className={`relative animate-fade-in rounded-[28px] border border-slate-200 bg-white p-7 md:p-8 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${isEven ? 'md:translate-y-4' : ''}`}>
      <StepBadge step={step} minutes={minutes} />

      {/* 左インセットバー */}
      <div className="absolute left-0 top-6 h-16 w-1 rounded-r-full bg-brand-primary/10" />

      <div className="pl-5">
        <h3 className="text-xl font-semibold text-slate-900 md:text-[22px]">
          {title}
        </h3>

        <ul className="mt-4 space-y-2">
          {bullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-2 text-[15.5px] leading-7 text-slate-700 md:text-[16px]">
              <span className="mt-1 text-brand-primary">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {prepItems && prepItems.length > 0 && (
          <PrepList items={prepItems} />
        )}
      </div>
    </div>
  );
}