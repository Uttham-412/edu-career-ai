import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Github } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Navigate } from "react-router-dom";

const Auth = () => {
  const { user, loading, signInWithGoogle, signInWithGitHub } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={signInWithGoogle}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </Button>
          
          <Button 
            onClick={signInWithGitHub}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;