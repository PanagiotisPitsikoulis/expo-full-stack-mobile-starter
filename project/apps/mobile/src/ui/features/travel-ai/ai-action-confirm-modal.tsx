import { Button } from "@pitsi-ui/native/button";
import { Modal, Pressable, Text, View } from "react-native";
import type { AiProposedAction } from "../../../lib/api/travel";
import { AiSmartBadge, useAiTheme } from "../../components/ai-primitives";

function describeAction(action: AiProposedAction) {
  if (action.type === "save_favorites") {
    const n = action.homeIds.length;
    return `${n} favorite${n === 1 ? "" : "s"}`;
  }
  if (action.type === "prepare_reservation") return "Checkout draft";
  return `Open ${action.screen}`;
}

export function AiActionConfirmModal({
  action,
  onCancel,
  onConfirm,
}: {
  action: AiProposedAction | null;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const theme = useAiTheme();

  return (
    <Modal animationType="fade" onRequestClose={onCancel} transparent visible={action !== null}>
      <Pressable
        onPress={onCancel}
        style={{
          alignItems: "center",
          backgroundColor: theme.backdrop,
          flex: 1,
          justifyContent: "center",
          padding: 20,
        }}
      >
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={{
            backgroundColor: theme.overlay,
            borderColor: theme.cardBorder,
            borderCurve: "continuous",
            borderRadius: 20,
            borderWidth: 1,
            maxWidth: 420,
            overflow: "hidden",
            width: "100%",
          }}
        >
          {action ? (
            <>
              <View
                style={{
                  borderBottomColor: theme.cardBorder,
                  borderBottomWidth: 1,
                  paddingHorizontal: 22,
                  paddingVertical: 18,
                }}
              >
                <Text
                  style={{
                    color: theme.textMuted,
                    fontSize: 12,
                    fontWeight: "700",
                    letterSpacing: 1.4,
                    textTransform: "uppercase",
                  }}
                >
                  Confirm AI action
                </Text>
                <Text
                  style={{
                    color: theme.textPrimary,
                    fontSize: 22,
                    fontWeight: "600",
                    marginTop: 4,
                  }}
                >
                  {action.title}
                </Text>
              </View>
              <View style={{ paddingHorizontal: 22, paddingVertical: 18 }}>
                <Text style={{ color: theme.textMuted, fontSize: 15, lineHeight: 22 }}>
                  {action.description}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 16 }}>
                  <AiSmartBadge tone="accent">{describeAction(action)}</AiSmartBadge>
                </View>
              </View>
              <View
                style={{
                  borderTopColor: theme.cardBorder,
                  borderTopWidth: 1,
                  flexDirection: "row",
                  gap: 10,
                  justifyContent: "flex-end",
                  paddingHorizontal: 22,
                  paddingVertical: 14,
                }}
              >
                <Button onPress={onCancel} variant="secondary">
                  <Button.Label>Cancel</Button.Label>
                </Button>
                <Button onPress={onConfirm}>
                  <Button.Label>Yes, do it</Button.Label>
                </Button>
              </View>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
