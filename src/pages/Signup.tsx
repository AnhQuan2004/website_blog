import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isLoading, signupWithGoogle, signupWithGithub } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      acceptTerms: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!formData.acceptTerms) {
      toast.error("You must accept the terms and conditions");
      return;
    }

    try {
      await signup(formData.name, formData.email, formData.password);
      navigate("/");
    } catch (error) {
      // Error is handled by the AuthContext
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });

      await signupWithGoogle();
      toast.success("Welcome! Your Google account has been connected.");
      navigate("/");
    } catch (error) {
      // Error is already handled by AuthContext
      console.error("Google signup failed:", error);
    }
  };

  const handleGithubSignup = async () => {
    try {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
      });

      await signupWithGithub();
      toast.success("Welcome! Your GitHub account has been connected.");
      navigate("/");
    } catch (error) {
      // Error is already handled by AuthContext
      console.error("GitHub signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen py-16 flex items-center justify-center">
      <div className="bg-background w-full max-w-md p-8 rounded-lg shadow-sm border border-border animate-fade-in">
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight flex items-center justify-center mb-8"
          >
            <span className="bg-primary text-primary-foreground px-2 py-1 rounded mr-1">
              Tech
            </span>
            <span>Tales</span>
          </Link>

          <h1 className="text-2xl font-semibold">Create an account</h1>
          <p className="text-muted-foreground mt-2">
            Sign up to get access to all features
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>

          <div className="flex items-start space-x-2 mt-4">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="acceptTerms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <Link to="/terms" className="text-primary hover:underline">
                terms of service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                privacy policy
              </Link>
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </form>

        <div className="relative my-8">
          <Separator />
          <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            OR CONTINUE WITH
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGoogleSignup}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="#4285F4"
              />
              <path
                d="M6.44 14.08l7.227-7.227 2.587 2.58-7.227 7.227-2.587-2.58z"
                fill="#34A853"
              />
              <path
                d="M14.827 14.08l-1.24 1.24L6.44 8.174l1.24-1.24 7.147 7.147z"
                fill="#FBBC05"
              />
              <path
                d="M15.314 8.174l-1.24 1.24-7.147-7.147 1.24-1.24 7.147 7.147z"
                fill="#EA4335"
              />
            </svg>
            {isLoading ? "Connecting..." : "Google"}
          </Button>
          <Button
            variant="outline"
            type="button"
            className="w-full"
            onClick={handleGithubSignup}
            disabled={isLoading}
          >
            <Github className="w-5 h-5 mr-2" />
            {isLoading ? "Connecting..." : "GitHub"}
          </Button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>

        <Button
          variant="ghost"
          className="mt-4 w-full"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default Signup;
