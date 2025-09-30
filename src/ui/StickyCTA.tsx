import Link from "next/link";

export function StickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 text-sm sm:px-6">
        <div className="hidden text-slate-600 sm:block">
          迷ったら匿名相談から。ご家族のサポートも歓迎しています。
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          <Link href="#anonymous-inquiry" className="btn-secondary flex-1 sm:flex-none">
            匿名相談
          </Link>
          <Link href="/book" className="btn-primary flex-1 sm:flex-none">
            予約する
          </Link>
        </div>
      </div>
    </div>
  );
}
