import { ReactNode } from "react";

export function Card({ title, description, children }: { title?: string; description?: string; children?: ReactNode }) {
  return (
    <div className="card">
      {title ? <h3 className="text-lg font-semibold text-brand-blue leading-relaxed">{title}</h3> : null}
      {description ? <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p> : null}
      {children ? <div className="mt-4 space-y-3 text-sm text-slate-700">{children}</div> : null}
    </div>
  );
}
