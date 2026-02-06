import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { InvoiceFilters as Filters } from "@/lib/types";
import { getUniqueValues } from "@/lib/mockData";

interface InvoiceFiltersProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: string) => void;
  onClearFilters: () => void;
}

const ALL_VALUE = "__all__";

export default function InvoiceFilters({ filters, onFilterChange, onClearFilters }: InvoiceFiltersProps) {
  const advertisers = getUniqueValues("primaryAdvertiserName");
  const statuses = ["None", "Pending", "Approved", "Rejected"];
  const periods = getUniqueValues("billingPeriodName");
  const assignees = getUniqueValues("assignedTo");
  const lockStatuses = ["unlocked", "locked"];

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => key !== "search" && value !== ""
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search invoices by order name, advertiser, PO number..."
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <Select value={filters.advertiser || ALL_VALUE} onValueChange={(v) => onFilterChange("advertiser", v === ALL_VALUE ? "" : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Advertiser" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Advertisers</SelectItem>
            {advertisers.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.status || ALL_VALUE} onValueChange={(v) => onFilterChange("status", v === ALL_VALUE ? "" : v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Review Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.billingPeriod || ALL_VALUE} onValueChange={(v) => onFilterChange("billingPeriod", v === ALL_VALUE ? "" : v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Billing Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Periods</SelectItem>
            {periods.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.assignedTo || ALL_VALUE} onValueChange={(v) => onFilterChange("assignedTo", v === ALL_VALUE ? "" : v)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Assignees</SelectItem>
            {assignees.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filters.lockStatus || ALL_VALUE} onValueChange={(v) => onFilterChange("lockStatus", v === ALL_VALUE ? "" : v)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Lock Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All Lock States</SelectItem>
            {lockStatuses.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-muted-foreground">
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  );
}
