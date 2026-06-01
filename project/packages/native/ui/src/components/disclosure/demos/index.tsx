import { useState } from "react";

import { Button, Disclosure, Text } from "../..";

export function Basic() {
  const [isExpanded, setExpanded] = useState(true);

  return (
    <Disclosure isExpanded={isExpanded} onExpandedChange={setExpanded}>
      <Disclosure.Heading>
        <Disclosure.Trigger className="w-full">
          <Button variant="secondary">
            Preview PitsiUI Native
            <Disclosure.Indicator />
          </Button>
        </Disclosure.Trigger>
      </Disclosure.Heading>
      <Disclosure.Content>
        <Disclosure.Body className="items-center gap-3 rounded-3xl bg-surface p-4">
          <Text className="text-center text-sm text-muted">
            Scan this QR code with your camera app to preview the PitsiUI native components.
          </Text>
        </Disclosure.Body>
      </Disclosure.Content>
    </Disclosure>
  );
}

export { Basic as CustomRenderFunction };
