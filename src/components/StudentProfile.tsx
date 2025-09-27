import { Mail, BookOpen, Clock, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export function StudentProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: api.getProfile,
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-16 w-16 bg-muted rounded-full mb-4"></div>
          <div className="h-6 bg-muted rounded w-32 mb-2"></div>
          <div className="h-4 bg-muted rounded w-48"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/api/placeholder/64/64" alt="Student" />
          <AvatarFallback className="bg-gradient-primary text-primary-foreground text-xl">
            S
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-foreground">{profile?.name || 'Student'}</h2>
          <p className="text-sm text-muted-foreground mt-1">Student ID: {profile?.student_id || 'Not assigned'}</p>
          
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile?.email || 'student@academy.com'}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Enrolled: {profile?.enrollment || 'Haumaru Academy Labs'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Access Valid Till: {profile?.access_valid_till || 'No active subscription'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">Joined: {profile?.joined_date || 'Pending activation'}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}