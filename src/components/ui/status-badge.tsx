import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  variant?: "active" | "pending" | "inactive" | "warning";
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ variant = "active", children, className }: StatusBadgeProps) {
  const variants = {
    active: "bg-success text-success-foreground",
    pending: "bg-warning text-warning-foreground",
    inactive: "bg-muted text-muted-foreground",
    warning: "bg-destructive text-destructive-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full",
        variants[variant],
        className
      )}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current opacity-75" />
      {children}
    </span>
  );
}