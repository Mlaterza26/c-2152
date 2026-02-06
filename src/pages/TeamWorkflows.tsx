import { useParams, Navigate } from "react-router-dom";
import { teams, getTeamWorkflows } from "@/lib/workflows";
import WorkflowCard from "@/components/WorkflowCard";

export default function TeamWorkflows() {
  const { teamId } = useParams<{ teamId: string }>();

  const team = teams.find((t) => t.id === teamId);

  if (!team || !team.enabled) {
    return <Navigate to="/" replace />;
  }

  const teamWorkflows = getTeamWorkflows(team.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{team.name}</h2>
        <p className="text-muted-foreground">
          Select a workflow to get started. Your request will be routed to the right team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teamWorkflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </div>
    </div>
  );
}
