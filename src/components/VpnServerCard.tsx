import { Shield, Globe, Activity, Download, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/services/api";

export function VpnServerCard() {
  const handleDownloadProfile = async () => {
    // Get user email as CN from profile
    try {
      const profile = await api.getProfile();
      if (profile.user?.email) {
        api.downloadVPNProfile(profile.user.email);
      } else {
        // Fallback if no email available
        api.downloadVPNProfile('default');
      }
    } catch (error) {
      console.error('Failed to download VPN profile:', error);
    }
  };
  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Haumaru Academy VPN Server</h3>
              <div className="flex items-center gap-2 mt-1">
                <StatusBadge variant="active">Lab Access Active</StatusBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h4 className="font-semibold text-foreground mb-3">Lab Environment Server</h4>
          <p className="text-sm text-muted-foreground mb-4">lab-env-01.haumaru</p>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-xs text-muted-foreground">Location</span>
              <div className="flex items-center gap-1 mt-1">
                <Globe className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">US East</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Speed</span>
              <div className="flex items-center gap-1 mt-1">
                <Activity className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">10 Gbps</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Security</span>
              <p className="text-sm font-medium mt-1">AES-256</p>
            </div>
          </div>
          
          <Button 
            onClick={handleDownloadProfile}
            className="w-full bg-gradient-success text-success-foreground hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Profile
          </Button>
        </div>
        
        <Alert className="border-warning/20 bg-warning/5">
          <AlertCircle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-sm">
            <strong>Security Note:</strong> Always verify the server certificate before connecting.
          </AlertDescription>
        </Alert>
      </div>
    </Card>
  );
}