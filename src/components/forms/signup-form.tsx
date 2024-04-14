import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { jwtDecode } from "jwt-decode";

import { cn } from "@/lib/utils";
import { signupSchema } from "@/lib/validations/auth";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Github, Loader } from "lucide-react";
import { api } from "@/api/axios";
import { useNavigate } from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks/use-auth";
import { flushSync } from "react-dom";

interface SignUpFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof signupSchema>;

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(signupSchema),
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(payload: FormData) {
    try {
      setIsLoading(true);
      const result = await api.post("auth/signup", payload, {
        withCredentials: true,
      });
      const accessToken = result.data.accessToken;
      const decoded = jwtDecode(accessToken);
      flushSync(() => {
        setAuth({ accessToken, userId: decoded.sub ?? "" });
      });
      navigate({ to: "/" });
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        toast.error("Something went wrong.", {
          description: "Your sign up request failed. Please try again.",
        });
      } else if (error.response?.status === 409) {
        toast.error("Credentials taken.", {
          description: "An account with this email or username already exists.",
        });
      } else if (error.response?.status === 400) {
        toast.error("Data validation failed.", {
          description: "Please ensure all fields meet the required criteria.",
        });
      } else {
        toast.error("Registration failed.", {
          description: "Your sign up request failed. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("email")}
            />
            {errors?.email && (
              <p className="px-1 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              placeholder="name123"
              type="username"
              autoCapitalize="none"
              autoComplete="username"
              autoCorrect="off"
              disabled={isLoading || isGitHubLoading}
              {...register("username")}
            />
            {errors?.username && (
              <p className="px-1 text-xs text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="password"
              type="password"
              disabled={isLoading || isGitHubLoading}
              {...register("password")}
            />
            {errors?.password && (
              <p className="px-1 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>
          <button className={cn(buttonVariants())} disabled={isLoading}>
            {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Sign In with Email
          </button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsGitHubLoading(true);
          // signIn("github")
        }}
        disabled={isLoading || isGitHubLoading}
      >
        {isGitHubLoading ? (
          <Loader className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Github className="mr-2 h-4 w-4" />
        )}
        Github
      </button>
    </div>
  );
}
