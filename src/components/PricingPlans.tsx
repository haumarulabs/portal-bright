import { Check, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: number;
  duration: string;
  description: string;
  features: PlanFeature[];
  isBestValue?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Weekly",
    price: 20,
    duration: "7 Days Access",
    description: "Perfect for short-term projects",
    features: [
      { text: "Full Red Team Lab Access", included: true },
      { text: "All VPN Profiles", included: true },
      { text: "24/7 Lab Availability", included: true },
      { text: "Basic Support", included: true },
      { text: "All Tools Access", included: true },
    ],
  },
  {
    name: "Bi-Weekly",
    price: 25,
    duration: "15 Days Access",
    description: "Most popular choice",
    isBestValue: true,
    features: [
      { text: "Full Red Team Lab Access", included: true },
      { text: "All VPN Profiles", included: true },
      { text: "24/7 Lab Availability", included: true },
      { text: "Priority Support", included: true },
      { text: "All Tools Access", included: true },
    ],
  },
  {
    name: "Monthly",
    price: 30,
    duration: "30 Days Access",
    description: "Best for ongoing training",
    features: [
      { text: "Full Red Team Lab Access", included: true },
      { text: "All VPN Profiles", included: true },
      { text: "24/7 Lab Availability", included: true },
      { text: "Premium Support", included: true },
      { text: "All Tools Access", included: true },
    ],
  },
];

export function PricingPlans() {
  const handleSelectPlan = async (planName: string) => {
    try {
      const response = await api.selectPlan(planName.toLowerCase());
      if (response.success) {
        toast({
          title: "Plan Selected",
          description: `You have successfully selected the ${planName} plan.`,
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to select plan",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Red Team Lab Access Plans</h3>
        <Badge className="ml-auto bg-primary text-primary-foreground">Haumaru Academy</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative overflow-hidden transition-all hover:shadow-lg ${
              plan.isBestValue ? "ring-2 ring-primary" : ""
            }`}
          >
            {plan.isBestValue && (
              <div className="absolute top-0 right-0 bg-gradient-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                Best Value
              </div>
            )}
            
            <div className="p-6">
              <h4 className="text-xl font-semibold text-foreground">{plan.name}</h4>
              <div className="mt-2 mb-4">
                <span className="text-3xl font-bold text-foreground">${plan.price}</span>
                <span className="text-muted-foreground ml-1">USD</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{plan.duration}</p>
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              
              <div className="space-y-2 mb-6">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{feature.text}</span>
                  </div>
                ))}
              </div>
              
              <Button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full ${
                  plan.isBestValue
                    ? "bg-gradient-primary text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                Select Plan
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}