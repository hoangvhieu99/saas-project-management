import { SummaryStatCard } from "@/components/features/dashboard/summary-stat-card";

type DashboardSummaryProps = {
  total: number;
  ownerCount: number;
  memberCount: number;
};

export function DashboardSummary({ total, ownerCount, memberCount }: DashboardSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SummaryStatCard label="Workspaces" value={total} />
      <SummaryStatCard label="Owner" value={ownerCount} />
      <SummaryStatCard label="Member" value={memberCount} />
    </div>
  );
}
