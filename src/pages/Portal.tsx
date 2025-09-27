import { Header } from "@/components/Header";
import { StudentProfile } from "@/components/StudentProfile";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { VpnServerCard } from "@/components/VpnServerCard";
import { PricingPlans } from "@/components/PricingPlans";
import { useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

export default function Portal() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle payment success/cancel feedback
    const payment = searchParams.get('payment');
    if (payment === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Your subscription has been activated successfully.",
      });
      // Clear the query parameter
      window.history.replaceState({}, '', '/portal/dashboard');
    } else if (payment === 'cancelled') {
      toast({
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again anytime.",
        variant: "destructive",
      });
      // Clear the query parameter
      window.history.replaceState({}, '', '/portal/dashboard');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="space-y-6">
          <StudentProfile />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionCard />
            <VpnServerCard />
          </div>
          
          <PricingPlans />
        </div>
      </main>
    </div>
  );
}