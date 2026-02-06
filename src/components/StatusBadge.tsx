import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReviewStatus = "None" | "Pending" | "Approved" | "Rejected";
type RequestStatus = "pending" | "in_progress" | "completed" | "rejected";
type LockStatus = "unlocked" | "locked";

const reviewStatusStyles: Record<ReviewStatus, string> = {
  None: "bg-neutral-grey/20 text-future-blue border-neutral-grey/40",
  Pending: "bg-amber-50 text-amber-800 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  Rejected: "bg-red-50 text-future-red border-red-200",
};

const requestStatusStyles: Record<RequestStatus, string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  in_progress: "bg-blue-50 text-deep-blue border-blue-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-future-red border-red-200",
};

const requestStatusLabels: Record<RequestStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

const lockStatusStyles: Record<LockStatus, string> = {
  unlocked: "bg-orange-50 text-orange-700 border-orange-200",
  locked: "bg-neutral-grey/20 text-future-blue/70 border-neutral-grey/40",
};

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", reviewStatusStyles[status])}>
      {status}
    </Badge>
  );
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium", requestStatusStyles[status])}>
      {requestStatusLabels[status]}
    </Badge>
  );
}

export function LockStatusBadge({ status }: { status: LockStatus }) {
  return (
    <Badge variant="outline" className={cn("font-medium capitalize", lockStatusStyles[status])}>
      {status}
    </Badge>
  );
}
