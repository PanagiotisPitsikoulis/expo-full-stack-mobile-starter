import { View } from "react-native";

import { Button, Field, Form, Input } from "../..";

export function Basic() {
  return (
    <Form className="w-80 gap-4">
      <Field required>
        <Field.Label>Email</Field.Label>
        <Input keyboardType="email-address" placeholder="john@example.com" />
      </Field>
      <Field required>
        <Field.Label>Password</Field.Label>
        <Input placeholder="Enter your password" secureTextEntry />
      </Field>
      <View className="flex-row gap-2">
        <Button>Submit</Button>
        <Button variant="secondary">Reset</Button>
      </View>
    </Form>
  );
}
