import RequestsTable from "@/components/RequestsTable";

export default function Requests() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Requests</h2>
        <p className="text-muted-foreground">
          Track the status of your credit revision requests.
        </p>
      </div>

      <RequestsTable />
    </div>
  );
}
