import { ReactNode } from "react";

export function Section({ id, eyebrow, title, description, children }: {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl text-center">
        {eyebrow ? <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">{eyebrow}</p> : null}
        <h2 className="section-title">{title}</h2>
        {description ? <p className="section-subtitle text-center">{description}</p> : null}
      </div>
      {children ? <div className="mt-12">{children}</div> : null}
    </section>
  );
}
