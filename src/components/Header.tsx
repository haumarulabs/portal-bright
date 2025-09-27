import { Bell, Settings, Globe, LogOut, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.whoami();
        setUser(userData.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUser();
  }, []);
  
  const handleLogout = async () => {
    // Clear auth and redirect to Cloudflare logout
    await api.logout();
  };

  const handleAdminAccess = () => {
    navigate("/admin");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
            <span className="text-lg font-bold text-primary-foreground">P</span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Student Portal</h1>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
          
          <div className="h-6 w-px bg-border" />
          
          {user?.is_admin && (
            <>
              <Button variant="ghost" className="gap-2" onClick={handleAdminAccess}>
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Button>
              <div className="h-6 w-px bg-border" />
            </>
          )}
          
          <Button variant="ghost" className="gap-2" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}