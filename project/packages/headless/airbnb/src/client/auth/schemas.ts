/**
 * Auth schemas shared across web, native, and server.
 * No React imports — safe for Node, Edge, Workers, and RN.
 */
import { z } from "zod";

export const emailField = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(254, "Email is too long.")
  .pipe(z.email("Enter a valid email address."));

export const nameField = z
  .string()
  .trim()
  .min(2, "Enter your full name.")
  .max(80, "Name is too long.");

export const passwordSignupField = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password is too long.");

export const passwordLoginField = z
  .string()
  .min(1, "Enter your password.")
  .max(128, "Password is too long.");

export const otpField = z.string().regex(/^\d{6}$/, "Enter the 6 digit code.");

export const loginSchema = z.object({
  email: emailField,
  password: passwordLoginField,
});

export const signupSchema = z.object({
  email: emailField,
  name: nameField,
  password: passwordSignupField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const otpSchema = z.object({
  code: otpField,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type OtpInput = z.infer<typeof otpSchema>;

export const authVariants = ["login", "signup", "forgot-password", "otp"] as const;
export type AuthVariant = (typeof authVariants)[number];

export const authSchemas = {
  login: loginSchema,
  signup: signupSchema,
  "forgot-password": forgotPasswordSchema,
  otp: otpSchema,
} satisfies Record<AuthVariant, z.ZodType>;

export type AuthFieldKey = "email" | "name" | "password" | "code";
export type AuthFieldErrors = Partial<Record<AuthFieldKey, string>>;

export function fieldErrorsFrom(result: z.ZodSafeParseResult<unknown>): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (result.success) return errors;
  for (const issue of result.error.issues) {
    const key = issue.path[0];
    if (key === "email" || key === "name" || key === "password" || key === "code") {
      if (!errors[key]) errors[key] = issue.message;
    }
  }
  return errors;
}

export function firstFieldErrorMessage(errors: AuthFieldErrors): string | null {
  return errors.email ?? errors.name ?? errors.password ?? errors.code ?? null;
}
