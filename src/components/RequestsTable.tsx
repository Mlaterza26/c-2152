import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { creditRequests } from "@/lib/mockData";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { RequestStatusBadge } from "@/components/StatusBadge";

const ALL_VALUE = "__all__";

export default function RequestsTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = useMemo(() => {
    return creditRequests.filter((req) => {
      if (statusFilter && req.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          req.id.toLowerCase().includes(q) ||
          req.salesOrderName.toLowerCase().includes(q) ||
          req.advertiserName.toLowerCase().includes(q) ||
          req.requestedBy.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [search, statusFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Requests</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by request ID, order, advertiser..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter || ALL_VALUE} onValueChange={(v) => setStatusFilter(v === ALL_VALUE ? "" : v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">Request ID</TableHead>
                <TableHead>Sales Order</TableHead>
                <TableHead>Advertiser</TableHead>
                <TableHead className="text-right">Credit Amount</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                    No requests found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-mono text-xs font-medium">{req.id}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={req.salesOrderName}>
                      {req.salesOrderName}
                    </TableCell>
                    <TableCell>{req.advertiserName}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(req.creditAmount)}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate" title={req.reason}>
                      {req.reason}
                    </TableCell>
                    <TableCell>
                      <RequestStatusBadge status={req.status} />
                    </TableCell>
                    <TableCell>{req.requestedBy}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(req.createdAt)}</TableCell>
                    <TableCell className="text-sm">{formatDateTime(req.updatedAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
