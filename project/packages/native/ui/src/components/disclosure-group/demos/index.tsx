import { Disclosure, DisclosureGroup, Separator, Text } from "../..";

export function Basic() {
  return (
    <DisclosureGroup defaultExpandedKeys={["preview"]}>
      <Disclosure id="preview">
        <Disclosure.Heading>
          <Disclosure.Trigger>
            Preview PitsiUI Native
            <Disclosure.Indicator />
          </Disclosure.Trigger>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Text className="text-sm text-muted">Preview native components on your device.</Text>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
      <Separator className="my-2" />
      <Disclosure id="download">
        <Disclosure.Heading>
          <Disclosure.Trigger>
            Download App
            <Disclosure.Indicator />
          </Disclosure.Trigger>
        </Disclosure.Heading>
        <Disclosure.Content>
          <Disclosure.Body>
            <Text className="text-sm text-muted">Available on iOS and Android devices.</Text>
          </Disclosure.Body>
        </Disclosure.Content>
      </Disclosure>
    </DisclosureGroup>
  );
}

export { Basic as Controlled };
