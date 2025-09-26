import { useState } from "react";
import { Calendar, Clock, BookOpen, Upload, Award, TrendingUp, FileText } from "lucide-react";
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

interface CertificationRecommendation {
  id: string;
  title: string;
  description: string;
  provider: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  relevantSubjects: string[];
  priority: 'high' | 'medium' | 'low';
}


export default function Timetable() {
  const [uploadedTimetable, setUploadedTimetable] = useState<DaySchedule[] | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = (file: File) => {
    // In a real implementation, you would parse the uploaded file
    // For now, we'll simulate parsing and create sample data
    const reader = new FileReader();
    reader.onload = (e) => {
      // Simulate parsing timetable data
      const sampleSchedule: DaySchedule[] = [
        {
          day: 'Monday',
          date: '2024-01-15',
          classes: [
            { id: '1', subject: 'Data Structures', professor: 'Dr. Smith', room: 'A101', time: '09:00', duration: 60, type: 'lecture', difficulty: 'hard' },
            { id: '2', subject: 'Machine Learning', professor: 'Dr. Johnson', room: 'B203', time: '11:00', duration: 90, type: 'lecture', difficulty: 'hard' },
            { id: '3', subject: 'Web Development', professor: 'Prof. Brown', room: 'Lab1', time: '14:00', duration: 120, type: 'lab', difficulty: 'medium' },
          ]
        },
        {
          day: 'Tuesday',
          date: '2024-01-16',
          classes: [
            { id: '4', subject: 'Database Systems', professor: 'Dr. Wilson', room: 'C301', time: '09:00', duration: 60, type: 'lecture', difficulty: 'medium' },
            { id: '5', subject: 'Software Engineering', professor: 'Prof. Davis', room: 'D401', time: '10:30', duration: 90, type: 'lecture', difficulty: 'medium' },
          ]
        }
      ];
      setUploadedTimetable(sampleSchedule);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const generateCertificationRecommendations = (): CertificationRecommendation[] => {
    if (!uploadedTimetable) return [];

    const allSubjects = uploadedTimetable.flatMap(day => day.classes.map(c => c.subject));
    const recommendations: CertificationRecommendation[] = [];

    // Analyze subjects and suggest relevant certifications
    if (allSubjects.some(s => s.toLowerCase().includes('data') || s.toLowerCase().includes('machine learning'))) {
      recommendations.push({
        id: '1',
        title: 'Google Data Analytics Professional Certificate',
        description: 'Perfect complement to your data-focused curriculum. Learn industry-standard tools like Tableau, R, and SQL.',
        provider: 'Google via Coursera',
        duration: '3-6 months',
        difficulty: 'beginner',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('data') || s.toLowerCase().includes('machine')),
        priority: 'high'
      });
    }

    if (allSubjects.some(s => s.toLowerCase().includes('web') || s.toLowerCase().includes('programming'))) {
      recommendations.push({
        id: '2',
        title: 'AWS Certified Developer Associate',
        description: 'Enhance your web development skills with cloud computing expertise. High demand in the job market.',
        provider: 'Amazon Web Services',
        duration: '2-3 months',
        difficulty: 'intermediate',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('web') || s.toLowerCase().includes('programming')),
        priority: 'high'
      });
    }

    if (allSubjects.some(s => s.toLowerCase().includes('software') || s.toLowerCase().includes('engineering'))) {
      recommendations.push({
        id: '3',
        title: 'Certified ScrumMaster (CSM)',
        description: 'Learn agile project management methodologies that complement your software engineering studies.',
        provider: 'Scrum Alliance',
        duration: '2-4 weeks',
        difficulty: 'beginner',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('software') || s.toLowerCase().includes('engineering')),
        priority: 'medium'
      });
    }

    if (allSubjects.some(s => s.toLowerCase().includes('database') || s.toLowerCase().includes('sql'))) {
      recommendations.push({
        id: '4',
        title: 'Microsoft Azure Database Administrator',
        description: 'Specialize in database management with cloud technologies, perfect for your database coursework.',
        provider: 'Microsoft',
        duration: '3-4 months',
        difficulty: 'intermediate',
        relevantSubjects: allSubjects.filter(s => s.toLowerCase().includes('database')),
        priority: 'medium'
      });
    }

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

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-warning text-warning-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
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

  const certificationRecommendations = generateCertificationRecommendations();

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
              Upload your timetable to get personalized certification recommendations
            </p>
          </div>
        </div>
      </div>

      {/* File Upload */}
      {!uploadedTimetable ? (
        <Card className="glass-card">
          <CardContent className="p-8">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Upload Your Timetable</h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop your timetable file here, or click to browse
              </p>
              <input
                type="file"
                accept=".pdf,.csv,.xlsx,.xls"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="cursor-pointer">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </label>
              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, CSV, Excel
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
        {/* Timetable Display */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Your Uploaded Timetable
                </CardTitle>
                <CardDescription>
                  Analyzed timetable with certification recommendations
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadedTimetable(null)}
              >
                Upload New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedTimetable.map((day) => (
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
        </>
      )}

      {/* Certification Recommendations */}
      {uploadedTimetable && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Recommended Certifications
            </CardTitle>
            <CardDescription>
              AI-powered certification suggestions based on your subjects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {certificationRecommendations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No specific recommendations available for your current subjects</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {certificationRecommendations.map((cert) => (
                  <div
                    key={cert.id}
                    className={`rounded-lg p-4 ${getPriorityColor(cert.priority)} hover-lift`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Award className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-foreground">
                            {cert.title}
                          </h4>
                          <Badge className={getDifficultyBadgeColor(cert.difficulty)} variant="secondary">
                            {cert.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {cert.description}
                        </p>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            <span className="text-muted-foreground">Provider: {cert.provider}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            <span className="text-muted-foreground">Duration: {cert.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            <span className="text-muted-foreground">
                              Relevant subjects: {cert.relevantSubjects.join(', ')}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Badge variant="outline" className="text-xs">
                            {cert.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}