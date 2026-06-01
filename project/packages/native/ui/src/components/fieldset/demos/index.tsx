import { Field, Fieldset, Input, TextArea } from "../..";

export function Basic() {
  return (
    <Fieldset className="w-80">
      <Fieldset.Legend>Profile Settings</Fieldset.Legend>
      <Fieldset.Group>
        <Field required>
          <Field.Label>Name</Field.Label>
          <Input placeholder="John Doe" />
        </Field>
        <Field>
          <Field.Label>Bio</Field.Label>
          <TextArea placeholder="Tell us about yourself..." />
        </Field>
      </Fieldset.Group>
    </Fieldset>
  );
}
