"use client";

interface Step {
  number: number;
  title: string;
  description: string;
}

interface StepperProps {
  steps: Step[];
}

export function Stepper({ steps }: StepperProps) {
  return (
    <div className="relative">
      {/* 縦線 */}
      <div className="absolute left-6 top-12 bottom-12 w-px bg-slate-200 hidden md:block" />

      <div className="space-y-8">
        {steps.map((step, index) => (
          <div key={step.number} className="relative flex gap-6 items-start animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
            {/* ステップ番号 */}
            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary text-white text-xl font-bold shadow-md z-10">
              {step.number}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 pt-1.5">
              <h3 className="text-xl font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-slate-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}