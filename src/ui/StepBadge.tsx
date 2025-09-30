interface StepBadgeProps {
  step: number;
  minutes?: number;
}

export function StepBadge({ step, minutes }: StepBadgeProps) {
  return (
    <div className="absolute -left-7 top-0 flex flex-col items-center gap-2">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-2xl font-bold text-white shadow-md">
        {step}
      </div>
      {minutes && (
        <span className="inline-flex items-center rounded-full bg-brand-light px-2 py-0.5 text-xs font-medium text-brand-dark whitespace-nowrap">
          {minutes}分
        </span>
      )}
    </div>
  );
}