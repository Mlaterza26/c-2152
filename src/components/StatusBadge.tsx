import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReviewStatus = "None" | "Pending" | "Approved" | "Rejected";
type RequestStatus = "pending" | "in_progress" | "completed" | "rejected";
type LockStatus = "unlocked" | "locked";

const reviewStatusStyles: Record<ReviewStatus, string> = {
  None: "bg-gray-100 text-gray-700 border-gray-200",
  Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Approved: "bg-green-50 text-green-700 border-green-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

const requestStatusStyles: Record<RequestStatus, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  in_progress: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const requestStatusLabels: Record<RequestStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

const lockStatusStyles: Record<LockStatus, string> = {
  unlocked: "bg-orange-50 text-orange-700 border-orange-200",
  locked: "bg-slate-100 text-slate-600 border-slate-200",
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
