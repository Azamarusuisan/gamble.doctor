import Image from "next/image";
import Link from "next/link";

interface IconItem {
  icon: string;
  label: string;
}

interface CTAButton {
  label: string;
  href: string;
}

interface ImageConfig {
  src: string;
  alt: string;
  asBackground?: boolean;
}

interface SectionZigzagProps {
  side: "image-left" | "image-right";
  headline: string;
  subcopy: string;
  bullets: string[];
  ctaPrimary: CTAButton;
  ctaSecondary?: CTAButton;
  image: ImageConfig;
  iconList?: IconItem[];
}

export function SectionZigzag({
  side,
  headline,
  subcopy,
  bullets,
  ctaPrimary,
  ctaSecondary,
  image,
  iconList,
}: SectionZigzagProps) {
  const isImageLeft = side === "image-left";

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6 md:py-28">
      <div className={`grid items-center gap-12 md:grid-cols-2 ${isImageLeft ? "" : "md:flex-row-reverse"}`}>
        {/* 画像カラム */}
        <div className={`${isImageLeft ? "md:order-1" : "md:order-2"} animate-fade-in`}>
          {image.asBackground ? (
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl border border-slate-200 shadow-lg">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-slate-900/30" />
            </div>
          ) : (
            <div className="relative h-[400px] md:h-[500px] overflow-hidden rounded-3xl border border-slate-200 shadow-lg transition-transform duration-300 hover:scale-[1.02]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          )}
        </div>

        {/* テキストカラム */}
        <div className={`${isImageLeft ? "md:order-2" : "md:order-1"} animate-slide-up`}>
          {/* 強調コピー */}
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
            {headline}
          </h2>
          <div className="mt-2 h-0.5 w-12 bg-brand-primary" />

          {/* 補足文 */}
          <p className="mt-6 text-[17px] leading-8 text-slate-600">
            {subcopy}
          </p>

          {/* Bullets */}
          <ul className="mt-6 space-y-3">
            {bullets.map((bullet, index) => (
              <li key={index} className="flex items-start gap-3 text-[15px] text-slate-700">
                <span className="mt-1 text-brand-primary">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* アイコン行 */}
          {iconList && iconList.length > 0 && iconList.some(item => item.icon) && (
            <div className="mt-8 flex flex-wrap gap-6">
              {iconList.filter(item => item.icon).map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light border border-brand-primary/30">
                    <span className="text-sm">{item.icon}</span>
                  </div>
                  <span className="text-sm text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={ctaPrimary.href}
              className="inline-flex items-center justify-center rounded-full bg-brand-primary px-8 py-4 font-semibold text-white transition-all duration-200 hover:bg-brand-accent hover:-translate-y-0.5 shadow-sm"
            >
              {ctaPrimary.label}
            </Link>
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center rounded-full border-2 border-slate-200 px-8 py-4 font-semibold text-slate-700 transition-all duration-200 hover:border-brand-primary hover:text-brand-primary hover:-translate-y-0.5"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}