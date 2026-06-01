import { Button, EmptyState, Text } from "../..";

export function Default() {
  return (
    <EmptyState className="w-[320px]">
      <EmptyState.Header>
        <EmptyState.Media variant="icon">
          <Text className="text-xl text-muted">0</Text>
        </EmptyState.Media>
        <EmptyState.Title>Your inbox is empty</EmptyState.Title>
        <EmptyState.Description>
          Once you start receiving messages, they will appear here.
        </EmptyState.Description>
      </EmptyState.Header>
      <EmptyState.Content>
        <Button>Compose message</Button>
      </EmptyState.Content>
    </EmptyState>
  );
}

export { Default as Basic };
