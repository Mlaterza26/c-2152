import InvoiceTable from "@/components/InvoiceTable";

export default function Invoices() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Invoices</h2>
        <p className="text-muted-foreground">
          Browse invoices synced from Operative.One. Click "Credit" to request a credit revision.
        </p>
      </div>

      <InvoiceTable />
    </div>
  );
}
