import { Button } from "@pitsi-ui/native/button";
import { Spinner } from "@pitsi-ui/native/components/spinner";
import { Input } from "@pitsi-ui/native/input";
import { Text } from "@pitsi-ui/native/text";
import { Pressable, View } from "react-native";
import { AinnbLogo } from "../../components/ainnb-logo";
import { LiquidGlassInput } from "../../components/liquid-glass-input";
import { Screen } from "../../components/screen";

export type AuthVariant = "login" | "signup" | "forgot-password" | "otp";

type AuthCopy = {
  footerCopy: string;
  footerLabel: string;
  primaryLabel: string;
  subtitle: string;
  title: string;
};

export function AuthScreen({
  copy,
  error,
  onChangeField,
  onChangeOtp,
  onFooter,
  onForgot,
  onSubmit,
  pending,
  values,
  variant,
}: {
  copy: AuthCopy;
  error: string | null;
  onChangeField: (field: "email" | "name" | "password", value: string) => void;
  onChangeOtp: (index: number, value: string) => void;
  onFooter: () => void;
  onForgot: () => void;
  onSubmit: () => void;
  pending: boolean;
  values: { email: string; name: string; otp: string[]; password: string };
  variant: AuthVariant;
}) {
  return (
    <Screen>
      <View className="flex-1 justify-between gap-8 px-5 pb-10 pt-28">
        <View className="gap-6">
          <View className="items-center pt-2">
            <AinnbLogo />
          </View>

          <View className="items-center gap-2 pt-6">
            <Text className="text-[34px] font-bold tracking-tight text-foreground">
              {copy.title}
            </Text>
            <Text className="text-center text-[15px] text-muted">{copy.subtitle}</Text>
          </View>

          <View className="gap-4">
            {variant === "signup" ? (
              <LiquidGlassInput
                autoCapitalize="words"
                onChangeText={(value) => onChangeField("name", value)}
                placeholder="Full Name"
                value={values.name}
              />
            ) : null}

            {variant !== "otp" ? (
              <LiquidGlassInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(value) => onChangeField("email", value)}
                placeholder="Email"
                value={values.email}
              />
            ) : (
              <View className="flex-row justify-between">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    className="size-12 px-0 py-0 text-center text-[18px] font-bold"
                    key={index}
                    keyboardType="number-pad"
                    maxLength={1}
                    onChangeText={(value) => onChangeOtp(index, value)}
                    value={values.otp[index]}
                  />
                ))}
              </View>
            )}

            {variant === "login" || variant === "signup" ? (
              <LiquidGlassInput
                onChangeText={(value) => onChangeField("password", value)}
                placeholder="Password"
                secureTextEntry
                value={values.password}
              />
            ) : null}
          </View>

          {variant === "login" ? (
            <Pressable
              accessibilityRole="button"
              className="mt-2 self-start pl-[18px]"
              onPress={onForgot}
            >
              <Text className="text-left text-[14px] font-normal text-muted">Forgot Password?</Text>
            </Pressable>
          ) : null}

          {error ? (
            <Text className="self-start pl-[18px] text-[14px] font-semibold text-danger">
              {error}
            </Text>
          ) : null}
        </View>

        <View className="gap-5">
          <Button className="bg-foreground" isDisabled={pending} onPress={onSubmit}>
            {pending ? <Spinner color="#ffffff" size="sm" /> : null}
            <Button.Label className="text-[16px] font-bold text-background">
              {copy.primaryLabel}
            </Button.Label>
          </Button>

          <View className="flex-row justify-center gap-1">
            <Text className="text-[15px] text-foreground">{copy.footerCopy}</Text>
            <Pressable accessibilityRole="button" hitSlop={8} onPress={onFooter}>
              <Text className="text-[15px] font-extrabold text-foreground">{copy.footerLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Screen>
  );
}
