import { ResizableHandle, ResizablePanel, ResizablePanelGroup, Text } from "../..";

export function Default() {
  return (
    <ResizablePanelGroup className="h-[200px] w-[320px] rounded-lg border border-border bg-surface">
      <ResizablePanel defaultSize={50} className="items-center justify-center p-4">
        <Text className="text-sm text-foreground">One</Text>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} className="items-center justify-center p-4">
        <Text className="text-sm text-muted">Two</Text>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export function Vertical() {
  return (
    <ResizablePanelGroup
      className="h-[200px] w-[320px] rounded-lg border border-border bg-surface"
      direction="vertical"
    >
      <ResizablePanel defaultSize={25} className="items-center justify-center p-4">
        <Text className="text-sm text-foreground">Header</Text>
      </ResizablePanel>
      <ResizableHandle orientation="vertical" withHandle />
      <ResizablePanel defaultSize={75} className="items-center justify-center p-4">
        <Text className="text-sm text-muted">Content</Text>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export { Default as Handle };
