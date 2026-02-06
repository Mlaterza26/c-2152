export interface Invoice {
  id: string;
  salesOrderId: number;
  salesOrderName: string;
  primaryAdvertiserName: string;
  billingAccountName: string;
  externalPoNumber: string;
  netInvoiceAmount: number; // in cents
  reviewStatus: "None" | "Pending" | "Approved" | "Rejected";
  invoiceLockStatus: "unlocked" | "locked";
  assignedTo: string;
  billingPeriodName: string;
}

export interface CreditRequest {
  id: string;
  invoiceId: string;
  salesOrderName: string;
  advertiserName: string;
  creditAmount: number; // in cents
  reason: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: string;
  updatedAt: string;
  requestedBy: string;
  asanaTaskUrl?: string;
}

export interface WorkflowConfig {
  workflowId: string;
  workflowName: string;
  team: string;
  asanaProjectGid: string;
  asanaAssigneeGid: string;
  notificationEmails: string[];
  formFields: WorkflowFormField[];
}

export interface WorkflowFormField {
  fieldId: string;
  type: "currency" | "textarea" | "text" | "select";
  label: string;
  required: boolean;
  options?: string[];
}

export interface DashboardStats {
  totalInvoices: number;
  totalNetAmount: number;
  pendingRequests: number;
  completedRequests: number;
  unlockedInvoices: number;
  uniqueAdvertisers: number;
}

export type InvoiceFilterKey = "advertiser" | "status" | "billingPeriod" | "assignedTo" | "lockStatus";

export interface InvoiceFilters {
  advertiser: string;
  status: string;
  billingPeriod: string;
  assignedTo: string;
  lockStatus: string;
  search: string;
}
