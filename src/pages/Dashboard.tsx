import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CareerRoadmap } from "@/components/dashboard/CareerRoadmap";
import { OpportunityCard, Opportunity } from "@/components/opportunities/OpportunityCard";
import { GraduationCap, TrendingUp, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const sampleOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "React.js Complete Course",
    company: "Coursera",
    description: "Master React.js with hands-on projects and industry best practices. Build real-world applications.",
    type: "certification",
    duration: "6 weeks",
    skills: ["React", "JavaScript", "Frontend"],
    rating: 4.8,
    featured: true,
  },
  {
    id: "2",
    title: "Frontend Developer Intern",
    company: "TechCorp Solutions",
    description: "Join our dynamic team to work on cutting-edge web applications using React and TypeScript.",
    type: "internship",
    location: "Remote",
    duration: "3 months",
    skills: ["React", "TypeScript", "CSS"],
    rating: 4.5,
  },
  {
    id: "3",
    title: "Full Stack Developer",
    company: "StartupXYZ",
    description: "Be part of an innovative startup building the next generation of SaaS products.",
    type: "job",
    location: "Bangalore",
    duration: "Full-time",
    skills: ["Node.js", "React", "MongoDB"],
    rating: 4.7,
  },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState("final");
  const { toast } = useToast();

  const handleApply = (opportunityId: string) => {
    toast({
      title: "Application Started!",
      description: "Redirecting to application page...",
    });
  };

  const getYearContent = () => {
    if (selectedYear === "final") {
      return {
        title: "Final Year Focus",
        subtitle: "Time to land your dream job! 🎯",
        description: "AI-matched opportunities based on your profile",
        recommendations: sampleOpportunities.filter(op => op.type === "job" || op.type === "internship"),
      };
    } else {
      return {
        title: "Learning & Building Phase",
        subtitle: "Focus on skills and certifications 📚",
        description: "Build a strong foundation for your career",
        recommendations: sampleOpportunities.filter(op => op.type === "certification"),
      };
    }
  };

  const yearContent = getYearContent();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Let's accelerate your career journey today
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="first">1st Year</SelectItem>
              <SelectItem value="second">2nd Year</SelectItem>
              <SelectItem value="third">3rd Year</SelectItem>
              <SelectItem value="final">Final Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Overview */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Career Roadmap */}
        <div className="lg:col-span-1">
          <CareerRoadmap />
        </div>

        {/* Dynamic Content Based on Year */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    {yearContent.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {yearContent.description}
                  </p>
                </div>
                <Badge variant="secondary" className="bg-primary-light text-primary">
                  {yearContent.subtitle}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {yearContent.recommendations.map((opportunity) => (
                  <div key={opportunity.id} className="animate-slide-up">
                    <OpportunityCard
                      opportunity={opportunity}
                      onApply={handleApply}
                    />
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-medium mb-3 text-foreground">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Update Skills
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <TrendingUp className="w-4 h-4" />
                    View Analytics
                  </Button>
                  <Button variant="outline" size="sm">
                    Download Resume
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-2">
                AI Career Insights
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on your profile and current market trends, here are personalized recommendations:
              </p>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Consider adding <strong>TypeScript</strong> certification to boost your profile by 25%</li>
                <li>• Companies in your area are actively hiring for <strong>React developers</strong></li>
                <li>• Your resume score improved by 15% this month - keep it up!</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}