import * as z from "zod";

const checkPassComplexity = (value: string) => {
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[^a-zA-Z0-9]/.test(value);
  return hasUppercase && hasLowercase && hasNumber && hasSymbol;
};

export const signupSchema = z.object({
  email: z.string().email().min(1).max(255),
  username: z.string().min(1).max(30),
  password: z.string().min(8).refine(checkPassComplexity, {
    message: "Password must contain uppercase, lowercase, number and symbol",
  }),
});

export const loginSchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(8).refine(checkPassComplexity, {
    message: "Password must contain uppercase, lowercase, number and symbol",
  }),
});
