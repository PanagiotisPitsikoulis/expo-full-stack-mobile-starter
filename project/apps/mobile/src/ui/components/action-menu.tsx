import { type MenuAction, MenuView } from "@expo/ui/community/menu";
import type { ReactNode } from "react";

export type ActionMenuAction = {
  destructive?: boolean;
  disabled?: boolean;
  displayInline?: boolean;
  id: string;
  state?: "off" | "on";
  subactions?: ActionMenuAction[];
  title: string;
};

function toMenuAction(action: ActionMenuAction): MenuAction {
  return {
    attributes:
      action.destructive || action.disabled
        ? {
            destructive: action.destructive,
            disabled: action.disabled,
          }
        : undefined,
    displayInline: action.displayInline,
    id: action.id,
    state: action.state,
    subactions: action.subactions?.map(toMenuAction),
    title: action.title,
  };
}

export function ActionMenu({
  actions,
  children,
  onAction,
  title,
}: {
  actions: ActionMenuAction[];
  children: ReactNode;
  onAction: (id: string) => void;
  title: string;
}) {
  return (
    <MenuView
      actions={actions.map(toMenuAction)}
      onPressAction={(event) => onAction(event.nativeEvent.event)}
      title={title}
    >
      {children}
    </MenuView>
  );
}
