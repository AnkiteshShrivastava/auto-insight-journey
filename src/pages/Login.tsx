
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Car, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to mParivahan
    setTimeout(() => {
      // For demo purposes, we'll just check if fields are not empty
      if (username && password) {
        // Store user information in localStorage
        const userData = {
          name: "Rajesh Kumar",
          vehicleNumber: "MH01AB1234",
          photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
          isLoggedIn: true
        };
        localStorage.setItem("user", JSON.stringify(userData));
        
        toast({
          title: "Login successful",
          description: "Welcome back, Rajesh Kumar!",
          variant: "default",
        });
        
        navigate("/");
      } else {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Car className="h-12 w-12 text-carPurple-200" />
          </div>
          <CardTitle className="text-2xl font-bold text-carPurple-900">Auto Insight</CardTitle>
          <CardDescription>
            Sign in with your mParivahan credentials to access your car monitoring dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your mParivahan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
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
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-carPurple-200 hover:bg-carPurple-300 text-white"
              disabled={loading}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" /> Sign In
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Demo access: Enter any username and password</p>
          </div>
        </CardContent>
      </Card>
      
      <footer className="fixed bottom-0 w-full p-4 text-center text-sm text-gray-500">
        © 2025 Auto Insight | Car Monitoring Platform
      </footer>
    </div>
  );
};

export default Login;
