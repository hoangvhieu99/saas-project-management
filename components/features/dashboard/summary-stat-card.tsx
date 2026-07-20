type SummaryStatCardProps = {
  label: string;
  value: number;
};

export function SummaryStatCard({ label, value }: SummaryStatCardProps) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-stone-900">{value}</p>
    </div>
  );
}
