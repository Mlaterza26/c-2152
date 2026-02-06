import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { Invoice, InvoiceFilters as Filters } from "@/lib/types";
import { invoices } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";
import { ReviewStatusBadge, LockStatusBadge } from "@/components/StatusBadge";
import InvoiceFilters from "@/components/InvoiceFilters";
import CreditRequestDialog from "@/components/CreditRequestDialog";

const PAGE_SIZE = 10;

const emptyFilters: Filters = {
  advertiser: "",
  status: "",
  billingPeriod: "",
  assignedTo: "",
  lockStatus: "",
  search: "",
};

export default function InvoiceTable() {
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [page, setPage] = useState(0);
  const [creditInvoice, setCreditInvoice] = useState<Invoice | null>(null);

  const filtered = useMemo(() => {
    return invoices.filter((inv) => {
      if (filters.advertiser && inv.primaryAdvertiserName !== filters.advertiser) return false;
      if (filters.status && inv.reviewStatus !== filters.status) return false;
      if (filters.billingPeriod && inv.billingPeriodName !== filters.billingPeriod) return false;
      if (filters.assignedTo && inv.assignedTo !== filters.assignedTo) return false;
      if (filters.lockStatus && inv.invoiceLockStatus !== filters.lockStatus) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          inv.salesOrderName.toLowerCase().includes(q) ||
          inv.primaryAdvertiserName.toLowerCase().includes(q) ||
          inv.externalPoNumber.toLowerCase().includes(q) ||
          inv.billingAccountName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  }

  function handleClearFilters() {
    setFilters(emptyFilters);
    setPage(0);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InvoiceFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  <TableHead>Sales Order</TableHead>
                  <TableHead>Advertiser</TableHead>
                  <TableHead>Billing Account</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead className="text-right">Net Amount</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Lock</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="h-24 text-center text-muted-foreground">
                      No invoices found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageData.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.salesOrderId}</TableCell>
                      <TableCell className="max-w-[250px] truncate font-medium" title={inv.salesOrderName}>
                        {inv.salesOrderName}
                      </TableCell>
                      <TableCell>{inv.primaryAdvertiserName}</TableCell>
                      <TableCell>{inv.billingAccountName}</TableCell>
                      <TableCell className="font-mono text-xs">{inv.externalPoNumber}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(inv.netInvoiceAmount)}
                      </TableCell>
                      <TableCell>
                        <ReviewStatusBadge status={inv.reviewStatus} />
                      </TableCell>
                      <TableCell>
                        <LockStatusBadge status={inv.invoiceLockStatus} />
                      </TableCell>
                      <TableCell>{inv.assignedTo}</TableCell>
                      <TableCell>{inv.billingPeriodName}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCreditInvoice(inv)}
                          className="text-xs"
                        >
                          <CreditCard className="h-3.5 w-3.5 mr-1" />
                          Credit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}-
              {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} invoices
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreditRequestDialog
        invoice={creditInvoice}
        onClose={() => setCreditInvoice(null)}
      />
    </>
  );
}
