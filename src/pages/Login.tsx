
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Car, LogIn, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import InteractiveBackground from "@/components/InteractiveBackground";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;

        toast({
          title: "Account created",
          description: "Please verify your email to complete registration",
        });

        // Set isSignUp to false to switch to the login form after successful signup
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in",
        });

        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-safe pb-safe">
      <InteractiveBackground />
      <Card className={cn(
        "w-full bg-white/80 backdrop-blur-sm",
        isMobile ? "max-w-[340px]" : "max-w-md"
      )}>
        <CardHeader className={cn(
          "text-center",
          isMobile ? "py-4 px-4" : ""
        )}>
          <div className="flex justify-center mb-3">
            <Car className={cn(
              "text-carPurple-200",
              isMobile ? "h-10 w-10" : "h-12 w-12"
            )} />
          </div>
          <CardTitle className={cn(
            "font-bold text-carPurple-900",
            isMobile ? "text-xl" : "text-2xl"
          )}>Auto Insight</CardTitle>
          <CardDescription className={isMobile ? "text-sm" : ""}>
            {isSignUp ? "Create an account" : "Sign in to your account"}
          </CardDescription>
        </CardHeader>
        <CardContent className={isMobile ? "px-4 pb-5" : ""}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={isSignUp}
                  className={isMobile ? "h-11" : ""}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={isMobile ? "h-11" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={isMobile ? "h-11" : ""}
              />
            </div>
            <Button 
              type="submit" 
              className={cn(
                "w-full bg-carPurple-200 hover:bg-carPurple-300 text-white",
                isMobile ? "h-11 mt-2" : ""
              )}
              disabled={loading}
            >
              {loading ? (
                <span>Please wait...</span>
              ) : (
                <>
                  {isSignUp ? (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" /> Sign Up
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" /> Sign In
                    </>
                  )}
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className={cn(
                  "text-gray-600 hover:text-carPurple-200",
                  isMobile ? "text-xs" : "text-sm"
                )}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
