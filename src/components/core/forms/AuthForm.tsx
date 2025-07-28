"use client";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don&apos;t match",
  path: ["confirmPassword"],
});

interface AuthFormProps {
  variant: "signin" | "signup";
}

export const AuthForm = ({ variant }: AuthFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof signInSchema | typeof signUpSchema>>({
    resolver: zodResolver(variant === "signin" ? signInSchema : signUpSchema),
    defaultValues: variant === "signin" 
      ? { email: "", password: "" }
      : { name: "", email: "", password: "", confirmPassword: "" },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: any) {
    setIsLoading(true);
    
    try {
      if (variant === "signin") {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });
        
        if (result?.error) {
          toast.error("Invalid email or password");
        } else {
          toast.success("Signed in successfully");
          window.location.href = "/";
        }
      } else {
        // Registration
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          toast.error(data.error || "Registration failed");
        } else {
          toast.success("Account created successfully! Please sign in.");
          // Reset form
          form.reset();
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  // Messaging
  let primaryMessage = "create an account";
  let secondaryMessage = "sign up";
  if (variant === "signin") {
    primaryMessage = "sign in";
    secondaryMessage = "sign in";
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white capitalize">
          {primaryMessage}
        </h1>
        <p className="text-sm text-muted-foreground">
          {variant === "signin" 
            ? "Enter your credentials to sign in" 
            : "Create your account with email and password"
          }
        </p>
      </div>
      <div className="grid gap-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {variant === "signup" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {variant === "signup" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <Button type="submit" className="capitalize" disabled={isLoading}>
              {isLoading ? "Loading..." : secondaryMessage}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-xs text-center text-muted-foreground">
          {variant === "signin" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href="/signup"
              >
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                className="underline underline-offset-4 hover:text-primary"
                href="/signin"
              >
                Sign in
              </Link>
            </>
          )}
        </p>
        <p className="px-8 text-xs text-center text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/terms"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            className="underline underline-offset-4 hover:text-primary"
            href="/privacy"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
