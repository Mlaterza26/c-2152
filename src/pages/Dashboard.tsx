import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatsCards from "@/components/StatsCards";
import { ReviewStatusBadge, RequestStatusBadge } from "@/components/StatusBadge";
import { invoices, creditRequests } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";
import { DashboardStats } from "@/lib/types";

export default function Dashboard() {
  const stats: DashboardStats = useMemo(() => {
    const uniqueAdvertisers = new Set(invoices.map((i) => i.primaryAdvertiserName));
    return {
      totalInvoices: invoices.length,
      totalNetAmount: invoices.reduce((sum, i) => sum + i.netInvoiceAmount, 0),
      pendingRequests: creditRequests.filter((r) => r.status === "pending" || r.status === "in_progress").length,
      completedRequests: creditRequests.filter((r) => r.status === "completed").length,
      unlockedInvoices: invoices.filter((i) => i.invoiceLockStatus === "unlocked").length,
      uniqueAdvertisers: uniqueAdvertisers.size,
    };
  }, []);

  const recentInvoices = invoices.slice(0, 5);
  const recentRequests = creditRequests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">Overview of your order management activity</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Invoices</CardTitle>
            <Link to="/team/client-success/revenue-credit">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Advertiser</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Period</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.primaryAdvertiserName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(inv.netInvoiceAmount)}</TableCell>
                    <TableCell><ReviewStatusBadge status={inv.reviewStatus} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{inv.billingPeriodName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent Requests</CardTitle>
            <Link to="/requests">
              <Button variant="ghost" size="sm">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Advertiser</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs">{req.id}</TableCell>
                    <TableCell className="font-medium">{req.advertiserName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(req.creditAmount)}</TableCell>
                    <TableCell><RequestStatusBadge status={req.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
