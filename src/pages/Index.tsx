import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Haumaru Academy
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Access your student portal and manage your learning journey
        </p>
        <Link to="/dashboard">
          <Button className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            Go to Student Portal
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
