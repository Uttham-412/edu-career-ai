import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Download, Plus, X, FileText, Zap, Check, Loader2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ResumeTemplate1 from "@/components/resume/ResumeTemplate1";
import ResumeTemplate2 from "@/components/resume/ResumeTemplate2";
import ResumeTemplate3 from "@/components/resume/ResumeTemplate3";
import ResumeTemplate4 from "@/components/resume/ResumeTemplate4";

interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export default function Resume() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  const [newSkill, setNewSkill] = useState("");
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
  });

  // Fetch data from database
  useEffect(() => {
    if (user) {
      fetchResumeData();
    }
  }, [user]);

  const fetchResumeData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch skills from profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("skills")
        .eq("user_id", user.id)
        .single();

      if (profileData?.skills) {
        const skillsArray = profileData.skills.map((skill: string, index: number) => ({
          id: `skill-${index}`,
          name: skill,
          level: "Intermediate" as const,
        }));
        setSkills(skillsArray);
      }

      // Fetch projects
      const { data: projectsData } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (projectsData) {
        const formattedProjects = projectsData.map((project) => ({
          id: project.id,
          title: project.title,
          description: project.description,
          technologies: project.technologies || [],
        }));
        setProjects(formattedProjects);
      }

      // Fetch certifications
      const { data: certsData } = await supabase
        .from("certifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (certsData) {
        const formattedCerts = certsData.map((cert) => ({
          id: cert.id,
          name: cert.name,
          issuer: cert.issuer,
          date: cert.date,
        }));
        setCertifications(formattedCerts);
      }
    } catch (error) {
      console.error("Error fetching resume data:", error);
      toast({
        title: "Error",
        description: "Failed to load resume data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim() || !user) return;

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("skills")
        .eq("user_id", user.id)
        .single();

      const currentSkills = profileData?.skills || [];
      const updatedSkills = [...currentSkills, newSkill.trim()];

      const { error } = await supabase
        .from("profiles")
        .update({ skills: updatedSkills })
        .eq("user_id", user.id);

      if (error) throw error;

      setSkills([
        ...skills,
        {
          id: Date.now().toString(),
          name: newSkill.trim(),
          level: "Intermediate",
        },
      ]);
      setNewSkill("");
      toast({
        title: "Success",
        description: "Skill added successfully",
      });
    } catch (error) {
      console.error("Error adding skill:", error);
      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
      });
    }
  };

  const removeSkill = async (id: string) => {
    if (!user) return;

    const skillToRemove = skills.find((s) => s.id === id);
    if (!skillToRemove) return;

    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("skills")
        .eq("user_id", user.id)
        .single();

      const currentSkills = profileData?.skills || [];
      const updatedSkills = currentSkills.filter(
        (s: string) => s !== skillToRemove.name
      );

      const { error } = await supabase
        .from("profiles")
        .update({ skills: updatedSkills })
        .eq("user_id", user.id);

      if (error) throw error;

      setSkills(skills.filter((skill) => skill.id !== id));
      toast({
        title: "Success",
        description: "Skill removed successfully",
      });
    } catch (error) {
      console.error("Error removing skill:", error);
      toast({
        title: "Error",
        description: "Failed to remove skill",
        variant: "destructive",
      });
    }
  };

  const addProject = async () => {
    if (!newProject.title.trim() || !newProject.description.trim() || !user)
      return;

    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          title: newProject.title,
          description: newProject.description,
          technologies: newProject.technologies
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t),
        })
        .select()
        .single();

      if (error) throw error;

      setProjects([
        ...projects,
        {
          id: data.id,
          title: data.title,
          description: data.description,
          technologies: data.technologies,
        },
      ]);
      setNewProject({ title: "", description: "", technologies: "" });
      toast({
        title: "Success",
        description: "Project added successfully",
      });
    } catch (error) {
      console.error("Error adding project:", error);
      toast({
        title: "Error",
        description: "Failed to add project",
        variant: "destructive",
      });
    }
  };

  const autoGenerateResume = async () => {
    if (!user) return;

    setGenerating(true);
    try {
      await fetchResumeData();
      toast({
        title: "Resume Generated!",
        description: "Your resume has been auto-generated from your profile data",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const downloadResume = () => {
    toast({
      title: "Resume Downloaded!",
      description: "Your resume has been downloaded as PDF.",
    });
  };

  const generateResume = () => {
    setShowTemplateSelection(true);
    toast({
      title: "Templates Ready!",
      description: "Choose from 4 different resume templates below.",
    });
  };

  const templates = [
    { id: 1, name: "Classic", description: "Traditional and professional" },
    { id: 2, name: "Modern Sidebar", description: "Clean with sidebar layout" },
    { id: 3, name: "Timeline", description: "Timeline style with accent colors" },
    { id: 4, name: "Creative", description: "Modern gradient design" },
  ];

  const renderSelectedTemplate = () => {
    const templateProps = { skills, projects, certifications };
    switch (selectedTemplate) {
      case 2:
        return <ResumeTemplate2 {...templateProps} />;
      case 3:
        return <ResumeTemplate3 {...templateProps} />;
      case 4:
        return <ResumeTemplate4 {...templateProps} />;
      default:
        return <ResumeTemplate1 {...templateProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading your resume data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">
            Auto-generate and customize your professional resume
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={autoGenerateResume}
            variant="outline"
            className="gap-2"
            disabled={generating}
          >
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Auto-Generate
          </Button>
          <Button onClick={generateResume} variant="outline" className="gap-2">
            <Zap className="w-4 h-4" />
            Choose Template
          </Button>
          <Button onClick={downloadResume} className="gap-2">
            <Download className="w-4 h-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editor Section */}
        <div className="space-y-6">
          {/* Skills Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills & Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <Button onClick={addSkill} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-2">
                    {skill.name}
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  placeholder="Project title..."
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                />
                <Textarea
                  placeholder="Project description..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                />
                <Input
                  placeholder="Technologies used (comma separated)..."
                  value={newProject.technologies}
                  onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
                />
                <Button onClick={addProject} size="sm" className="w-full">
                  Add Project
                </Button>
              </div>

              <Separator />

              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="p-3 border rounded-lg">
                    <h4 className="font-medium">{project.title}</h4>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Certifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{cert.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer} • {cert.date}
                      </p>
                    </div>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Resume Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderSelectedTemplate()}

              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground text-center">
                  Resume automatically updates as you make changes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Template Selection Section */}
      {showTemplateSelection && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Resume Template</CardTitle>
              <p className="text-muted-foreground">
                Select from 4 professionally designed templates
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-primary"
                        : "hover:ring-1 hover:ring-muted-foreground"
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    {selectedTemplate === template.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center z-10">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="aspect-[3/4] bg-muted/50 flex items-center justify-center relative">
                          <div className="scale-50 origin-top-left w-[200%] h-[200%] absolute top-0 left-0">
                            {template.id === 1 && <ResumeTemplate1 skills={skills} projects={projects} certifications={certifications} />}
                            {template.id === 2 && <ResumeTemplate2 skills={skills} projects={projects} certifications={certifications} />}
                            {template.id === 3 && <ResumeTemplate3 skills={skills} projects={projects} certifications={certifications} />}
                            {template.id === 4 && <ResumeTemplate4 skills={skills} projects={projects} certifications={certifications} />}
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}