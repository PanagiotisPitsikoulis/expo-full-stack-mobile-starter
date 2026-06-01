import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { signInEmail, signUpEmail } from "../../lib/client/auth-client";
import { AuthScreen, type AuthVariant } from "../../ui/features/auth/screen";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTENT: Record<
  AuthVariant,
  {
    footerCopy: string;
    footerHref: string;
    footerLabel: string;
    primaryLabel: string;
    subtitle: string;
    title: string;
  }
> = {
  login: {
    footerCopy: "Did not have any account?",
    footerHref: "/signup",
    footerLabel: "Register Now",
    primaryLabel: "Login",
    subtitle: "Sign in with your email and password.",
    title: "Welcome Back!",
  },
  signup: {
    footerCopy: "Already have an account?",
    footerHref: "/login",
    footerLabel: "Login Now",
    primaryLabel: "Register",
    subtitle: "Start saving stays and planning trips.",
    title: "Create Account",
  },
  "forgot-password": {
    footerCopy: "Remembered your password?",
    footerHref: "/login",
    footerLabel: "Login Now",
    primaryLabel: "Send Code",
    subtitle: "Enter your email and we will send a verification code.",
    title: "Forgot Password?",
  },
  otp: {
    footerCopy: "Did not receive a code?",
    footerHref: "/forgot-password",
    footerLabel: "Send Again",
    primaryLabel: "Verify",
    subtitle: "Use the 6 digit code sent to your email.",
    title: "Enter OTP",
  },
};

export function AuthRoute({ variant }: { variant: AuthVariant }) {
  const router = useRouter();
  const params = useLocalSearchParams<{ redirect?: string }>();
  const redirectTo = (
    typeof params.redirect === "string" && params.redirect.startsWith("/")
      ? params.redirect
      : "/home"
  ) as Href;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async () => {
    setError(null);
    if (variant !== "otp" && !EMAIL_RE.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (variant === "signup" && name.trim().length < 2) {
      setError("Enter your full name.");
      return;
    }
    if (variant === "signup" && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (variant === "login" && password.length < 1) {
      setError("Enter your password.");
      return;
    }
    if (variant === "otp" && !/^\d{6}$/.test(otp.join(""))) {
      setError("Enter the 6 digit code.");
      return;
    }

    setPending(true);
    if (variant === "forgot-password") {
      router.push("/otp");
      setPending(false);
      return;
    }
    if (variant === "otp") {
      router.replace(redirectTo);
      setPending(false);
      return;
    }

    const result =
      variant === "signup"
        ? await signUpEmail(email.trim(), name.trim(), password)
        : await signInEmail(email.trim(), password);
    setPending(false);
    if (result.error) {
      setError(result.error.message ?? "Authentication failed.");
      return;
    }
    router.replace(redirectTo);
  };

  return (
    <AuthScreen
      copy={CONTENT[variant]}
      error={error}
      onChangeField={(field, value) => {
        if (field === "name") setName(value);
        else if (field === "email") setEmail(value);
        else setPassword(value);
      }}
      onChangeOtp={(index, value) => {
        const next = [...otp];
        next[index] = value.replace(/\D/g, "").slice(0, 1);
        setOtp(next);
      }}
      onFooter={() => router.replace(CONTENT[variant].footerHref as Href)}
      onForgot={() => router.push("/forgot-password")}
      onSubmit={submit}
      pending={pending}
      values={{ email, name, otp, password }}
      variant={variant}
    />
  );
}
