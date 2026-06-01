import { Text } from "@pitsi-ui/native";
import { DateField } from "@pitsi-ui/native/date-field";

export function Basic() {
  return (
    <DateField>
      <Text className="text-sm font-medium text-foreground">Start date</Text>
      <DateField.Group>
        <DateField.InputContainer>
          <DateField.Input defaultValue="2026-05-27" />
        </DateField.InputContainer>
      </DateField.Group>
      <Text className="text-xs text-muted">Use ISO dates for native parity demos.</Text>
    </DateField>
  );
}
