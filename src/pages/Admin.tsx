import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { api } from "@/services/api";
import { Users, ShieldCheck, CreditCard, Settings, LogOut, Download, UserPlus, Trash2, RefreshCw } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [vpnProfiles, setVpnProfiles] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ email: "", password: "", plan: "" });

  useEffect(() => {
    checkAdminAccess();
    loadData();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const user = await api.whoami();
      if (!user.user?.is_admin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      navigate("/login");
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      // Load users (would need admin endpoint)
      const vpnData = await api.getVPNProfiles();
      if (vpnData.ok) {
        setVpnProfiles(vpnData.rows || []);
        // Extract users from VPN profiles
        setUsers(vpnData.rows?.map((profile: any) => ({
          email: profile.cn,
          status: profile.status,
          expiry: profile.expiry_utc,
          created: profile.created_utc,
        })) || []);
      }

      // Load plans
      const plansData = await api.getPlans();
      if (plansData) {
        setPlans(Array.isArray(plansData) ? plansData : []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // This would call admin API to create user
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User created successfully",
        });
        setNewUser({ email: "", password: "", plan: "" });
        loadData();
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm(`Are you sure you want to delete user ${email}?`)) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/admin/users/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleRevokeVPN = async (cn: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/v1/admin/vpn/revoke/${cn}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "VPN access revoked",
        });
        loadData();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke VPN access",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    api.clearAuthToken();
    // Redirect to Cloudflare logout
    window.location.href = 'https://register.haumaruacademy.org/cdn-cgi/access/logout';
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Admin Portal
          </h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="vpn">
              <ShieldCheck className="mr-2 h-4 w-4" />
              VPN Access
            </TabsTrigger>
            <TabsTrigger value="plans">
              <CreditCard className="mr-2 h-4 w-4" />
              Plans
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New User</CardTitle>
                <CardDescription>Add a new user to the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Strong password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="plan">Plan</Label>
                    <Input
                      id="plan"
                      placeholder="Premium"
                      value={newUser.plan}
                      onChange={(e) => setNewUser({ ...newUser, plan: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleCreateUser}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create User
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>View and manage all users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'V' ? 'default' : 'secondary'}>
                            {user.status === 'V' ? 'Valid' : 'Revoked'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(user.created).toLocaleDateString()}</TableCell>
                        <TableCell>{user.expiry ? new Date(user.expiry).toLocaleDateString() : '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.email)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vpn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>VPN Profiles</CardTitle>
                <CardDescription>Manage VPN access for users</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User (CN)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vpnProfiles.map((profile) => (
                      <TableRow key={profile.cn}>
                        <TableCell>{profile.cn}</TableCell>
                        <TableCell>
                          <Badge variant={profile.status === 'V' ? 'default' : 'destructive'}>
                            {profile.status === 'V' ? 'Valid' : 'Revoked'}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(profile.created_utc).toLocaleDateString()}</TableCell>
                        <TableCell>{profile.expiry_utc ? new Date(profile.expiry_utc).toLocaleDateString() : '-'}</TableCell>
                        <TableCell className="space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => api.downloadVPNProfile(profile.cn)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          {profile.status === 'V' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRevokeVPN(profile.cn)}
                            >
                              Revoke
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Manage available subscription plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan: any, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle>{plan.name || 'Plan ' + (index + 1)}</CardTitle>
                        <CardDescription>${plan.price || '0'}/month</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          {plan.features?.map((feature: string, i: number) => (
                            <li key={i} className="flex items-center">
                              <ShieldCheck className="mr-2 h-4 w-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">API Status</h3>
                    <p className="text-sm text-muted-foreground">Check API connectivity</p>
                  </div>
                  <Button variant="outline" onClick={loadData}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Database Backup</h3>
                    <p className="text-sm text-muted-foreground">Last backup: Never</p>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Backup Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}