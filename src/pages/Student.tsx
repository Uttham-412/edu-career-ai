import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X, Camera } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StudentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  course: string;
  year: string;
  profileImage: string;
}

const Student = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '2000-01-15',
    course: 'Computer Science',
    year: 'Final Year',
    profileImage: ''
  });
  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

  const handleEdit = () => {
    setEditedProfile(profile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleInputChange = (field: keyof StudentProfile, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getInitials = () => {
    return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  };

  const courseOptions = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Data Science',
    'Cybersecurity',
    'Business Administration',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics'
  ];

  const yearOptions = [
    'First Year',
    'Second Year',
    'Third Year',
    'Final Year',
    'Graduate'
  ];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and academic details</p>
          </div>
          {!isEditing ? (
            <Button onClick={handleEdit} className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card className="glass-card">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.profileImage} />
                  <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0"
                    onClick={() => toast({ title: "Coming Soon", description: "Profile photo upload will be available soon." })}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.firstName} {profile.lastName}</CardTitle>
                <CardDescription className="text-base">{profile.course} • {profile.year}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Personal Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={editedProfile.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={editedProfile.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.lastName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedProfile.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={editedProfile.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              ) : (
                <p className="p-3 bg-muted rounded-md">
                  {new Date(profile.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Your course and academic year details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course/Department</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.course} 
                    onValueChange={(value) => handleInputChange('course', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseOptions.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.course}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                {isEditing ? (
                  <Select 
                    value={editedProfile.year} 
                    onValueChange={(value) => handleInputChange('year', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="p-3 bg-muted rounded-md">{profile.year}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Student;