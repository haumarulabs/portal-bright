import { Crown, Download, HeadphonesIcon, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function SubscriptionCard() {
  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: api.getSubscription,
  });

  const daysRemaining = subscription?.days_remaining || 0;
  const totalDays = subscription?.total_days || 365;
  const progressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;

  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Red Team Labs Membership</h3>
              <StatusBadge variant="active" className="mt-1">Active</StatusBadge>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/80">Current Plan</span>
            <span className="font-semibold text-white">{subscription?.plan_name || 'Premium Annual'}</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/80">Subscription Period</span>
              <span className="text-white font-medium">{daysRemaining} days remaining</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-white/20" />
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-sm">
              <span className="text-white/60">Started</span>
              <p className="text-white font-medium">{subscription?.start_date || 'Jan 1, 2024'}</p>
            </div>
            <div className="text-sm text-right">
              <span className="text-white/60">Expires</span>
              <p className="text-white font-medium">{subscription?.end_date || 'Dec 31, 2024'}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-card">
        <h4 className="font-semibold text-foreground mb-3">Premium Benefits</h4>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Download className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Unlimited Downloads</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <HeadphonesIcon className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Priority Support</span>
          </div>
        </div>
        
        <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
          Manage Subscription
        </Button>
      </div>
    </Card>
  );
}