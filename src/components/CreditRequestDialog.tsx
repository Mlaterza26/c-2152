import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Invoice, LineItem } from "@/lib/types";
import { lineItemsByInvoice } from "@/lib/mockData";
import { formatCurrency } from "@/lib/format";
import { CheckCircle, Download, Loader2 } from "lucide-react";
import * as XLSX from "xlsx";

interface LineItemRevision {
  revisedNetAmount: string;
  revisedUnits: string;
}

interface CreditRequestDialogProps {
  invoice: Invoice | null;
  onClose: () => void;
}

function getNetImpact(lineItem: LineItem, revision: LineItemRevision | undefined): number | null {
  if (!revision?.revisedNetAmount || parseFloat(revision.revisedNetAmount) === 0) {
    return null;
  }
  const revisedCents = Math.round(parseFloat(revision.revisedNetAmount) * 100);
  return revisedCents - lineItem.netAmount;
}

export default function CreditRequestDialog({ invoice, onClose }: CreditRequestDialogProps) {
  const [revisions, setRevisions] = useState<Record<string, LineItemRevision>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const { toast } = useToast();

  const lineItems: LineItem[] = useMemo(() => {
    if (!invoice) return [];
    return lineItemsByInvoice[invoice.id] || [];
  }, [invoice]);

  const totals = useMemo(() => {
    let netAmountTotal = 0;
    let grossAmountTotal = 0;
    let revisedNetTotal = 0;
    let netImpactTotal = 0;
    let hasAnyRevision = false;

    lineItems.forEach((li) => {
      netAmountTotal += li.netAmount;
      grossAmountTotal += li.grossAmount;

      const rev = revisions[li.lineItemId];
      const impact = getNetImpact(li, rev);

      if (rev?.revisedNetAmount && parseFloat(rev.revisedNetAmount) !== 0) {
        revisedNetTotal += Math.round(parseFloat(rev.revisedNetAmount) * 100);
        hasAnyRevision = true;
      }

      if (impact !== null) {
        netImpactTotal += impact;
      }
    });

    return { netAmountTotal, grossAmountTotal, revisedNetTotal, netImpactTotal, hasAnyRevision };
  }, [lineItems, revisions]);

  function handleClose() {
    setRevisions({});
    setSubmitting(false);
    setSubmitted(false);
    setRequestId("");
    onClose();
  }

  function updateRevision(lineItemId: string, field: keyof LineItemRevision, value: string) {
    setRevisions((prev) => ({
      ...prev,
      [lineItemId]: {
        ...prev[lineItemId],
        [field]: value,
      },
    }));
  }

  const revisedLineItems = useMemo(() => {
    return lineItems.filter((li) => {
      const rev = revisions[li.lineItemId];
      return rev && (rev.revisedNetAmount || rev.revisedUnits);
    });
  }, [lineItems, revisions]);

  function handleExportExcel() {
    if (!invoice) return;

    const headerRows = [
      ["Credit Revision Request"],
      [],
      ["Order", invoice.salesOrderName],
      ["Advertiser", invoice.primaryAdvertiserName],
      ["Billing Account", invoice.billingAccountName],
      ["Invoice Amount", formatCurrency(invoice.netInvoiceAmount)],
      ["Billing Period", invoice.billingPeriodName],
      [],
      ["Line Item ID", "Line Item Name", "Product", "Net Amount", "Gross Amount", "Revised Net Amount", "Net Impact", "Revised Units"],
    ];

    const dataRows = lineItems.map((li) => {
      const rev = revisions[li.lineItemId];
      const impact = getNetImpact(li, rev);
      return [
        li.lineItemId,
        li.lineItemName,
        li.product,
        li.netAmount / 100,
        li.grossAmount / 100,
        rev?.revisedNetAmount && parseFloat(rev.revisedNetAmount) !== 0
          ? parseFloat(rev.revisedNetAmount)
          : "",
        impact !== null ? impact / 100 : "",
        rev?.revisedUnits || "",
      ];
    });

    const totalsRow = [
      "TOTALS",
      "",
      "",
      totals.netAmountTotal / 100,
      totals.grossAmountTotal / 100,
      totals.hasAnyRevision ? totals.revisedNetTotal / 100 : "",
      totals.hasAnyRevision ? totals.netImpactTotal / 100 : "",
      "",
    ];

    const allRows = [...headerRows, ...dataRows, totalsRow];
    const ws = XLSX.utils.aoa_to_sheet(allRows);

    // Set column widths
    ws["!cols"] = [
      { wch: 14 },
      { wch: 30 },
      { wch: 20 },
      { wch: 14 },
      { wch: 14 },
      { wch: 18 },
      { wch: 14 },
      { wch: 14 },
    ];

    // Format currency cells (data rows start at row index 9, 0-indexed)
    const dataStartRow = headerRows.length;
    for (let r = dataStartRow; r < dataStartRow + dataRows.length + 1; r++) {
      for (const col of [3, 4, 5, 6]) { // Net Amount, Gross Amount, Revised Net, Net Impact
        const cellRef = XLSX.utils.encode_cell({ r, c: col });
        const cell = ws[cellRef];
        if (cell && typeof cell.v === "number") {
          cell.z = "$#,##0.00";
        }
      }
    }

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Credit Request");

    const date = new Date().toISOString().split("T")[0];
    const orderId = invoice.salesOrderId;
    XLSX.writeFile(wb, `Credit_Request_${orderId}_${date}.xlsx`);
  }

  async function handleSubmit() {
    if (revisedLineItems.length === 0) {
      toast({
        title: "No revisions entered",
        description: "Please fill in Revised Net Amount or Revised Units for at least one line item.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newId = `CR-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    setRequestId(newId);
    setSubmitted(true);
    setSubmitting(false);

    toast({
      title: "Credit request submitted",
      description: `Request ${newId} has been created and routed to Finance.`,
    });
  }

  if (!invoice) return null;

  return (
    <Dialog open={!!invoice} onOpenChange={() => handleClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] flex flex-col">
        {submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Request Submitted
              </DialogTitle>
              <DialogDescription>
                Your credit request has been created and routed to the Finance team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 space-y-2">
                <p className="font-medium text-amber-800">DEMO MODE - Request ID: {requestId}</p>
                <p className="text-sm text-amber-700">
                  This is a prototype. No Asana task was created and no email was sent.
                  In production, this will create a task in "Finance - Credit Requests"
                  and notify finance@futureplc.com.
                </p>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">Invoice:</span> {invoice.salesOrderName}</p>
                <p><span className="font-medium">Advertiser:</span> {invoice.primaryAdvertiserName}</p>
                <p><span className="font-medium">Line items revised:</span> {revisedLineItems.length}</p>
                <p>
                  <span className="font-medium">Total Net Impact:</span>{" "}
                  <span className={totals.netImpactTotal > 0 ? "text-green-600 font-medium" : totals.netImpactTotal < 0 ? "text-red-600 font-medium" : ""}>
                    {formatCurrency(totals.netImpactTotal)}
                  </span>
                </p>
              </div>

              <div className="rounded-md border overflow-auto max-h-48">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Line Item</TableHead>
                      <TableHead className="text-right">Original Net</TableHead>
                      <TableHead className="text-right">Revised Net</TableHead>
                      <TableHead className="text-right">Net Impact</TableHead>
                      <TableHead className="text-right">Revised Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {revisedLineItems.map((li) => {
                      const rev = revisions[li.lineItemId];
                      const impact = getNetImpact(li, rev);
                      return (
                        <TableRow key={li.lineItemId}>
                          <TableCell className="text-sm">{li.lineItemName}</TableCell>
                          <TableCell className="text-right text-sm">{formatCurrency(li.netAmount)}</TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {rev?.revisedNetAmount ? `$${parseFloat(rev.revisedNetAmount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "-"}
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {impact !== null ? (
                              <span className={impact > 0 ? "text-green-600" : impact < 0 ? "text-red-600" : ""}>
                                {formatCurrency(impact)}
                              </span>
                            ) : "-"}
                          </TableCell>
                          <TableCell className="text-right text-sm font-medium">
                            {rev?.revisedUnits || "-"}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Request Credit Revision</DialogTitle>
              <DialogDescription>
                Review the line items below and enter revised amounts for the items that need credit adjustment.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 flex-1 overflow-hidden flex flex-col">
              <div className="rounded-lg bg-muted p-3 space-y-1 text-sm shrink-0">
                <p><span className="font-medium">Order:</span> {invoice.salesOrderName}</p>
                <p><span className="font-medium">Advertiser:</span> {invoice.primaryAdvertiserName} &middot; <span className="font-medium">Account:</span> {invoice.billingAccountName}</p>
                <p><span className="font-medium">Invoice Amount:</span> {formatCurrency(invoice.netInvoiceAmount)} &middot; <span className="font-medium">Period:</span> {invoice.billingPeriodName}</p>
              </div>

              <div className="rounded-md border overflow-auto flex-1">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[90px]">Line Item ID</TableHead>
                      <TableHead>Line Item Name</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Net Amount</TableHead>
                      <TableHead className="text-right">Gross Amount</TableHead>
                      <TableHead className="text-right w-[140px]">Revised Net Amount</TableHead>
                      <TableHead className="text-right w-[110px]">Net Impact</TableHead>
                      <TableHead className="text-right w-[120px]">Revised Units</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((li) => {
                      const rev = revisions[li.lineItemId];
                      const impact = getNetImpact(li, rev);
                      return (
                        <TableRow key={li.lineItemId}>
                          <TableCell className="font-mono text-xs">{li.lineItemId}</TableCell>
                          <TableCell className="text-sm max-w-[200px] truncate" title={li.lineItemName}>
                            {li.lineItemName}
                          </TableCell>
                          <TableCell className="text-sm">{li.product}</TableCell>
                          <TableCell className="text-right text-sm">{formatCurrency(li.netAmount)}</TableCell>
                          <TableCell className="text-right text-sm">{formatCurrency(li.grossAmount)}</TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="h-8 text-right text-sm w-[120px] ml-auto"
                              value={revisions[li.lineItemId]?.revisedNetAmount || ""}
                              onChange={(e) => updateRevision(li.lineItemId, "revisedNetAmount", e.target.value)}
                            />
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {impact !== null ? (
                              <span className={`font-medium ${impact > 0 ? "text-green-600" : impact < 0 ? "text-red-600" : ""}`}>
                                {formatCurrency(impact)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              placeholder="0"
                              className="h-8 text-right text-sm w-[100px] ml-auto"
                              value={revisions[li.lineItemId]?.revisedUnits || ""}
                              onChange={(e) => updateRevision(li.lineItemId, "revisedUnits", e.target.value)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {/* TOTALS row */}
                    <TableRow className="border-t-2 border-future-red bg-[#f5f5f5]">
                      <TableCell className="font-bold text-sm">TOTALS</TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell className="text-right text-sm font-bold">{formatCurrency(totals.netAmountTotal)}</TableCell>
                      <TableCell className="text-right text-sm font-bold">{formatCurrency(totals.grossAmountTotal)}</TableCell>
                      <TableCell className="text-right text-sm font-bold">
                        {totals.hasAnyRevision ? formatCurrency(totals.revisedNetTotal) : "-"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-bold">
                        {totals.hasAnyRevision ? (
                          <span className={totals.netImpactTotal > 0 ? "text-green-600" : totals.netImpactTotal < 0 ? "text-red-600" : ""}>
                            {formatCurrency(totals.netImpactTotal)}
                          </span>
                        ) : "-"}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {revisedLineItems.length > 0 && (
                <p className="text-sm text-muted-foreground shrink-0">
                  {revisedLineItems.length} line item{revisedLineItems.length !== 1 ? "s" : ""} will be included in this request.
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 shrink-0">
              <div className="flex w-full justify-between">
                <Button
                  variant="outline"
                  onClick={handleExportExcel}
                  className="border-future-blue text-future-blue hover:bg-future-blue hover:text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export to Excel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>Cancel</Button>
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
