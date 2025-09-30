interface PrepItem {
  icon: string;
  label: string;
}

interface PrepListProps {
  items: PrepItem[];
}

export function PrepList({ items }: PrepListProps) {
  const filteredItems = items.filter(item => item.label && item.label.trim() !== '');

  if (filteredItems.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      {filteredItems.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5 text-sm text-slate-600">
          <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}