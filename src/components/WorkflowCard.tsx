import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Construction } from "lucide-react";
import { WorkflowDefinition } from "@/lib/workflows";

interface WorkflowCardProps {
  workflow: WorkflowDefinition;
}

export default function WorkflowCard({ workflow }: WorkflowCardProps) {
  const navigate = useNavigate();
  const hasRoute = !!workflow.route;

  function handleClick() {
    if (workflow.route) {
      navigate(workflow.route);
    }
  }

  return (
    <Card
      className={`transition-all duration-200 ${hasRoute ? "hover:shadow-md hover:border-future-red/30 cursor-pointer" : "opacity-75"}`}
      onClick={hasRoute ? handleClick : undefined}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-future-red/10 text-future-red shrink-0">
            <workflow.icon className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base">{workflow.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {workflow.description}
            </p>
            <div className="mt-4">
              {hasRoute ? (
                <Button size="sm">
                  Start workflow
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" variant="outline" disabled>
                  <Construction className="h-4 w-4 mr-1" />
                  Coming soon
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
