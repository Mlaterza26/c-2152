import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import InvoiceTable from "@/components/InvoiceTable";

export default function RevenueCreditWorkflow() {
  return (
    <div className="space-y-6">
      <div>
        <Link to="/team/client-success">
          <Button variant="ghost" size="sm" className="mb-2 -ml-2 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Client Success
          </Button>
        </Link>
        <h2 className="text-2xl font-bold">Revenue Credit Request</h2>
        <p className="text-muted-foreground">
          Find the invoice below and click "Credit" to submit a revision request. Finance will be notified and process in Operative.One.
        </p>
      </div>

      <InvoiceTable />
    </div>
  );
}
