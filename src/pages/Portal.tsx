import { Header } from "@/components/Header";
import { StudentProfile } from "@/components/StudentProfile";
import { SubscriptionCard } from "@/components/SubscriptionCard";
import { VpnServerCard } from "@/components/VpnServerCard";
import { PricingPlans } from "@/components/PricingPlans";

export default function Portal() {
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