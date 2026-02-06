import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Invoice } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { CheckCircle, Loader2 } from "lucide-react";

interface CreditRequestDialogProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function CreditRequestDialog({ invoice, onClose }: CreditRequestDialogProps) {
  const [creditAmount, setCreditAmount] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const { toast } = useToast();

  function handleClose() {
    setCreditAmount("");
    setReason("");
    setSubmitting(false);
    setSubmitted(false);
    setRequestId("");
    onClose();
  }

  async function handleSubmit() {
    if (!creditAmount || !reason) {
      toast({
        title: "Missing fields",
        description: "Please fill in both Credit Amount and Reason.",
        variant: "destructive",
      });
      return;
    }

    const amountCents = Math.round(parseFloat(creditAmount) * 100);
    if (isNaN(amountCents) || amountCents <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid credit amount.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    // Simulate API call - in production this would POST to /api/workflows/credit-request
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
      <DialogContent className="sm:max-w-lg">
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
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 space-y-2">
                <p className="font-medium text-green-800">Request ID: {requestId}</p>
                <p className="text-sm text-green-700">
                  An Asana task has been created in the "Finance - Credit Requests" project
                  and an email notification has been sent to finance@futureplc.com.
                </p>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p><span className="font-medium">Invoice:</span> {invoice.salesOrderName}</p>
                <p><span className="font-medium">Advertiser:</span> {invoice.primaryAdvertiserName}</p>
                <p><span className="font-medium">Credit Amount:</span> ${creditAmount}</p>
                <p><span className="font-medium">Reason:</span> {reason}</p>
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
                Submit a credit request for this invoice. Finance will be notified and process in Operative.One.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
                <p><span className="font-medium">Order:</span> {invoice.salesOrderName}</p>
                <p><span className="font-medium">Advertiser:</span> {invoice.primaryAdvertiserName}</p>
                <p><span className="font-medium">Account:</span> {invoice.billingAccountName}</p>
                <p><span className="font-medium">Invoice Amount:</span> {formatCurrency(invoice.netInvoiceAmount)}</p>
                <p><span className="font-medium">Period:</span> {invoice.billingPeriodName}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credit-amount">Credit Amount ($)</Label>
                <Input
                  id="credit-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Describe why this credit is needed..."
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
