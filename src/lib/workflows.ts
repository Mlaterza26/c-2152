import { LucideIcon } from "lucide-react";
import {
  CreditCard,
  CalendarClock,
  HelpCircle,
  FileCheck,
  Unlock,
} from "lucide-react";

export interface TeamDefinition {
  id: string;
  name: string;
  enabled: boolean;
}

export interface WorkflowDefinition {
  id: string;
  teamId: string;
  title: string;
  description: string;
  icon: LucideIcon;
  route?: string;
}

export const teams: TeamDefinition[] = [
  { id: "client-success", name: "Client Success", enabled: true },
  { id: "ad-ops", name: "Ad Ops", enabled: false },
  { id: "us-sales", name: "US Sales (FBH & GET$)", enabled: false },
  { id: "finance", name: "Finance", enabled: false },
  { id: "planning", name: "Planning", enabled: false },
  { id: "other", name: "Other", enabled: false },
];

export const workflows: WorkflowDefinition[] = [
  {
    id: "revenue-credit",
    teamId: "client-success",
    title: "Revenue Credit Request",
    description:
      "Submit a credit revision request for an invoice. Finance will be notified and process in Operative.One.",
    icon: CreditCard,
    route: "/team/client-success/revenue-credit",
  },
  {
    id: "custom-billing",
    teamId: "client-success",
    title: "Need Custom Billing Schedule Applied",
    description:
      "Request a custom billing schedule for an order that requires non-standard invoice timing.",
    icon: CalendarClock,
  },
  {
    id: "general-order-questions",
    teamId: "client-success",
    title: "General Order Questions",
    description:
      "Ask questions about an order's setup, delivery, pacing, or any other details you need clarified.",
    icon: HelpCircle,
  },
  {
    id: "eom-billing-help",
    teamId: "client-success",
    title: "EOM Billing Help",
    description:
      "Get help with end-of-month billing issues including reconciliation, adjustments, and close procedures.",
    icon: FileCheck,
  },
  {
    id: "invoice-unlocks",
    teamId: "client-success",
    title: "Invoice Unlocks",
    description:
      "Request an invoice to be unlocked in Operative.One so changes can be made before re-locking.",
    icon: Unlock,
  },
];

export function getTeamWorkflows(teamId: string): WorkflowDefinition[] {
  return workflows.filter((w) => w.teamId === teamId);
}
