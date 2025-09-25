import { useState } from "react";
import { Calendar, Clock, BookOpen, AlertTriangle, Target, Lightbulb } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ClassSlot {
  id: string;
  subject: string;
  professor: string;
  room: string;
  time: string;
  duration: number;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface DaySchedule {
  day: string;
  date: string;
  classes: ClassSlot[];
}

interface Recommendation {
  id: string;
  type: 'study-time' | 'balance' | 'overlap' | 'exam-prep';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
}

const sampleTimetable: Record<string, DaySchedule[]> = {
  'Year 1 - Sem 1': [
    {
      day: 'Monday',
      date: '2024-01-15',
      classes: [
        { id: '1', subject: 'Mathematics I', professor: 'Dr. Smith', room: 'A101', time: '09:00', duration: 60, type: 'lecture', difficulty: 'hard' },
        { id: '2', subject: 'Physics I', professor: 'Dr. Johnson', room: 'B203', time: '11:00', duration: 90, type: 'lecture', difficulty: 'medium' },
        { id: '3', subject: 'Programming Lab', professor: 'Prof. Brown', room: 'Lab1', time: '14:00', duration: 120, type: 'lab', difficulty: 'medium' },
      ]
    },
    {
      day: 'Tuesday',
      date: '2024-01-16',
      classes: [
        { id: '4', subject: 'Chemistry', professor: 'Dr. Wilson', room: 'C301', time: '09:00', duration: 60, type: 'lecture', difficulty: 'medium' },
        { id: '5', subject: 'Engineering Graphics', professor: 'Prof. Davis', room: 'D401', time: '10:30', duration: 90, type: 'tutorial', difficulty: 'easy' },
        { id: '6', subject: 'Mathematics Tutorial', professor: 'Dr. Smith', room: 'A102', time: '15:00', duration: 60, type: 'tutorial', difficulty: 'hard' },
      ]
    },
    {
      day: 'Wednesday',
      date: '2024-01-17',
      classes: [
        { id: '7', subject: 'Physics Lab', professor: 'Dr. Johnson', room: 'Lab2', time: '09:00', duration: 180, type: 'lab', difficulty: 'medium' },
        { id: '8', subject: 'Communication Skills', professor: 'Prof. Lee', room: 'E501', time: '14:00', duration: 60, type: 'lecture', difficulty: 'easy' },
      ]
    },
    {
      day: 'Thursday',
      date: '2024-01-18',
      classes: [
        { id: '9', subject: 'Mathematics I', professor: 'Dr. Smith', room: 'A101', time: '09:00', duration: 60, type: 'lecture', difficulty: 'hard' },
        { id: '10', subject: 'Chemistry Lab', professor: 'Dr. Wilson', room: 'Lab3', time: '11:00', duration: 120, type: 'lab', difficulty: 'medium' },
        { id: '11', subject: 'Physics I', professor: 'Dr. Johnson', room: 'B203', time: '15:00', duration: 60, type: 'lecture', difficulty: 'medium' },
      ]
    },
    {
      day: 'Friday',
      date: '2024-01-19',
      classes: [
        { id: '12', subject: 'Programming Fundamentals', professor: 'Prof. Brown', room: 'F601', time: '10:00', duration: 90, type: 'lecture', difficulty: 'medium' },
        { id: '13', subject: 'Workshop Practice', professor: 'Mr. Taylor', room: 'Workshop', time: '14:00', duration: 180, type: 'lab', difficulty: 'easy' },
      ]
    }
  ],
  'Year 1 - Sem 2': [
    {
      day: 'Monday',
      date: '2024-07-15',
      classes: [
        { id: '14', subject: 'Mathematics II', professor: 'Dr. Anderson', room: 'A201', time: '09:00', duration: 60, type: 'lecture', difficulty: 'hard' },
        { id: '15', subject: 'Data Structures', professor: 'Prof. Garcia', room: 'G701', time: '11:00', duration: 90, type: 'lecture', difficulty: 'hard' },
        { id: '16', subject: 'Electronics Lab', professor: 'Dr. Martinez', room: 'Lab4', time: '14:00', duration: 120, type: 'lab', difficulty: 'medium' },
      ]
    }
  ]
};

export default function Timetable() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Year 1 - Sem 1');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const currentSchedule = sampleTimetable[selectedPeriod] || [];

  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];

    // Analyze heavy class days
    const heavyDays = currentSchedule.filter(day => day.classes.length > 2);
    if (heavyDays.length > 0) {
      recommendations.push({
        id: '1',
        type: 'balance',
        title: 'Heavy Class Days Detected',
        description: `${heavyDays.map(d => d.day).join(', ')} have 3+ classes. Consider light study sessions on these days and intensive study on lighter days.`,
        priority: 'high',
        icon: AlertTriangle
      });
    }

    // Find best study slots
    const lightDays = currentSchedule.filter(day => day.classes.length <= 2);
    if (lightDays.length > 0) {
      recommendations.push({
        id: '2',
        type: 'study-time',
        title: 'Optimal Study Windows',
        description: `${lightDays.map(d => d.day).join(', ')} are ideal for intensive study sessions. Schedule your toughest subjects during these times.`,
        priority: 'medium',
        icon: Target
      });
    }

    // Check for back-to-back difficult classes
    currentSchedule.forEach(day => {
      const hardClasses = day.classes.filter(c => c.difficulty === 'hard');
      if (hardClasses.length > 1) {
        recommendations.push({
          id: `3-${day.day}`,
          type: 'overlap',
          title: `Challenging ${day.day}`,
          description: `Multiple difficult subjects on ${day.day}. Pre-study the evening before and take short breaks between classes.`,
          priority: 'high',
          icon: Lightbulb
        });
      }
    });

    // General exam prep tips
    recommendations.push({
      id: '4',
      type: 'exam-prep',
      title: 'Exam Preparation Strategy',
      description: 'Use 2-3 hour gaps between classes for quick revision. Lab days are perfect for practical concept reinforcement.',
      priority: 'medium',
      icon: BookOpen
    });

    return recommendations;
  };

  const getClassTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'lab': return 'bg-green-100 text-green-800 border-green-200';
      case 'tutorial': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'seminar': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-destructive bg-destructive/5';
      case 'medium': return 'border-l-4 border-l-warning bg-warning/5';
      case 'low': return 'border-l-4 border-l-success bg-success/5';
      default: return 'border-l-4 border-l-muted';
    }
  };

  const recommendations = generateRecommendations();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Smart Timetable
            </h1>
            <p className="text-muted-foreground mt-1">
              Intelligent schedule management with AI-powered recommendations
            </p>
          </div>
          
          <div className="flex gap-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
            >
              {Object.keys(sampleTimetable).map(period => (
                <option key={period} value={period}>{period}</option>
              ))}
            </select>
            
            <div className="flex rounded-lg border border-border overflow-hidden">
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="rounded-none"
              >
                Week View
              </Button>
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                className="rounded-none"
              >
                Day View
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Timetable Display */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Weekly Schedule - {selectedPeriod}
          </CardTitle>
          <CardDescription>
            Your complete class schedule with smart insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentSchedule.map((day) => (
              <div key={day.day} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-foreground">
                    {day.day}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {day.date}
                  </span>
                </div>
                
                {day.classes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No classes scheduled</p>
                  </div>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {day.classes.map((classItem) => (
                      <div
                        key={classItem.id}
                        className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-foreground text-sm">
                            {classItem.subject}
                          </h4>
                          <Badge className={getDifficultyColor(classItem.difficulty)} variant="secondary">
                            {classItem.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>👨‍🏫 {classItem.professor}</p>
                          <p>📍 {classItem.room}</p>
                          <p>🕐 {classItem.time} ({classItem.duration}min)</p>
                        </div>
                        
                        <div className="mt-2">
                          <Badge className={getClassTypeColor(classItem.type)} variant="outline">
                            {classItem.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Smart Recommendations
          </CardTitle>
          <CardDescription>
            AI-powered insights based on your timetable analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {recommendations.map((rec) => {
              const IconComponent = rec.icon;
              return (
                <div
                  key={rec.id}
                  className={`rounded-lg p-4 ${getPriorityColor(rec.priority)} hover-lift`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground">
                          {rec.title}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}