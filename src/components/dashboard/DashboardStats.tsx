import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Briefcase, Target } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function StatsCard({ title, value, change, icon, trend }: StatsCardProps) {
  const trendColor = trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground";
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className={`text-xs ${trendColor} flex items-center gap-1`}>
          {trend === "up" && <TrendingUp className="w-3 h-3" />}
          {change}
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats() {
  const stats = [
    {
      title: "Certifications Completed",
      value: "12",
      change: "+3 this month",
      icon: <Award className="w-4 h-4" />,
      trend: "up" as const,
    },
    {
      title: "Applications Sent",
      value: "8",
      change: "+5 this week",
      icon: <Briefcase className="w-4 h-4" />,
      trend: "up" as const,
    },
    {
      title: "Profile Strength",
      value: "85%",
      change: "+15% from last month",
      icon: <Target className="w-4 h-4" />,
      trend: "up" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}