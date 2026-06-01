import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  TextInput,
  type TextInputProps,
  View,
  type ViewProps,
} from "react-native";
import { tv, type VariantProps } from "tailwind-variants";

import { IconSearch } from "../icons";
import { Text } from "../text";

export const commandVariants = tv({
  slots: {
    base: "w-full overflow-hidden rounded-2xl bg-surface shadow-sm",
    dialog: "w-full max-w-lg self-center rounded-2xl border border-border bg-surface p-0 shadow-sm",
    empty: "items-center justify-center px-4 py-6",
    emptyText: "text-center text-sm text-muted",
    group: "gap-1 p-1",
    groupHeading: "px-2 py-1.5 text-xs font-medium text-muted",
    input: "min-h-12 flex-1 bg-transparent px-0 py-3 text-sm text-foreground",
    inputWrapper: "flex-row items-center gap-2 border-border border-b px-4",
    item: "min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2",
    itemText: "text-sm text-foreground",
    list: "max-h-80 p-1",
    searchIcon: "text-muted",
    separator: "my-1 h-px w-full bg-border",
    shortcut: "ml-auto text-xs text-muted",
  },
});

export type CommandVariants = VariantProps<typeof commandVariants>;

type CommandContextValue = {
  onValueChange?: (value: string) => void;
  query: string;
  setQuery: (value: string) => void;
  shouldFilter: boolean;
  slots: ReturnType<typeof commandVariants>;
  value?: string;
};

const CommandContext = createContext<CommandContextValue | undefined>(undefined);

function useCommandContext() {
  return useContext(CommandContext);
}

function renderTextChildren(children: ReactNode, className: string) {
  return Children.map(children, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      return <Text className={className}>{child}</Text>;
    }

    return child;
  });
}

function childrenToText(children: ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(childrenToText).join(" ");

  if (isValidElement<{ children?: ReactNode }>(children)) {
    return childrenToText(children.props.children);
  }

  return "";
}

export interface CommandRootProps extends Omit<ViewProps, "children"> {
  children?: ReactNode;
  className?: string;
  defaultValue?: string;
  filter?: (value: string, search: string, keywords?: string[]) => number;
  label?: string;
  loop?: boolean;
  onValueChange?: (value: string) => void;
  shouldFilter?: boolean;
  value?: string;
}

const CommandRoot = forwardRef<View, CommandRootProps>(
  (
    {
      children,
      className,
      defaultValue,
      filter: _filter,
      label,
      loop: _loop,
      onValueChange,
      shouldFilter = true,
      value,
      ...props
    },
    ref,
  ) => {
    const slots = useMemo(() => commandVariants(), []);
    const [internalQuery, setInternalQuery] = useState(defaultValue ?? value ?? "");
    const query = value ?? internalQuery;

    const contextValue = useMemo<CommandContextValue>(
      () => ({
        onValueChange,
        query,
        setQuery: (nextValue) => {
          if (value === undefined) {
            setInternalQuery(nextValue);
          }
          onValueChange?.(nextValue);
        },
        shouldFilter,
        slots,
        value,
      }),
      [onValueChange, query, shouldFilter, slots, value],
    );

    return (
      <CommandContext.Provider value={contextValue}>
        <View ref={ref} accessibilityLabel={label} className={slots.base({ className })} {...props}>
          {children}
        </View>
      </CommandContext.Provider>
    );
  },
);

CommandRoot.displayName = "PitsiUINative.CommandRoot";

export interface CommandInputProps extends Omit<TextInputProps, "onChange"> {
  className?: string;
  onValueChange?: (value: string) => void;
}

const CommandInput = forwardRef<TextInput, CommandInputProps>(
  (
    {
      className,
      onChangeText,
      onValueChange,
      placeholder = "Search...",
      returnKeyType = "search",
      value,
      ...props
    },
    ref,
  ) => {
    const context = useCommandContext();
    const slots = context?.slots ?? commandVariants();
    const inputValue = value ?? context?.query ?? "";

    return (
      <View className={slots.inputWrapper()}>
        <IconSearch className={slots.searchIcon()} />
        <TextInput
          ref={ref}
          className={slots.input({ className })}
          onChangeText={(nextValue) => {
            context?.setQuery(nextValue);
            onValueChange?.(nextValue);
            onChangeText?.(nextValue);
          }}
          placeholder={placeholder}
          returnKeyType={returnKeyType}
          value={inputValue}
          {...props}
        />
      </View>
    );
  },
);

CommandInput.displayName = "PitsiUINative.CommandInput";

export interface CommandListProps extends ScrollViewProps {
  children?: ReactNode;
  className?: string;
}

const CommandList = forwardRef<ScrollView, CommandListProps>(
  ({ children, className, ...props }, ref) => {
    const slots = useCommandContext()?.slots ?? commandVariants();

    return (
      <ScrollView ref={ref} className={slots.list({ className })} {...props}>
        {children}
      </ScrollView>
    );
  },
);

CommandList.displayName = "PitsiUINative.CommandList";

export interface CommandEmptyProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const CommandEmpty = forwardRef<View, CommandEmptyProps>(
  ({ children, className, ...props }, ref) => {
    const context = useCommandContext();
    const slots = context?.slots ?? commandVariants();

    if (!context?.query) {
      return null;
    }

    return (
      <View ref={ref} className={slots.empty({ className })} {...props}>
        {renderTextChildren(children ?? "No results found.", slots.emptyText())}
      </View>
    );
  },
);

CommandEmpty.displayName = "PitsiUINative.CommandEmpty";

export interface CommandGroupProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  heading?: ReactNode;
}

const CommandGroup = forwardRef<View, CommandGroupProps>(
  ({ children, className, heading, ...props }, ref) => {
    const slots = useCommandContext()?.slots ?? commandVariants();

    return (
      <View ref={ref} className={slots.group({ className })} {...props}>
        {heading ? renderTextChildren(heading, slots.groupHeading()) : null}
        {children}
      </View>
    );
  },
);

CommandGroup.displayName = "PitsiUINative.CommandGroup";

export interface CommandItemProps extends Omit<PressableProps, "children" | "disabled"> {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  isDisabled?: boolean;
  keywords?: string[];
  onSelect?: (value: string) => void;
  textValue?: string;
  value?: string;
}

const CommandItem = forwardRef<View, CommandItemProps>(
  (
    {
      children,
      className,
      disabled = false,
      isDisabled = false,
      keywords,
      onPress,
      onSelect,
      textValue,
      value,
      ...props
    },
    ref,
  ) => {
    const context = useCommandContext();
    const slots = context?.slots ?? commandVariants();
    const itemValue = value ?? textValue ?? childrenToText(children);
    const haystack = [itemValue, ...(keywords ?? [])].join(" ").toLocaleLowerCase();
    const query = context?.query.toLocaleLowerCase() ?? "";

    if (context?.shouldFilter && query && !haystack.includes(query)) {
      return null;
    }

    const resolvedDisabled = disabled || isDisabled;

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ disabled: resolvedDisabled }}
        className={slots.item({
          className: `${resolvedDisabled ? "opacity-disabled" : ""} ${className ?? ""}`,
        })}
        disabled={resolvedDisabled}
        onPress={(event) => {
          onPress?.(event);
          onSelect?.(itemValue);
        }}
        {...props}
      >
        {renderTextChildren(children, slots.itemText())}
      </Pressable>
    );
  },
);

CommandItem.displayName = "PitsiUINative.CommandItem";

export interface CommandSeparatorProps extends ViewProps {
  className?: string;
}

const CommandSeparator = forwardRef<View, CommandSeparatorProps>(({ className, ...props }, ref) => {
  const slots = useCommandContext()?.slots ?? commandVariants();

  return <View ref={ref} className={slots.separator({ className })} {...props} />;
});

CommandSeparator.displayName = "PitsiUINative.CommandSeparator";

export interface CommandShortcutProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

const CommandShortcut = forwardRef<View, CommandShortcutProps>(
  ({ children, className, ...props }, ref) => {
    const slots = useCommandContext()?.slots ?? commandVariants();

    return (
      <View ref={ref} className="ml-auto" {...props}>
        {renderTextChildren(children, slots.shortcut({ className }))}
      </View>
    );
  },
);

CommandShortcut.displayName = "PitsiUINative.CommandShortcut";

export interface CommandDialogProps extends CommandRootProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

const CommandDialog = forwardRef<View, CommandDialogProps>(
  ({ children, className, onOpenChange: _onOpenChange, open = true, ...props }, ref) => {
    const slots = commandVariants();

    if (!open) {
      return null;
    }

    return (
      <View ref={ref} className={slots.dialog({ className })}>
        <CommandRoot {...props}>{children}</CommandRoot>
      </View>
    );
  },
);

CommandDialog.displayName = "PitsiUINative.CommandDialog";

export {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandRoot,
  CommandSeparator,
  CommandShortcut,
};
