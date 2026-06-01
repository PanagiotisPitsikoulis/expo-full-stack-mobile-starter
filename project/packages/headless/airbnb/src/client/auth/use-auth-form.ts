/**
 * Platform-neutral auth form state.
 *
 * Owns the form values, runs the shared zod schemas, calls the host-supplied
 * signIn/signUp/etc. handlers, and exposes a single `submit` action. The host
 * (web/native) only provides the side-effects (auth client calls + navigation).
 */
"use client";

import { useCallback, useMemo, useState } from "react";
import {
  type AuthFieldErrors,
  type AuthFieldKey,
  type AuthVariant,
  authSchemas,
  fieldErrorsFrom,
  type LoginInput,
  type SignupInput,
} from "./schemas";

export type AuthFormHandlerResult = { error?: { message?: string | null } | null } | void;

export type AuthFormHandlers = {
  signIn: (input: LoginInput) => Promise<AuthFormHandlerResult>;
  signUp: (input: SignupInput) => Promise<AuthFormHandlerResult>;
  forgotPassword?: (input: { email: string }) => Promise<AuthFormHandlerResult>;
  verifyOtp?: (input: { code: string }) => Promise<AuthFormHandlerResult>;
};

export type UseAuthFormOptions = {
  variant: AuthVariant;
  handlers: AuthFormHandlers;
  onSuccess: (variant: AuthVariant) => void | Promise<void>;
};

const OTP_LENGTH = 6;
const emptyOtp = (): string[] => Array.from({ length: OTP_LENGTH }, () => "");

export type AuthFormState = {
  values: {
    name: string;
    email: string;
    password: string;
    otp: string[];
  };
  setName: (value: string) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setOtpDigit: (index: number, value: string) => void;
  errors: AuthFieldErrors;
  formError: string | null;
  pending: boolean;
  submit: () => Promise<void>;
};

export function useAuthForm(options: UseAuthFormOptions): AuthFormState {
  const { variant, handlers, onSuccess } = options;
  const [name, setNameRaw] = useState("");
  const [email, setEmailRaw] = useState("");
  const [password, setPasswordRaw] = useState("");
  const [otp, setOtp] = useState<string[]>(emptyOtp);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const clearFieldError = useCallback((key: AuthFieldKey) => {
    setErrors((current) => {
      if (!current[key]) return current;
      const { [key]: _removed, ...rest } = current;
      return rest;
    });
    setFormError(null);
  }, []);

  const setName = useCallback(
    (value: string) => {
      setNameRaw(value);
      clearFieldError("name");
    },
    [clearFieldError],
  );

  const setEmail = useCallback(
    (value: string) => {
      setEmailRaw(value);
      clearFieldError("email");
    },
    [clearFieldError],
  );

  const setPassword = useCallback(
    (value: string) => {
      setPasswordRaw(value);
      clearFieldError("password");
    },
    [clearFieldError],
  );

  const setOtpDigit = useCallback(
    (index: number, value: string) => {
      const sanitized = value.replace(/\D/g, "").slice(0, 1);
      setOtp((current) => {
        if (current[index] === sanitized) return current;
        const next = [...current];
        next[index] = sanitized;
        return next;
      });
      clearFieldError("code");
    },
    [clearFieldError],
  );

  const submit = useCallback(async () => {
    setFormError(null);
    const payload = {
      code: otp.join(""),
      email,
      name,
      password,
    };
    const parsed = authSchemas[variant].safeParse(payload);

    if (!parsed.success) {
      setErrors(fieldErrorsFrom(parsed));
      return;
    }

    setErrors({});
    setPending(true);

    try {
      let result: AuthFormHandlerResult | undefined;
      if (variant === "signup") {
        result = await handlers.signUp(parsed.data as SignupInput);
      } else if (variant === "login") {
        result = await handlers.signIn(parsed.data as LoginInput);
      } else if (variant === "forgot-password") {
        result = await handlers.forgotPassword?.(parsed.data as { email: string });
      } else if (variant === "otp") {
        result = await handlers.verifyOtp?.(parsed.data as { code: string });
      }

      const errorMessage = result?.error?.message;
      if (errorMessage) {
        setFormError(errorMessage);
        return;
      }

      await onSuccess(variant);
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }, [email, handlers, name, onSuccess, otp, password, variant]);

  return useMemo(
    () => ({
      values: { name, email, password, otp },
      setName,
      setEmail,
      setPassword,
      setOtpDigit,
      errors,
      formError,
      pending,
      submit,
    }),
    [
      name,
      email,
      password,
      otp,
      setName,
      setEmail,
      setPassword,
      setOtpDigit,
      errors,
      formError,
      pending,
      submit,
    ],
  );
}
