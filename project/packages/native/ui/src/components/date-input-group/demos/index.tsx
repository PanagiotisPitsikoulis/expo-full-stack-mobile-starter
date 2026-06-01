import { Text } from "@pitsi-ui/native";
import { DateInputGroup } from "@pitsi-ui/native/date-input-group";

export function Basic() {
  return (
    <DateInputGroup>
      <DateInputGroup.InputContainer>
        <DateInputGroup.Input defaultValue="2026-05-27" />
      </DateInputGroup.InputContainer>
    </DateInputGroup>
  );
}

export function WithSlots() {
  return (
    <DateInputGroup>
      <DateInputGroup.Prefix>
        <Text className="text-sm text-muted">Date</Text>
      </DateInputGroup.Prefix>
      <DateInputGroup.InputContainer>
        <DateInputGroup.Segment>2026</DateInputGroup.Segment>
        <DateInputGroup.Segment>-</DateInputGroup.Segment>
        <DateInputGroup.Segment>05</DateInputGroup.Segment>
        <DateInputGroup.Segment>-</DateInputGroup.Segment>
        <DateInputGroup.Segment>27</DateInputGroup.Segment>
      </DateInputGroup.InputContainer>
      <DateInputGroup.Suffix>
        <Text className="text-sm text-muted">UTC</Text>
      </DateInputGroup.Suffix>
    </DateInputGroup>
  );
}
