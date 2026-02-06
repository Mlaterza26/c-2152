import { FileText, DollarSign, Clock, CheckCircle, Unlock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardStats } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

interface StatsCardsProps {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Invoices",
      value: stats.totalInvoices.toLocaleString(),
      icon: FileText,
      color: "text-deep-blue bg-deep-blue/10",
    },
    {
      label: "Net Amount",
      value: formatCurrency(stats.totalNetAmount),
      icon: DollarSign,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Pending Requests",
      value: stats.pendingRequests.toString(),
      icon: Clock,
      color: "text-amber-700 bg-amber-50",
    },
    {
      label: "Completed Requests",
      value: stats.completedRequests.toString(),
      icon: CheckCircle,
      color: "text-emerald-700 bg-emerald-50",
    },
    {
      label: "Unlocked Invoices",
      value: stats.unlockedInvoices.toString(),
      icon: Unlock,
      color: "text-future-red bg-future-red/10",
    },
    {
      label: "Advertisers",
      value: stats.uniqueAdvertisers.toString(),
      icon: Users,
      color: "text-electric-blue bg-electric-blue/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">{card.label}</p>
                <p className="text-lg font-semibold truncate">{card.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
