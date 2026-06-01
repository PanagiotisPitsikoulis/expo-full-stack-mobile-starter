import { createContext, type ReactNode, useContext, useMemo } from "react";
import {
  Linking,
  Text as NativeText,
  Pressable,
  type PressableProps,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  TextInput,
  type TextInputProps,
  type TextProps,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";

import { createWebParityVariants } from "../helpers/web-parity";
import {
  Accordion as NativeAccordion,
  type AccordionContentProps as NativeAccordionContentProps,
  type AccordionRootProps as NativeAccordionRootProps,
} from "./accordion";
import { Alert as NativeAlert, type AlertRootProps as NativeAlertRootProps } from "./alert";
import { Avatar as NativeAvatar, type AvatarRootProps as NativeAvatarRootProps } from "./avatar";
import { Button as NativeButton, type ButtonRootProps as NativeButtonRootProps } from "./button";
import {
  Card as NativeCard,
  type CardBodyProps as NativeCardBodyProps,
  type CardRootProps as NativeCardRootProps,
} from "./card";
import {
  Checkbox as NativeCheckbox,
  type CheckboxIndicatorProps as NativeCheckboxIndicatorProps,
  type CheckboxProps as NativeCheckboxRootProps,
} from "./checkbox";
import {
  Chip as NativeChip,
  type ChipLabelProps as NativeChipLabelProps,
  type ChipProps as NativeChipRootProps,
} from "./chip";
import {
  CloseButton as NativeCloseButton,
  type CloseButtonProps as NativeCloseButtonRootProps,
} from "./close-button";
import { type DescriptionProps, Description as NativeDescription } from "./description";
import { Input as NativeInput, type InputProps as NativeInputRootProps } from "./input";
import {
  InputGroup as NativeInputGroup,
  type InputGroupInputProps as NativeInputGroupInputProps,
  type InputGroupPrefixProps as NativeInputGroupPrefixProps,
  type InputGroupProps as NativeInputGroupRootProps,
  type InputGroupSuffixProps as NativeInputGroupSuffixProps,
} from "./input-group";
import {
  InputOTP as NativeInputOTP,
  type InputOTPGroupProps as NativeInputOTPGroupProps,
  type InputOTPRootProps as NativeInputOTPRootProps,
  type InputOTPSeparatorProps as NativeInputOTPSeparatorProps,
  type InputOTPSlotProps as NativeInputOTPSlotProps,
} from "./input-otp";
import { Label as NativeLabel, type LabelProps as NativeLabelRootProps } from "./label";
import {
  Popover as NativePopover,
  type PopoverArrowProps as NativePopoverArrowProps,
  type PopoverContentProps as NativePopoverContentProps,
  type PopoverRootProps as NativePopoverRootProps,
  type PopoverTitleProps as NativePopoverTitleProps,
  type PopoverTriggerProps as NativePopoverTriggerProps,
} from "./popover";
import {
  Radio as NativeRadio,
  type RadioIndicatorProps as NativeRadioIndicatorProps,
  type RadioProps as NativeRadioRootProps,
} from "./radio";
import { RadioGroup as NativeRadioGroup, type RadioGroupProps } from "./radio-group";
import {
  ScrollShadow as NativeScrollShadow,
  type ScrollShadowProps as NativeScrollShadowRootProps,
} from "./scroll-shadow";
import {
  SearchField as NativeSearchField,
  type SearchFieldClearButtonProps as NativeSearchFieldClearButtonProps,
  type SearchFieldGroupProps as NativeSearchFieldGroupProps,
  type SearchFieldInputProps as NativeSearchFieldInputProps,
  type SearchFieldProps as NativeSearchFieldRootProps,
  type SearchFieldSearchIconProps as NativeSearchFieldSearchIconProps,
} from "./search-field";
import {
  Select as NativeSelect,
  type SelectContentProps as NativeSelectContentProps,
  type SelectTriggerIndicatorProps as NativeSelectIndicatorProps,
  type SelectRootProps as NativeSelectRootProps,
  type SelectTriggerProps as NativeSelectTriggerProps,
  type SelectValueProps as NativeSelectValueProps,
} from "./select";
import { Separator as NativeSeparatorComponent, type SeparatorProps } from "./separator";
import {
  Skeleton as NativeSkeleton,
  type SkeletonProps as NativeSkeletonRootProps,
} from "./skeleton";
import {
  Slider as NativeSlider,
  type SliderFillProps as NativeSliderFillProps,
  type SliderOutputProps as NativeSliderOutputProps,
  type SliderProps as NativeSliderRootProps,
  type SliderThumbProps as NativeSliderThumbProps,
  type SliderTrackProps as NativeSliderTrackProps,
} from "./slider";
import { Spinner as NativeSpinner, type SpinnerProps as NativeSpinnerRootProps } from "./spinner";
import {
  Surface as NativeSurfaceComponent,
  type SurfaceRootProps as NativeSurfaceRootProps,
} from "./surface";
import {
  Switch as NativeSwitch,
  type SwitchProps as NativeSwitchRootProps,
  type SwitchThumbProps as NativeSwitchThumbProps,
} from "./switch";
import {
  Tabs as NativeTabs,
  type TabsContentProps as NativeTabsContentProps,
  type TabsIndicatorProps as NativeTabsIndicatorProps,
  type TabsListProps as NativeTabsListProps,
  type TabsProps as NativeTabsRootProps,
  type TabsScrollViewProps as NativeTabsScrollViewProps,
  type TabsSeparatorProps as NativeTabsSeparatorProps,
  type TabsTriggerProps as NativeTabsTriggerProps,
} from "./tabs";
import {
  TagGroup as NativeTagGroup,
  type TagGroupItemProps as NativeTagGroupItemProps,
  type TagGroupItemRemoveButtonProps as NativeTagGroupItemRemoveButtonProps,
  type TagGroupListProps as NativeTagGroupListProps,
  type TagGroupProps as NativeTagGroupRootProps,
} from "./tag-group";
import { type TextProps as NativeTextRootProps, Text } from "./text";
import {
  TextArea as NativeTextArea,
  type TextAreaProps as NativeTextAreaRootProps,
} from "./text-area";
import {
  TextField as NativeTextField,
  type TextFieldRootProps as NativeTextFieldRootProps,
} from "./text-field";
import {
  Toast as NativeToast,
  type ToastActionProps as NativeToastActionButtonProps,
  type ToastCloseProps as NativeToastCloseButtonProps,
  type ToastDescriptionProps as NativeToastDescriptionProps,
  type ToastRootProps as NativeToastRootProps,
  type ToastTitleProps as NativeToastTitleProps,
} from "./toast";

export type Key = number | string;
export type Selection = "all" | Set<Key>;

function renderNode(value: ReactNode): ReactNode {
  if (value == null || typeof value === "boolean") return null;
  if (typeof value === "string" || typeof value === "number") {
    return <Text>{value}</Text>;
  }
  return value;
}

export type ButtonProps = NativeButtonRootProps;
export type ButtonVariants = Record<string, unknown>;
export const ButtonRoot = NativeButton;
export const buttonVariants = createWebParityVariants;

export type AccordionProps = NativeAccordionRootProps;
export type AccordionPanelProps = NativeAccordionContentProps;
export type AccordionVariants = Record<string, unknown>;
export const AccordionRoot = NativeAccordion;
export const AccordionItem = NativeAccordion.Item;
export const AccordionTrigger = NativeAccordion.Trigger;
export const AccordionIndicator = NativeAccordion.Indicator;
export const AccordionPanel = NativeAccordion.Content;
export const accordionVariants = createWebParityVariants;

export type AlertProps = NativeAlertRootProps;
export type AlertVariants = Record<string, unknown>;
export const AlertRoot = NativeAlert;
export const AlertIndicator = NativeAlert.Indicator;
export const AlertContent = NativeAlert.Content;
export const AlertTitle = NativeAlert.Title;
export const AlertDescription = NativeAlert.Description;
export const alertVariants = createWebParityVariants;

export type AvatarProps = NativeAvatarRootProps;
export type AvatarVariants = Record<string, unknown>;
export const AvatarRoot = NativeAvatar;
export const AvatarImage = NativeAvatar.Image;
export const AvatarFallback = NativeAvatar.Fallback;
export const avatarVariants = createWebParityVariants;

export type TabProps = NativeTabsTriggerProps;
export type TabIndicatorProps = NativeTabsIndicatorProps;
export type TabListProps = NativeTabsListProps;
export type TabListContainerProps = NativeTabsScrollViewProps;
export type TabPanelProps = NativeTabsContentProps;
export type TabSeparatorProps = NativeTabsSeparatorProps;
export type TabsRootProps = NativeTabsRootProps;
export type TabsVariants = Record<string, unknown>;
export const TabsRoot = NativeTabs;
export const Tab = NativeTabs.Trigger;
export const TabList = NativeTabs.List;
export const TabListContainer = NativeTabs.ScrollView;
export const TabPanel = NativeTabs.Content;
export const TabIndicator = NativeTabs.Indicator;
export const TabSeparator = NativeTabs.Separator;
export const tabsVariants = createWebParityVariants;

export type TagGroupRootProps = NativeTagGroupRootProps;
export type TagGroupListProps = NativeTagGroupListProps;
export type TagGroupVariants = Record<string, unknown>;
export type TagProps = NativeTagGroupItemProps;
export type TagRootProps = NativeTagGroupItemProps;
export type TagRemoveButtonProps = NativeTagGroupItemRemoveButtonProps;
export type TagVariants = Record<string, unknown>;
export const TagGroupRoot = NativeTagGroup;
export const TagGroupList = NativeTagGroup.List;
export const TagRoot = NativeTagGroup.Item;
export const Tag = NativeTagGroup.Item;
export const TagRemoveButton = NativeTagGroup.ItemRemoveButton;
export const tagGroupVariants = createWebParityVariants;
export const tagVariants = createWebParityVariants;

export type CardContentProps = NativeCardBodyProps;
export type CardProps = NativeCardRootProps;
export type CardVariants = Record<string, unknown>;
export const CardRoot = NativeCard;
export const CardHeader = NativeCard.Header;
export const CardContent = NativeCard.Body;
export const CardFooter = NativeCard.Footer;
export const CardTitle = NativeCard.Title;
export const CardDescription = NativeCard.Description;
export const cardVariants = createWebParityVariants;

export type CheckboxRootProps = NativeCheckboxRootProps;
export type CheckboxIndicatorWebProps = NativeCheckboxIndicatorProps;
export type CheckboxVariants = Record<string, unknown>;
export const CheckboxRoot = NativeCheckbox;
export const CheckboxIndicator = NativeCheckbox.Indicator;
export const checkboxVariants = createWebParityVariants;

export type ChipRootProps = NativeChipRootProps;
export type ChipLabelWebProps = NativeChipLabelProps;
export type ChipVariants = Record<string, unknown>;
export const ChipRoot = NativeChip;
export const ChipLabel = NativeChip.Label;
export const chipVariants = createWebParityVariants;

export type CloseButtonRootProps = NativeCloseButtonRootProps;
export type CloseButtonVariants = Record<string, unknown>;
export const CloseButtonRoot = NativeCloseButton;
export const closeButtonVariants = createWebParityVariants;

export type DescriptionRootProps = DescriptionProps;
export type DescriptionVariants = Record<string, unknown>;
export const DescriptionRoot = NativeDescription;
export const descriptionVariants = createWebParityVariants;

export type InputRootProps = NativeInputRootProps;
export type InputVariants = Record<string, unknown>;
export const InputRoot = NativeInput;
export const inputVariants = createWebParityVariants;

export type InputGroupRootProps = NativeInputGroupRootProps;
export type InputGroupVariants = Record<string, unknown>;
export const InputGroupRoot = NativeInputGroup;
export const InputGroupPrefix = NativeInputGroup.Prefix;
export const InputGroupSuffix = NativeInputGroup.Suffix;
export const InputGroupInput = NativeInputGroup.Input;
export type InputGroupPrefixWebProps = NativeInputGroupPrefixProps;
export type InputGroupSuffixWebProps = NativeInputGroupSuffixProps;
export type InputGroupInputWebProps = NativeInputGroupInputProps;
export const inputGroupVariants = createWebParityVariants;

export type InputOTPProps = NativeInputOTPRootProps;
export type InputOTPVariants = Record<string, unknown>;
export const InputOTPRoot = NativeInputOTP;
export const InputOTPGroup = NativeInputOTP.Group;
export const InputOTPSlot = NativeInputOTP.Slot;
export const InputOTPSeparator = NativeInputOTP.Separator;
export type InputOTPGroupWebProps = NativeInputOTPGroupProps;
export type InputOTPSlotWebProps = NativeInputOTPSlotProps;
export type InputOTPSeparatorWebProps = NativeInputOTPSeparatorProps;
export const inputOTPVariants = createWebParityVariants;

export type LabelRootProps = NativeLabelRootProps;
export type LabelVariants = Record<string, unknown>;
export const LabelRoot = NativeLabel;
export const labelVariants = createWebParityVariants;

export type RadioRootProps = NativeRadioRootProps;
export type RadioIndicatorWebProps = NativeRadioIndicatorProps;
export type RadioVariants = Record<string, unknown>;
export const RadioRoot = NativeRadio;
export const RadioIndicator = NativeRadio.Indicator;
export const radioVariants = createWebParityVariants;

export type RadioGroupRootProps = RadioGroupProps;
export type RadioGroupVariants = Record<string, unknown>;
export const RadioGroupRoot = NativeRadioGroup;
export const radioGroupVariants = createWebParityVariants;

export type PopoverProps = NativePopoverRootProps;
export type PopoverHeadingProps = NativePopoverTitleProps;
export type PopoverVariants = Record<string, unknown>;
export const PopoverRoot = NativePopover;
export const PopoverTrigger = NativePopover.Trigger;
export const PopoverContent = NativePopover.Content;
export const PopoverArrow = NativePopover.Arrow;
export const PopoverHeading = NativePopover.Title;
export type PopoverTriggerWebProps = NativePopoverTriggerProps;
export type PopoverContentWebProps = NativePopoverContentProps;
export type PopoverArrowWebProps = NativePopoverArrowProps;
export const popoverVariants = createWebParityVariants;

export type ScrollShadowRootProps = NativeScrollShadowRootProps;
export type ScrollShadowVariants = Record<string, unknown>;
export const ScrollShadowRoot = NativeScrollShadow;
export const scrollShadowVariants = createWebParityVariants;

export type SearchFieldRootProps = NativeSearchFieldRootProps;
export type SearchFieldVariants = Record<string, unknown>;
export const SearchFieldRoot = NativeSearchField;
export const SearchFieldGroup = NativeSearchField.Group;
export const SearchFieldSearchIcon = NativeSearchField.SearchIcon;
export const SearchFieldInput = NativeSearchField.Input;
export const SearchFieldClearButton = NativeSearchField.ClearButton;
export type SearchFieldGroupWebProps = NativeSearchFieldGroupProps;
export type SearchFieldSearchIconWebProps = NativeSearchFieldSearchIconProps;
export type SearchFieldInputWebProps = NativeSearchFieldInputProps;
export type SearchFieldClearButtonWebProps = NativeSearchFieldClearButtonProps;
export const searchFieldVariants = createWebParityVariants;

export type SelectProps = NativeSelectRootProps;
export type SelectIndicatorProps = NativeSelectIndicatorProps;
export type SelectPopoverProps = NativeSelectContentProps;
export type SelectVariants = Record<string, unknown>;
export const SelectRoot = NativeSelect;
export const SelectTrigger = NativeSelect.Trigger;
export const SelectIndicator = NativeSelect.TriggerIndicator;
export const SelectValue = NativeSelect.Value;
export const SelectPopover = NativeSelect.Content;
export type SelectTriggerWebProps = NativeSelectTriggerProps;
export type SelectValueWebProps = NativeSelectValueProps;
export const selectVariants = createWebParityVariants;

export type SeparatorRootProps = SeparatorProps;
export type SeparatorVariants = Record<string, unknown>;
export const SeparatorRoot = NativeSeparatorComponent;
export const separatorVariants = createWebParityVariants;

export type SkeletonRootProps = NativeSkeletonRootProps;
export type SkeletonVariants = Record<string, unknown>;
export const SkeletonRoot = NativeSkeleton;
export const skeletonVariants = createWebParityVariants;

export type SliderRootProps = NativeSliderRootProps;
export type SliderVariants = Record<string, unknown>;
export const SliderRoot = NativeSlider;
export const SliderOutput = NativeSlider.Output;
export const SliderTrack = NativeSlider.Track;
export const SliderFill = NativeSlider.Fill;
export const SliderThumb = NativeSlider.Thumb;
export type SliderOutputWebProps = NativeSliderOutputProps;
export type SliderTrackWebProps = NativeSliderTrackProps;
export type SliderFillWebProps = NativeSliderFillProps;
export type SliderThumbWebProps = NativeSliderThumbProps;
export const sliderVariants = createWebParityVariants;

export type SpinnerRootProps = NativeSpinnerRootProps;
export type SpinnerVariants = Record<string, unknown>;
export const SpinnerRoot = NativeSpinner;
export const spinnerVariants = createWebParityVariants;

export type SurfaceProps = NativeSurfaceRootProps;
export type SurfaceVariants = Record<string, unknown>;
export const SurfaceRoot = NativeSurfaceComponent;
export const surfaceVariants = createWebParityVariants;

export type SwitchRootProps = NativeSwitchRootProps;
export type SwitchVariants = Record<string, unknown>;
export const SwitchRoot = NativeSwitch;
export const SwitchThumb = NativeSwitch.Thumb;
export type SwitchThumbWebProps = NativeSwitchThumbProps;
export const switchVariants = createWebParityVariants;

export type TextAreaRootProps = NativeTextAreaRootProps;
export type TextAreaVariants = Record<string, unknown>;
export const TextAreaRoot = NativeTextArea;
export const textAreaVariants = createWebParityVariants;

export type TextFieldProps = NativeTextFieldRootProps;
export type TextFieldVariants = Record<string, unknown>;
export const TextFieldRoot = NativeTextField;
export const textFieldVariants = createWebParityVariants;

export type TextRootProps = NativeTextRootProps;
export type TextVariants = Record<string, unknown>;
export const TextRoot = Text;
export const textVariants = createWebParityVariants;

export type ToastCloseButtonProps = NativeToastCloseButtonProps;
export type ToastContentProps = NativeToastRootProps;
export type ToastProps = NativeToastRootProps;
export type ToastVariants = Record<string, unknown>;
export const ToastActionButton = NativeToast.Action;
export const ToastCloseButton = NativeToast.Close;
export const ToastContent = NativeToast;
export const ToastDescription = NativeToast.Description;
export const ToastTitle = NativeToast.Title;
export type ToastActionButtonWebProps = NativeToastActionButtonProps;
export type ToastDescriptionWebProps = NativeToastDescriptionProps;
export type ToastTitleWebProps = NativeToastTitleProps;
export const toastVariants = createWebParityVariants;

function parseRatio(ratio: number | string | undefined) {
  if (typeof ratio === "number") return ratio;
  if (!ratio) return 1;

  const [left, right] = ratio.split("/").map((part) => Number(part.trim()));
  if (
    left !== undefined &&
    right !== undefined &&
    Number.isFinite(left) &&
    Number.isFinite(right) &&
    right > 0
  ) {
    return left / right;
  }

  const numeric = Number(ratio);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 1;
}

export interface AspectRatioRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  ratio?: number | string;
}

export type AspectRatioProps = AspectRatioRootProps;

export function AspectRatioRoot({ children, ratio, style, ...props }: AspectRatioRootProps) {
  return (
    <View style={[{ aspectRatio: parseRatio(ratio) }, style]} {...props}>
      {children}
    </View>
  );
}

export const AspectRatio = Object.assign(AspectRatioRoot, {
  Root: AspectRatioRoot,
});

type BadgeSize = "sm" | "md" | "lg";
type BadgeColor = "accent" | "danger" | "default" | "success" | "warning";
type BadgePlacement = "bottom-left" | "bottom-right" | "top-left" | "top-right";
type BadgeVariant = "primary" | "secondary" | "soft";

export interface BadgeRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  color?: BadgeColor;
  placement?: BadgePlacement;
  size?: BadgeSize;
  variant?: BadgeVariant;
}

export interface BadgeLabelProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface BadgeAnchorProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export type BadgeProps = BadgeRootProps;
export type BadgeVariants = {
  color?: BadgeColor;
  placement?: BadgePlacement;
  size?: BadgeSize;
  variant?: BadgeVariant;
};

const BADGE_COLOR_CLASS: Record<BadgeColor, Record<BadgeVariant, string>> = {
  accent: {
    primary: "bg-accent",
    secondary: "bg-default",
    soft: "bg-accent-soft",
  },
  danger: {
    primary: "bg-danger",
    secondary: "bg-default",
    soft: "bg-danger-soft",
  },
  default: {
    primary: "bg-default",
    secondary: "bg-default",
    soft: "bg-default",
  },
  success: {
    primary: "bg-success",
    secondary: "bg-default",
    soft: "bg-success-soft",
  },
  warning: {
    primary: "bg-warning",
    secondary: "bg-default",
    soft: "bg-warning-soft",
  },
};

const BADGE_TEXT_CLASS: Record<BadgeColor, Record<BadgeVariant, string>> = {
  accent: {
    primary: "text-accent-foreground",
    secondary: "text-accent",
    soft: "text-accent-soft-foreground",
  },
  danger: {
    primary: "text-danger-foreground",
    secondary: "text-danger",
    soft: "text-danger-soft-foreground",
  },
  default: {
    primary: "text-default-foreground",
    secondary: "text-default-foreground",
    soft: "text-default-foreground",
  },
  success: {
    primary: "text-success-foreground",
    secondary: "text-success",
    soft: "text-success-soft-foreground",
  },
  warning: {
    primary: "text-warning-foreground",
    secondary: "text-warning",
    soft: "text-warning-soft-foreground",
  },
};

const BADGE_SIZE_CLASS: Record<BadgeSize, string> = {
  lg: "min-h-8 min-w-8 rounded-2xl",
  md: "min-h-7 min-w-7 rounded-3xl",
  sm: "min-h-4 min-w-4 rounded-xl",
};

const BADGE_TEXT_SIZE_CLASS: Record<BadgeSize, string> = {
  lg: "text-sm",
  md: "text-xs",
  sm: "text-[10px]",
};

const BadgeContext = createContext<{ color: BadgeColor; size: BadgeSize; variant: BadgeVariant }>({
  color: "default",
  size: "md",
  variant: "primary",
});

export function BadgeAnchor({ children, className, ...props }: BadgeAnchorProps) {
  return (
    <View className={`relative shrink-0 ${className ?? ""}`} {...props}>
      {children}
    </View>
  );
}

export function BadgeLabel({ children, className, ...props }: BadgeLabelProps) {
  const { color, size, variant } = useContext(BadgeContext);

  return (
    <Text
      className={`${BADGE_TEXT_SIZE_CLASS[size]} font-medium ${BADGE_TEXT_CLASS[color][variant]} ${
        className ?? ""
      }`}
      {...props}
    >
      {children}
    </Text>
  );
}

export function BadgeRoot({
  children,
  className,
  color = "default",
  placement,
  size = "md",
  variant = "primary",
  ...props
}: BadgeRootProps) {
  const renderedChildren =
    typeof children === "string" || typeof children === "number" ? (
      <BadgeLabel>{children}</BadgeLabel>
    ) : (
      children
    );

  return (
    <BadgeContext.Provider value={{ color, size, variant }}>
      <View
        className={`items-center justify-center border border-background ${BADGE_SIZE_CLASS[size]} ${
          BADGE_COLOR_CLASS[color][variant]
        } ${placement ? "absolute" : ""} ${placement?.includes("top") ? "top-0" : ""} ${
          placement?.includes("bottom") ? "bottom-0" : ""
        } ${placement?.includes("left") ? "left-0" : ""} ${
          placement?.includes("right") ? "right-0" : ""
        } ${className ?? ""}`}
        {...props}
      >
        {renderedChildren}
      </View>
    </BadgeContext.Provider>
  );
}

export const badgeVariants = createWebParityVariants;
export const Badge = Object.assign(BadgeRoot, {
  Anchor: BadgeAnchor,
  Label: BadgeLabel,
  Root: BadgeRoot,
});

export interface BreadcrumbsRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  separator?: ReactNode;
}

export interface BreadcrumbsItemProps extends Omit<PressableProps, "children"> {
  children?: ReactNode | ((state: { isCurrent?: boolean }) => ReactNode);
  className?: string;
  href?: string;
  isCurrent?: boolean;
}

export type BreadcrumbsProps = BreadcrumbsRootProps;
export type BreadcrumbsVariants = Record<string, unknown>;

const BreadcrumbsContext = createContext<{ separator?: ReactNode }>({});

export function BreadcrumbsRoot({
  children,
  className,
  separator,
  ...props
}: BreadcrumbsRootProps) {
  return (
    <BreadcrumbsContext.Provider value={{ separator }}>
      <View className={`flex-row items-center ${className ?? ""}`} {...props}>
        {children}
      </View>
    </BreadcrumbsContext.Provider>
  );
}

export function BreadcrumbsItem({
  children,
  className,
  href,
  isCurrent,
  onPress,
  ...props
}: BreadcrumbsItemProps) {
  const { separator } = useContext(BreadcrumbsContext);
  const renderedChildren = typeof children === "function" ? children({ isCurrent }) : children;

  return (
    <View className={`flex-row items-center gap-0.5 px-0.5 ${className ?? ""}`}>
      <Pressable
        accessibilityRole="link"
        disabled={isCurrent}
        onPress={onPress ?? (href ? () => void Linking.openURL(href) : undefined)}
        {...props}
      >
        <Text className={`text-sm font-medium ${isCurrent ? "text-link" : "text-muted"}`}>
          {renderedChildren}
        </Text>
      </Pressable>
      {!isCurrent ? renderNode(separator ?? ">") : null}
    </View>
  );
}

export const breadcrumbsVariants = createWebParityVariants;
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Item: BreadcrumbsItem,
  Root: BreadcrumbsRoot,
});

export interface EmptyStateRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface EmptyStateHeaderProps extends ViewProps {
  className?: string;
}

export interface EmptyStateMediaProps extends ViewProps {
  className?: string;
  variant?: "default" | "icon";
}

export interface EmptyStateTitleProps extends TextProps {
  className?: string;
}

export interface EmptyStateDescriptionProps extends TextProps {
  className?: string;
}

export interface EmptyStateContentProps extends ViewProps {
  className?: string;
}

export type EmptyStateProps = EmptyStateRootProps;
export type EmptyStateVariants = { media?: "default" | "icon" };

export function EmptyStateRoot({ className, ...props }: EmptyStateRootProps) {
  return (
    <View
      className={`min-w-0 flex-1 items-center justify-center gap-6 rounded-2xl border border-dashed border-border p-6 ${className ?? ""}`}
      {...props}
    />
  );
}

export function EmptyStateHeader({ className, ...props }: EmptyStateHeaderProps) {
  return <View className={`max-w-sm items-center gap-2 ${className ?? ""}`} {...props} />;
}

export function EmptyStateMedia({
  className,
  variant = "default",
  ...props
}: EmptyStateMediaProps) {
  return (
    <View
      className={`mb-2 shrink-0 items-center justify-center ${
        variant === "icon" ? "size-10 rounded-xl bg-default" : "bg-transparent"
      } ${className ?? ""}`}
      {...props}
    />
  );
}

export function EmptyStateTitle({ className, ...props }: EmptyStateTitleProps) {
  return (
    <Text
      className={`text-center text-base font-medium text-foreground ${className ?? ""}`}
      {...props}
    />
  );
}

export function EmptyStateDescription({ className, ...props }: EmptyStateDescriptionProps) {
  return (
    <Text
      className={`text-center text-sm leading-relaxed text-muted ${className ?? ""}`}
      {...props}
    />
  );
}

export function EmptyStateContent({ className, ...props }: EmptyStateContentProps) {
  return (
    <View className={`w-full max-w-sm min-w-0 items-center gap-2 ${className ?? ""}`} {...props} />
  );
}

export const emptyStateVariants = createWebParityVariants;
export const EmptyState = Object.assign(EmptyStateRoot, {
  Content: EmptyStateContent,
  Description: EmptyStateDescription,
  Header: EmptyStateHeader,
  Media: EmptyStateMedia,
  Root: EmptyStateRoot,
  Title: EmptyStateTitle,
});

export interface ErrorMessageRootProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export type ErrorMessageProps = ErrorMessageRootProps;
export type ErrorMessageVariants = Record<string, unknown>;

export function ErrorMessageRoot({ className, ...props }: ErrorMessageRootProps) {
  return <Text className={`text-sm text-danger ${className ?? ""}`} {...props} />;
}

export const errorMessageVariants = createWebParityVariants;
export const ErrorMessage = Object.assign(ErrorMessageRoot, {
  Root: ErrorMessageRoot,
});

export interface FieldRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface FieldLabelProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface FieldDescriptionProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface FieldControlProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export type FieldProps = FieldRootProps;
export type FieldErrorProps = ErrorMessageRootProps;
export type FieldInlineErrorProps = FieldErrorProps;
export type FieldVariants = Record<string, unknown>;

export function FieldRoot({ className, ...props }: FieldRootProps) {
  return <View className={`gap-1.5 ${className ?? ""}`} {...props} />;
}

export function FieldLabel({ className, ...props }: FieldLabelProps) {
  return <Text className={`text-sm font-medium text-foreground ${className ?? ""}`} {...props} />;
}

export function FieldDescription({ className, ...props }: FieldDescriptionProps) {
  return <Text className={`text-sm text-muted ${className ?? ""}`} {...props} />;
}

export function FieldControl({ className, ...props }: FieldControlProps) {
  return <View className={`min-w-0 ${className ?? ""}`} {...props} />;
}

export const fieldVariants = createWebParityVariants;
export function useFieldContext() {
  return {};
}
export const Field = Object.assign(FieldRoot, {
  Control: FieldControl,
  Description: FieldDescription,
  Error: ErrorMessageRoot,
  Label: FieldLabel,
  Root: FieldRoot,
});

export const FieldInlineError = ErrorMessageRoot;
export const FieldErrorRoot = ErrorMessageRoot;
export const fieldErrorVariants = createWebParityVariants;
export type FieldErrorVariants = Record<string, unknown>;

export interface FieldsetRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface FieldsetLegendProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface FieldsetActionsProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface FieldGroupProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export type FieldsetProps = FieldsetRootProps;
export type FieldsetVariants = Record<string, unknown>;

export function FieldsetRoot({ className, ...props }: FieldsetRootProps) {
  return <View className={`gap-4 ${className ?? ""}`} {...props} />;
}

export function FieldsetLegend({ className, ...props }: FieldsetLegendProps) {
  return (
    <Text className={`text-base font-semibold text-foreground ${className ?? ""}`} {...props} />
  );
}

export function FieldsetActions({ className, ...props }: FieldsetActionsProps) {
  return (
    <View className={`flex-row items-center justify-end gap-2 ${className ?? ""}`} {...props} />
  );
}

export function FieldGroup({ className, ...props }: FieldGroupProps) {
  return <View className={`gap-3 ${className ?? ""}`} {...props} />;
}

export const fieldsetVariants = createWebParityVariants;
export const Fieldset = Object.assign(FieldsetRoot, {
  Actions: FieldsetActions,
  Legend: FieldsetLegend,
  Root: FieldsetRoot,
});

export interface FormRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export type FormProps = FormRootProps;

export function FormRoot({ className, ...props }: FormRootProps) {
  return <View className={`gap-4 ${className ?? ""}`} {...props} />;
}

export const Form = Object.assign(FormRoot, {
  Root: FormRoot,
});

export interface ItemRootProps extends PressableProps {
  children?: ReactNode;
  className?: string;
  onPress?: PressableProps["onPress"];
}

export interface ItemMediaProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface ItemContentProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface ItemTitleProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface ItemDescriptionProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface ItemActionsProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export type ItemProps = ItemRootProps;
export type ItemVariants = Record<string, unknown>;

export function ItemRoot({ className, onPress, ...props }: ItemRootProps) {
  const rootClassName = `flex-row items-center gap-3 rounded-2xl px-4 py-3 ${className ?? ""}`;

  if (onPress) {
    return <Pressable className={rootClassName} onPress={onPress} {...props} />;
  }

  return <View className={rootClassName} {...(props as ViewProps)} />;
}

export function ItemMedia({ className, ...props }: ItemMediaProps) {
  return <View className={`shrink-0 ${className ?? ""}`} {...props} />;
}

export function ItemContent({ className, ...props }: ItemContentProps) {
  return <View className={`min-w-0 flex-1 ${className ?? ""}`} {...props} />;
}

export function ItemTitle({ className, ...props }: ItemTitleProps) {
  return (
    <Text
      className={`text-sm font-semibold text-foreground ${className ?? ""}`}
      numberOfLines={1}
      {...props}
    />
  );
}

export function ItemDescription({ className, ...props }: ItemDescriptionProps) {
  return <Text className={`text-xs text-muted ${className ?? ""}`} numberOfLines={1} {...props} />;
}

export function ItemActions({ className, ...props }: ItemActionsProps) {
  return <View className={`shrink-0 flex-row items-center gap-2 ${className ?? ""}`} {...props} />;
}

export const itemVariants = createWebParityVariants;
export const Item = Object.assign(ItemRoot, {
  Actions: ItemActions,
  Content: ItemContent,
  Description: ItemDescription,
  Media: ItemMedia,
  Root: ItemRoot,
  Title: ItemTitle,
});

export interface KbdRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface KbdContentProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export interface KbdAbbrProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export type KbdKey = string | number;
export type KbdProps = KbdRootProps;
export type KbdVariants = Record<string, unknown>;

export function KbdRoot({ className, children, ...props }: KbdRootProps) {
  return (
    <View
      className={`min-h-7 min-w-7 items-center justify-center rounded-lg bg-default px-2 ${className ?? ""}`}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <KbdContent>{children}</KbdContent>
      ) : (
        children
      )}
    </View>
  );
}

export function KbdContent({ className, ...props }: KbdContentProps) {
  return <Text className={`text-xs font-medium text-foreground ${className ?? ""}`} {...props} />;
}

export function KbdAbbr({ className, ...props }: KbdAbbrProps) {
  return <Text className={`text-xs font-medium text-foreground ${className ?? ""}`} {...props} />;
}

export const kbdKeysLabelMap = {};
export const kbdKeysMap = {};
export const kbdVariants = createWebParityVariants;
export const Kbd = Object.assign(KbdRoot, {
  Abbr: KbdAbbr,
  Content: KbdContent,
  Root: KbdRoot,
});

export interface LinkRootProps extends PressableProps {
  children?: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export interface LinkIconProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export type LinkProps = LinkRootProps;
export type LinkVariants = Record<string, unknown>;

export function LinkRoot({ children, className, href, onClick, onPress, ...props }: LinkRootProps) {
  return (
    <Pressable
      accessibilityRole="link"
      className={`flex-row items-center gap-1 ${className ?? ""}`}
      onPress={
        onPress ?? (onClick ? () => onClick() : href ? () => void Linking.openURL(href) : undefined)
      }
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text className="text-link underline">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function LinkIcon({ className, ...props }: LinkIconProps) {
  return <View className={`shrink-0 ${className ?? ""}`} {...props} />;
}

export const linkVariants = createWebParityVariants;
export const Link = Object.assign(LinkRoot, {
  Icon: LinkIcon,
  Root: LinkRoot,
});

type ProgressColor = "accent" | "danger" | "default" | "success" | "warning";
type ProgressSize = "sm" | "md" | "lg";

type ProgressContextValue = {
  color: ProgressColor;
  maxValue: number;
  minValue: number;
  percentage: number;
  size: ProgressSize;
  value?: number | null;
};

const ProgressContext = createContext<ProgressContextValue>({
  color: "accent",
  maxValue: 100,
  minValue: 0,
  percentage: 0,
  size: "md",
  value: 0,
});

function progressPercentage(value: number | null | undefined, minValue = 0, maxValue = 100) {
  if (value == null) return 0;
  const range = Math.max(maxValue - minValue, 1);
  return Math.min(Math.max(((value - minValue) / range) * 100, 0), 100);
}

const PROGRESS_COLOR_CLASS: Record<ProgressColor, string> = {
  accent: "bg-accent",
  danger: "bg-danger",
  default: "bg-default-foreground",
  success: "bg-success",
  warning: "bg-warning",
};

const PROGRESS_HEIGHT_CLASS: Record<ProgressSize, string> = {
  lg: "h-3",
  md: "h-2",
  sm: "h-1.5",
};

export interface ProgressBarRootProps extends Omit<ViewProps, "children"> {
  children?: ReactNode | ((state: ProgressContextValue) => ReactNode);
  className?: string;
  color?: ProgressColor;
  isIndeterminate?: boolean;
  maxValue?: number;
  minValue?: number;
  size?: ProgressSize;
  value?: number | null;
}

export interface ProgressBarTrackProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface ProgressBarFillProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export interface ProgressBarOutputProps extends TextProps {
  children?: ReactNode;
  className?: string;
}

export type ProgressBarProps = ProgressBarRootProps;
export type ProgressBarVariants = Record<string, unknown>;

export function ProgressBarRoot({
  children,
  className,
  color = "accent",
  maxValue = 100,
  minValue = 0,
  size = "md",
  value = 0,
  ...props
}: ProgressBarRootProps) {
  const context = useMemo(
    () => ({
      color,
      maxValue,
      minValue,
      percentage: progressPercentage(value, minValue, maxValue),
      size,
      value,
    }),
    [color, maxValue, minValue, size, value],
  );

  return (
    <ProgressContext.Provider value={context}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ max: maxValue, min: minValue, now: value ?? undefined }}
        className={`gap-2 ${className ?? ""}`}
        {...props}
      >
        {typeof children === "function" ? children(context) : children}
      </View>
    </ProgressContext.Provider>
  );
}

export function ProgressBarTrack({ className, ...props }: ProgressBarTrackProps) {
  const { size } = useContext(ProgressContext);
  return (
    <View
      className={`w-full overflow-hidden rounded-full bg-default ${PROGRESS_HEIGHT_CLASS[size]} ${className ?? ""}`}
      {...props}
    />
  );
}

export function ProgressBarFill({ className, style, ...props }: ProgressBarFillProps) {
  const { color, percentage } = useContext(ProgressContext);
  return (
    <View
      className={`h-full rounded-full ${PROGRESS_COLOR_CLASS[color]} ${className ?? ""}`}
      style={[{ width: `${percentage}%` }, style as StyleProp<ViewStyle>]}
      {...props}
    />
  );
}

export function ProgressBarOutput({ className, children, ...props }: ProgressBarOutputProps) {
  const { percentage, value } = useContext(ProgressContext);
  return (
    <Text className={`text-sm text-muted ${className ?? ""}`} {...props}>
      {children ?? (value == null ? "" : `${Math.round(percentage)}%`)}
    </Text>
  );
}

export const progressBarVariants = createWebParityVariants;
export const ProgressBar = Object.assign(ProgressBarRoot, {
  Fill: ProgressBarFill,
  Output: ProgressBarOutput,
  Root: ProgressBarRoot,
  Track: ProgressBarTrack,
});

export interface MeterRootProps extends ProgressBarRootProps {}
export interface MeterTrackProps extends ProgressBarTrackProps {}
export interface MeterFillProps extends ProgressBarFillProps {}
export interface MeterOutputProps extends ProgressBarOutputProps {}
export type MeterProps = MeterRootProps;
export type MeterVariants = Record<string, unknown>;

export const MeterRoot = ProgressBarRoot;
export const MeterTrack = ProgressBarTrack;
export const MeterFill = ProgressBarFill;
export const MeterOutput = ProgressBarOutput;
export const meterVariants = createWebParityVariants;
export const Meter = Object.assign(MeterRoot, {
  Fill: MeterFill,
  Output: MeterOutput,
  Root: MeterRoot,
  Track: MeterTrack,
});

export interface ProgressCircleRootProps extends ProgressBarRootProps {}
export interface ProgressCircleTrackProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}
export interface ProgressCircleTrackCircleProps extends ViewProps {
  className?: string;
}
export interface ProgressCircleFillCircleProps extends ViewProps {
  className?: string;
}
export type ProgressCircleProps = ProgressCircleRootProps;
export type ProgressCircleVariants = Record<string, unknown>;

const CIRCLE_SIZE_CLASS: Record<ProgressSize, string> = {
  lg: "size-9",
  md: "size-7",
  sm: "size-5",
};

export function ProgressCircleRoot({
  children,
  className,
  color = "accent",
  maxValue = 100,
  minValue = 0,
  size = "md",
  value = 0,
  ...props
}: ProgressCircleRootProps) {
  const context = useMemo(
    () => ({
      color,
      maxValue,
      minValue,
      percentage: progressPercentage(value, minValue, maxValue),
      size,
      value,
    }),
    [color, maxValue, minValue, size, value],
  );

  return (
    <ProgressContext.Provider value={context}>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{ max: maxValue, min: minValue, now: value ?? undefined }}
        className={`items-center justify-center ${className ?? ""}`}
        {...props}
      >
        {typeof children === "function" ? children(context) : children}
      </View>
    </ProgressContext.Provider>
  );
}

export function ProgressCircleTrack({ className, ...props }: ProgressCircleTrackProps) {
  const { size } = useContext(ProgressContext);
  return (
    <View
      className={`items-center justify-center rounded-full border-4 border-default ${CIRCLE_SIZE_CLASS[size]} ${className ?? ""}`}
      {...props}
    />
  );
}

export function ProgressCircleTrackCircle({ className, ...props }: ProgressCircleTrackCircleProps) {
  return (
    <View
      className={`absolute inset-0 rounded-full border-4 border-default ${className ?? ""}`}
      {...props}
    />
  );
}

export function ProgressCircleFillCircle({
  className,
  style,
  ...props
}: ProgressCircleFillCircleProps) {
  const { color, percentage } = useContext(ProgressContext);
  return (
    <View
      className={`absolute inset-0 rounded-full border-4 ${className ?? ""}`}
      style={[
        {
          borderColor:
            percentage > 0 ? PROGRESS_COLOR_CLASS[color].replace("bg-", "") : "transparent",
        },
        style,
      ]}
      {...props}
    />
  );
}

export const progressCircleVariants = createWebParityVariants;
export const ProgressCircle = Object.assign(ProgressCircleRoot, {
  FillCircle: ProgressCircleFillCircle,
  Root: ProgressCircleRoot,
  Track: ProgressCircleTrack,
  TrackCircle: ProgressCircleTrackCircle,
});

export interface PaginationRootProps extends ViewProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export interface PaginationSummaryProps extends TextProps {
  children: ReactNode;
  className?: string;
}

export interface PaginationContentProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export interface PaginationItemProps extends ViewProps {
  children: ReactNode;
  className?: string;
}

export interface PaginationLinkProps extends PressableProps {
  children: ReactNode;
  className?: string;
  isActive?: boolean;
}

export interface PaginationPreviousProps extends PaginationLinkProps {}
export interface PaginationNextProps extends PaginationLinkProps {}
export interface PaginationEllipsisProps extends ViewProps {
  className?: string;
}
export interface PaginationPreviousIconProps extends TextProps {}
export interface PaginationNextIconProps extends TextProps {}
export type PaginationProps = PaginationRootProps;
export type PaginationVariants = Record<string, unknown>;

const PaginationContext = createContext<{ size: "sm" | "md" | "lg" }>({ size: "md" });

export function PaginationRoot({
  children,
  className,
  size = "md",
  ...props
}: PaginationRootProps) {
  return (
    <PaginationContext.Provider value={{ size }}>
      <View className={`w-full gap-4 ${className ?? ""}`} {...props}>
        {children}
      </View>
    </PaginationContext.Provider>
  );
}

export function PaginationSummary({ className, ...props }: PaginationSummaryProps) {
  return <Text className={`text-sm text-muted ${className ?? ""}`} {...props} />;
}

export function PaginationContent({ className, ...props }: PaginationContentProps) {
  return <View className={`flex-row items-center gap-1 ${className ?? ""}`} {...props} />;
}

export function PaginationItem({ className, ...props }: PaginationItemProps) {
  return <View className={`shrink-0 ${className ?? ""}`} {...props} />;
}

export function PaginationLink({ children, className, isActive, ...props }: PaginationLinkProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      className={`size-9 items-center justify-center rounded-3xl ${isActive ? "bg-default" : ""} ${className ?? ""}`}
      {...props}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <View className={`size-9 items-center justify-center ${className ?? ""}`} {...props}>
      <Text className="text-sm text-muted">...</Text>
    </View>
  );
}

export function PaginationPreviousIcon(props: PaginationPreviousIconProps) {
  return <Text {...props}>{"<"}</Text>;
}

export function PaginationNextIcon(props: PaginationNextIconProps) {
  return <Text {...props}>{">"}</Text>;
}

export function PaginationPrevious({ children, ...props }: PaginationPreviousProps) {
  return <PaginationLink {...props}>{children ?? <PaginationPreviousIcon />}</PaginationLink>;
}

export function PaginationNext({ children, ...props }: PaginationNextProps) {
  return <PaginationLink {...props}>{children ?? <PaginationNextIcon />}</PaginationLink>;
}

export const paginationVariants = createWebParityVariants;
export const Pagination = Object.assign(PaginationRoot, {
  Content: PaginationContent,
  Ellipsis: PaginationEllipsis,
  Item: PaginationItem,
  Link: PaginationLink,
  Next: PaginationNext,
  NextIcon: PaginationNextIcon,
  Previous: PaginationPrevious,
  PreviousIcon: PaginationPreviousIcon,
  Root: PaginationRoot,
  Summary: PaginationSummary,
});

export interface ScrollAreaRootProps extends ScrollViewProps {
  children?: ReactNode;
  className?: string;
  orientation?: "both" | "horizontal" | "vertical";
}

export interface ScrollAreaViewportProps extends ViewProps {
  children?: ReactNode;
  className?: string;
}

export type ScrollAreaProps = ScrollAreaRootProps;
export type ScrollAreaVariants = Record<string, unknown>;

const ScrollAreaContext = createContext<{ orientation: "both" | "horizontal" | "vertical" }>({
  orientation: "vertical",
});

export function ScrollAreaRoot({
  children,
  className,
  horizontal,
  orientation = "vertical",
  ...props
}: ScrollAreaRootProps) {
  return (
    <ScrollAreaContext.Provider value={{ orientation }}>
      <ScrollView
        className={`relative ${className ?? ""}`}
        horizontal={horizontal ?? orientation === "horizontal"}
        {...props}
      >
        {children}
      </ScrollView>
    </ScrollAreaContext.Provider>
  );
}

export function ScrollAreaViewport({ className, ...props }: ScrollAreaViewportProps) {
  return <View className={`h-full w-full ${className ?? ""}`} {...props} />;
}

export const scrollAreaVariants = createWebParityVariants;
export const ScrollArea = Object.assign(ScrollAreaRoot, {
  Root: ScrollAreaRoot,
  Viewport: ScrollAreaViewport,
});

export type CodeProps = TextProps & { className?: string };

export const Code = ({ className, ...props }: CodeProps) => (
  <NativeText
    className={`rounded-md bg-default px-1 py-0.5 font-mono text-foreground ${className ?? ""}`}
    {...props}
  />
);

type SharedNativeProps = {
  badge?: ReactNode;
  children?: ReactNode;
  className?: string;
  color?: string;
  description?: ReactNode;
  disabled?: boolean;
  href?: string;
  icon?: ReactNode;
  id?: number | string;
  isDisabled?: boolean;
  isSelected?: boolean;
  label?: ReactNode;
  onAction?: () => void;
  onClick?: () => void;
  selected?: boolean;
  size?: number | string;
  textValue?: string;
  title?: ReactNode;
  tone?: string;
  value?: ReactNode;
  variant?: string;
};

type InteractiveState = {
  isDisabled: boolean;
  isFocused: boolean;
  isFocusVisible: boolean;
  isHovered: boolean;
  isPressed: boolean;
  isSelected: boolean;
};

type InteractiveChildren = ReactNode | ((state: InteractiveState) => ReactNode);
type NativeViewSurfaceProps = ViewProps & SharedNativeProps;
type NativeTextSurfaceProps = TextProps & SharedNativeProps;
type NativeScrollSurfaceProps = ScrollViewProps &
  SharedNativeProps & {
    orientation?: "both" | "horizontal" | "vertical" | string;
  };
type NativePressableSurfaceProps = Omit<PressableProps, "children"> &
  SharedNativeProps & {
    children?: InteractiveChildren;
  };

function stripSharedProps<TProps extends SharedNativeProps>(props: TProps) {
  const {
    badge: _badge,
    color: _color,
    description: _description,
    href: _href,
    icon: _icon,
    id: _id,
    isDisabled: _isDisabled,
    isSelected: _isSelected,
    label: _label,
    onAction: _onAction,
    onClick: _onClick,
    selected: _selected,
    size: _size,
    textValue: _textValue,
    title: _title,
    tone: _tone,
    value: _value,
    variant: _variant,
    ...nativeProps
  } = props;

  return nativeProps;
}

function sharedContent(children: ReactNode | undefined, props: SharedNativeProps) {
  return children ?? props.label ?? props.title ?? props.value ?? props.textValue ?? null;
}

function renderInteractiveContent(
  children: InteractiveChildren | undefined,
  state: InteractiveState,
) {
  return renderNode(typeof children === "function" ? children(state) : children);
}

function NativeSurface({
  children,
  className,
  ...props
}: NativeViewSurfaceProps & { baseClassName?: string }) {
  const { baseClassName = "", ...sharedProps } = props;
  const nativeProps = stripSharedProps(sharedProps);

  return (
    <View className={`${baseClassName} ${className ?? ""}`} {...nativeProps}>
      {renderNode(sharedContent(children, sharedProps))}
    </View>
  );
}

function NativeTextSurface({
  children,
  className,
  ...props
}: NativeTextSurfaceProps & { baseClassName?: string }) {
  const { baseClassName = "", ...sharedProps } = props;
  const nativeProps = stripSharedProps(sharedProps);

  return (
    <Text className={`${baseClassName} ${className ?? ""}`} {...nativeProps}>
      {sharedContent(children, sharedProps)}
    </Text>
  );
}

function NativePressableSurface({
  children,
  className,
  disabled,
  isDisabled,
  isSelected,
  onAction,
  onClick,
  onPress,
  selected,
  ...props
}: NativePressableSurfaceProps & {
  baseClassName?: string;
  selectedClassName?: string;
}) {
  const { baseClassName = "", selectedClassName = "bg-default", ...sharedProps } = props;
  const disabledValue = Boolean(disabled || isDisabled);
  const href = props.href;
  const selectedValue = Boolean(selected || isSelected);
  const nativeProps = stripSharedProps(sharedProps);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabledValue, selected: selectedValue }}
      className={`${baseClassName} ${selectedValue ? selectedClassName : ""} ${
        disabledValue ? "opacity-50" : ""
      } ${className ?? ""}`}
      disabled={disabledValue}
      onPress={
        onPress ??
        (onAction
          ? () => onAction()
          : onClick
            ? () => onClick()
            : href
              ? () => void Linking.openURL(href)
              : undefined)
      }
      {...nativeProps}
    >
      {({ pressed }) =>
        renderInteractiveContent(children ?? sharedContent(undefined, sharedProps), {
          isDisabled: disabledValue,
          isFocused: false,
          isFocusVisible: false,
          isHovered: false,
          isPressed: pressed,
          isSelected: selectedValue,
        })
      }
    </Pressable>
  );
}

function NativeSeparator({ className, ...props }: ViewProps & { className?: string }) {
  return <View className={`h-px w-full bg-border ${className ?? ""}`} {...props} />;
}

export type CommandRootProps = NativeViewSurfaceProps;
export type CommandDialogProps = NativeViewSurfaceProps;
export type CommandEmptyProps = NativeViewSurfaceProps;
export type CommandGroupProps = NativeViewSurfaceProps;
export type CommandInputProps = TextInputProps & { className?: string };
export type CommandItemProps = NativePressableSurfaceProps;
export type CommandListProps = NativeScrollSurfaceProps;
export type CommandSeparatorProps = ViewProps & { className?: string };
export type CommandShortcutProps = NativeTextSurfaceProps;
export type CommandProps = CommandRootProps;
export type CommandVariants = Record<string, unknown>;

export function CommandRoot({ className, ...props }: CommandRootProps) {
  return (
    <NativeSurface
      baseClassName="overflow-hidden rounded-2xl bg-background"
      className={className}
      {...props}
    />
  );
}

export function CommandDialog({ className, ...props }: CommandDialogProps) {
  return (
    <NativeSurface
      baseClassName="max-h-[80%] overflow-hidden rounded-2xl border border-border bg-background"
      className={className}
      {...props}
    />
  );
}

export function CommandEmpty({ className, ...props }: CommandEmptyProps) {
  return (
    <NativeSurface
      baseClassName="items-center justify-center px-4 py-8"
      className={className}
      {...props}
    />
  );
}

export function CommandGroup({ className, ...props }: CommandGroupProps) {
  return <NativeSurface baseClassName="gap-1 px-2 py-2" className={className} {...props} />;
}

export function CommandInput({
  className,
  placeholderTextColor = "#8a8a8a",
  ...props
}: CommandInputProps) {
  return (
    <TextInput
      className={`min-h-11 border-border border-b px-4 py-2 text-base text-foreground ${className ?? ""}`}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

export function CommandItem({ className, ...props }: CommandItemProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function CommandList({
  children,
  className,
  horizontal,
  orientation = "vertical",
  ...props
}: CommandListProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView
      className={`max-h-80 ${className ?? ""}`}
      horizontal={horizontal ?? orientation === "horizontal"}
      {...nativeProps}
    >
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function CommandSeparator(props: CommandSeparatorProps) {
  return <NativeSeparator {...props} />;
}

export function CommandShortcut({ className, ...props }: CommandShortcutProps) {
  return (
    <NativeTextSurface
      baseClassName="ml-auto text-xs text-muted"
      className={className}
      {...props}
    />
  );
}

export const commandVariants = createWebParityVariants;
export const Command = Object.assign(CommandRoot, {
  Dialog: CommandDialog,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Input: CommandInput,
  Item: CommandItem,
  List: CommandList,
  Root: CommandRoot,
  Separator: CommandSeparator,
  Shortcut: CommandShortcut,
});

export type ListBoxRootProps = NativeScrollSurfaceProps;
export type ListBoxItemRootProps = NativePressableSurfaceProps;
export type ListBoxItemIndicatorProps = NativeViewSurfaceProps;
export type ListBoxItemProps = ListBoxItemRootProps;
export type ListBoxSectionRootProps = NativeViewSurfaceProps;
export type ListBoxSectionProps = ListBoxSectionRootProps;
export type ListBoxProps = ListBoxRootProps;
export type ListBoxVariants = Record<string, unknown>;
export type ListBoxItemVariants = Record<string, unknown>;
export type ListBoxSectionVariants = Record<string, unknown>;

export function ListBoxRoot({
  children,
  className,
  horizontal,
  orientation = "vertical",
  ...props
}: ListBoxRootProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView
      className={`rounded-2xl border border-border bg-background ${className ?? ""}`}
      horizontal={horizontal ?? orientation === "horizontal"}
      {...nativeProps}
    >
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function ListBoxItemRoot({ className, ...props }: ListBoxItemRootProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 flex-row items-center gap-3 px-4 py-3"
      className={className}
      {...props}
    />
  );
}

export function ListBoxItemIndicator({ children, className, ...props }: ListBoxItemIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-link">✓</Text>}
    </NativeSurface>
  );
}

export function ListBoxSectionRoot({ className, ...props }: ListBoxSectionRootProps) {
  return <NativeSurface baseClassName="gap-1 py-1" className={className} {...props} />;
}

export function ListBoxLoadMoreItem({ className, ...props }: NativePressableSurfaceProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 items-center justify-center px-4 py-3"
      className={className}
      {...props}
    />
  );
}

export const listboxVariants = createWebParityVariants;
export const listboxItemVariants = createWebParityVariants;
export const listboxSectionVariants = createWebParityVariants;
export const ListBox = Object.assign(ListBoxRoot, {
  Root: ListBoxRoot,
});
export const ListBoxItem = Object.assign(ListBoxItemRoot, {
  Indicator: ListBoxItemIndicator,
  Root: ListBoxItemRoot,
});
export const ListBoxSection = Object.assign(ListBoxSectionRoot, {
  Root: ListBoxSectionRoot,
});

export type MenuProps = NativeViewSurfaceProps;
export type MenuVariants = Record<string, unknown>;
export type MenuItemRootProps = NativePressableSurfaceProps;
export type MenuItemSubmenuIndicatorProps = NativeViewSurfaceProps;
export type MenuItemVariants = Record<string, unknown>;
export type MenuSectionRootProps = NativeViewSurfaceProps;
export type MenuSectionProps = MenuSectionRootProps;
export type MenuSectionVariants = Record<string, unknown>;

export function MenuRoot({ className, ...props }: MenuProps) {
  return (
    <NativeSurface
      baseClassName="gap-1 rounded-2xl bg-background p-1"
      className={className}
      {...props}
    />
  );
}

export function MenuItemRoot({ className, ...props }: MenuItemRootProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function MenuItemIndicator({ children, className, ...props }: NativeViewSurfaceProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-link">✓</Text>}
    </NativeSurface>
  );
}

export function MenuItemSubmenuIndicator({
  children,
  className,
  ...props
}: MenuItemSubmenuIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="ml-auto size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">›</Text>}
    </NativeSurface>
  );
}

export function MenuSectionRoot({ className, ...props }: MenuSectionRootProps) {
  return <NativeSurface baseClassName="gap-1 py-1" className={className} {...props} />;
}

export const menuVariants = createWebParityVariants;
export const menuItemVariants = createWebParityVariants;
export const menuSectionVariants = createWebParityVariants;
export const MenuItem = Object.assign(MenuItemRoot, {
  Indicator: MenuItemIndicator,
  Root: MenuItemRoot,
  SubmenuIndicator: MenuItemSubmenuIndicator,
});
export const MenuSection = Object.assign(MenuSectionRoot, {
  Root: MenuSectionRoot,
});

export type DropdownRootProps = NativeViewSurfaceProps;
export type DropdownTriggerProps = NativePressableSurfaceProps;
export type DropdownPopoverProps = NativeViewSurfaceProps;
export type DropdownMenuProps = NativeViewSurfaceProps;
export type DropdownSectionProps = NativeViewSurfaceProps;
export type DropdownItemProps = NativePressableSurfaceProps;
export type DropdownItemIndicatorProps = NativeViewSurfaceProps;
export type DropdownSubmenuIndicatorProps = NativeViewSurfaceProps;
export type DropdownSubmenuTriggerProps = NativePressableSurfaceProps;
export type DropdownProps = DropdownRootProps;
export type DropdownVariants = Record<string, unknown>;

export function DropdownRoot({ className, ...props }: DropdownRootProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function DropdownTrigger({ className, ...props }: DropdownTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function DropdownPopover({ className, ...props }: DropdownPopoverProps) {
  return (
    <NativeSurface
      baseClassName="min-w-48 gap-1 rounded-2xl border border-border bg-background p-1"
      className={className}
      {...props}
    />
  );
}

export function DropdownMenu({ className, ...props }: DropdownMenuProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export function DropdownSection({ className, ...props }: DropdownSectionProps) {
  return <NativeSurface baseClassName="gap-1 py-1" className={className} {...props} />;
}

export function DropdownItem({ className, ...props }: DropdownItemProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function DropdownItemIndicator({
  children,
  className,
  ...props
}: DropdownItemIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-link">✓</Text>}
    </NativeSurface>
  );
}

export function DropdownSubmenuIndicator({
  children,
  className,
  ...props
}: DropdownSubmenuIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="ml-auto size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">›</Text>}
    </NativeSurface>
  );
}

export function DropdownSubmenuTrigger({ className, ...props }: DropdownSubmenuTriggerProps) {
  return <DropdownItem className={className} {...props} />;
}

export const dropdownVariants = createWebParityVariants;
export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  ItemIndicator: DropdownItemIndicator,
  Menu: DropdownMenu,
  Popover: DropdownPopover,
  Root: DropdownRoot,
  Section: DropdownSection,
  SubmenuIndicator: DropdownSubmenuIndicator,
  SubmenuTrigger: DropdownSubmenuTrigger,
  Trigger: DropdownTrigger,
});

export type ContextMenuRootProps = NativeViewSurfaceProps;
export type ContextMenuTriggerProps = NativePressableSurfaceProps;
export type ContextMenuContentProps = NativeViewSurfaceProps;
export type ContextMenuItemProps = NativePressableSurfaceProps;
export type ContextMenuItemIndicatorProps = NativeViewSurfaceProps;
export type ContextMenuSeparatorProps = ViewProps & { className?: string };
export type ContextMenuSubProps = NativeViewSurfaceProps;
export type ContextMenuSubContentProps = NativeViewSurfaceProps;
export type ContextMenuSubTriggerProps = NativePressableSurfaceProps;
export type ContextMenuSubmenuIndicatorProps = NativeViewSurfaceProps;
export type ContextMenuProps = ContextMenuRootProps;
export type ContextMenuVariants = Record<string, unknown>;

export function ContextMenuRoot({ className, ...props }: ContextMenuRootProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function ContextMenuTrigger({ className, ...props }: ContextMenuTriggerProps) {
  return <NativePressableSurface baseClassName="self-start" className={className} {...props} />;
}

export function ContextMenuContent({ className, ...props }: ContextMenuContentProps) {
  return (
    <NativeSurface
      baseClassName="min-w-48 gap-1 rounded-2xl border border-border bg-background p-1"
      className={className}
      {...props}
    />
  );
}

export function ContextMenuItem({ className, ...props }: ContextMenuItemProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function ContextMenuItemIndicator({
  children,
  className,
  ...props
}: ContextMenuItemIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-link">✓</Text>}
    </NativeSurface>
  );
}

export function ContextMenuSeparator(props: ContextMenuSeparatorProps) {
  return <NativeSeparator {...props} />;
}

export function ContextMenuSub({ className, ...props }: ContextMenuSubProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export function ContextMenuSubContent({ className, ...props }: ContextMenuSubContentProps) {
  return <ContextMenuContent className={className} {...props} />;
}

export function ContextMenuSubTrigger({ className, ...props }: ContextMenuSubTriggerProps) {
  return <ContextMenuItem className={className} {...props} />;
}

export function ContextMenuSubmenuIndicator({
  children,
  className,
  ...props
}: ContextMenuSubmenuIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="ml-auto size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">›</Text>}
    </NativeSurface>
  );
}

export const contextMenuVariants = createWebParityVariants;
export const ContextMenu = Object.assign(ContextMenuRoot, {
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  ItemIndicator: ContextMenuItemIndicator,
  Root: ContextMenuRoot,
  Separator: ContextMenuSeparator,
  Sub: ContextMenuSub,
  SubContent: ContextMenuSubContent,
  SubTrigger: ContextMenuSubTrigger,
  SubmenuIndicator: ContextMenuSubmenuIndicator,
  Trigger: ContextMenuTrigger,
});

export type HoverCardRootProps = NativeViewSurfaceProps;
export type HoverCardTriggerProps = NativePressableSurfaceProps;
export type HoverCardContentProps = NativeViewSurfaceProps;
export type HoverCardProps = HoverCardRootProps;
export type HoverCardVariants = Record<string, unknown>;

export function HoverCardRoot({ className, ...props }: HoverCardRootProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function HoverCardTrigger({ className, ...props }: HoverCardTriggerProps) {
  return <NativePressableSurface baseClassName="self-start" className={className} {...props} />;
}

export function HoverCardContent({ className, ...props }: HoverCardContentProps) {
  return (
    <NativeSurface
      baseClassName="min-w-56 gap-2 rounded-2xl border border-border bg-background p-4"
      className={className}
      {...props}
    />
  );
}

export const hoverCardVariants = createWebParityVariants;
export const HoverCard = Object.assign(HoverCardRoot, {
  Content: HoverCardContent,
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
});

export type MenubarRootProps = NativeViewSurfaceProps;
export type MenubarMenuProps = NativeViewSurfaceProps;
export type MenubarTriggerProps = NativePressableSurfaceProps;
export type MenubarContentProps = NativeViewSurfaceProps;
export type MenubarItemProps = NativePressableSurfaceProps;
export type MenubarSeparatorProps = ViewProps & { className?: string };
export type MenubarProps = MenubarRootProps;
export type MenubarVariants = Record<string, unknown>;

export function MenubarRoot({ className, ...props }: MenubarRootProps) {
  return (
    <NativeSurface
      baseClassName="flex-row items-center gap-1 rounded-2xl bg-default p-1"
      className={className}
      {...props}
    />
  );
}

export function MenubarMenu({ className, ...props }: MenubarMenuProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function MenubarTrigger({ className, ...props }: MenubarTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-9 flex-row items-center rounded-xl px-3 py-2"
      className={className}
      selectedClassName="bg-background"
      {...props}
    />
  );
}

export function MenubarContent({ className, ...props }: MenubarContentProps) {
  return (
    <NativeSurface
      baseClassName="min-w-48 gap-1 rounded-2xl border border-border bg-background p-1"
      className={className}
      {...props}
    />
  );
}

export function MenubarItem({ className, ...props }: MenubarItemProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function MenubarSeparator(props: MenubarSeparatorProps) {
  return <NativeSeparator {...props} />;
}

export const menubarVariants = createWebParityVariants;
export const Menubar = Object.assign(MenubarRoot, {
  Content: MenubarContent,
  Item: MenubarItem,
  Menu: MenubarMenu,
  Root: MenubarRoot,
  Separator: MenubarSeparator,
  Trigger: MenubarTrigger,
});

export type CarouselRootProps = NativeViewSurfaceProps;
export type CarouselContentProps = NativeScrollSurfaceProps;
export type CarouselItemProps = NativePressableSurfaceProps;
export type CarouselNextProps = NativePressableSurfaceProps;
export type CarouselPreviousProps = NativePressableSurfaceProps;
export type CarouselProps = CarouselRootProps;
export type CarouselApi = Record<string, unknown>;
export type CarouselVariants = Record<string, unknown>;

export function CarouselRoot({ className, ...props }: CarouselRootProps) {
  return <NativeSurface baseClassName="relative gap-3" className={className} {...props} />;
}

export function CarouselContent({
  children,
  className,
  horizontal = true,
  ...props
}: CarouselContentProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView
      className={`w-full ${className ?? ""}`}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      {...nativeProps}
    >
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function CarouselItem({ className, ...props }: CarouselItemProps) {
  return <NativePressableSurface baseClassName="min-w-64" className={className} {...props} />;
}

export function CarouselPrevious({ children, className, ...props }: CarouselPreviousProps) {
  return (
    <NativePressableSurface
      baseClassName="size-10 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-base text-foreground">‹</Text>}
    </NativePressableSurface>
  );
}

export function CarouselNext({ children, className, ...props }: CarouselNextProps) {
  return (
    <NativePressableSurface
      baseClassName="size-10 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-base text-foreground">›</Text>}
    </NativePressableSurface>
  );
}

export const carouselVariants = createWebParityVariants;
export const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Next: CarouselNext,
  Previous: CarouselPrevious,
  Root: CarouselRoot,
});

export type ChartConfig = Record<string, unknown>;
export type ChartContainerProps = NativeViewSurfaceProps & { config?: ChartConfig };
export type ChartLegendContentProps = NativeViewSurfaceProps;
export type ChartTooltipContentProps = NativeViewSurfaceProps;
export type ChartVariants = Record<string, unknown>;

export function ChartContainer({ className, ...props }: ChartContainerProps) {
  const { config: _config, ...nativeProps } = props;

  return (
    <NativeSurface
      baseClassName="min-h-48 w-full rounded-2xl border border-border bg-background p-4"
      className={className}
      {...nativeProps}
    />
  );
}

export function ChartLegend({ className, ...props }: NativeTextSurfaceProps) {
  return <NativeTextSurface baseClassName="text-xs text-muted" className={className} {...props} />;
}

export function ChartLegendContent({ className, ...props }: ChartLegendContentProps) {
  return (
    <NativeSurface baseClassName="flex-row flex-wrap gap-2" className={className} {...props} />
  );
}

export function ChartStyle({ className, ...props }: NativeViewSurfaceProps) {
  return <NativeSurface baseClassName="hidden" className={className} {...props} />;
}

export function ChartTooltip({ className, ...props }: NativeViewSurfaceProps) {
  return (
    <NativeSurface
      baseClassName="rounded-xl border border-border bg-background p-3"
      className={className}
      {...props}
    />
  );
}

export function ChartTooltipContent({ className, ...props }: ChartTooltipContentProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export const chartVariants = createWebParityVariants;
export const Chart = Object.assign(
  function ChartRoot({ className, ...props }: NativeViewSurfaceProps) {
    return <NativeSurface baseClassName="w-full" className={className} {...props} />;
  },
  {
    Container: ChartContainer,
    Legend: ChartLegend,
    LegendContent: ChartLegendContent,
    Style: ChartStyle,
    Tooltip: ChartTooltip,
    TooltipContent: ChartTooltipContent,
  },
);

export type ColumnDef<TData = unknown, TValue = unknown> = Record<string, unknown> & {
  accessorKey?: keyof TData | string;
  cell?: (value: TValue, row: TData) => ReactNode;
  header?: ReactNode;
  id?: string;
  meta?: TValue;
};
export type DataTableRootProps<TData = unknown> = NativeScrollSurfaceProps & {
  columns?: readonly ColumnDef<TData>[];
  data?: readonly TData[];
  pageSize?: number;
};
export type DataTableProps<TData = unknown> = DataTableRootProps<TData>;
export type DataTableVariants = Record<string, unknown>;

function columnKey<TData>(column: ColumnDef<TData>, index: number) {
  return String(column.accessorKey ?? column.id ?? index);
}

function cellValue<TData>(row: TData, column: ColumnDef<TData>) {
  if (!column.accessorKey || row == null || typeof row !== "object") return undefined;
  return (row as Record<string, unknown>)[String(column.accessorKey)];
}

export function DataTableRoot<TData = unknown>({
  children,
  className,
  columns,
  data,
  pageSize,
  ...props
}: DataTableRootProps<TData>) {
  const nativeProps = stripSharedProps(props);
  const visibleRows = pageSize ? data?.slice(0, pageSize) : data;

  return (
    <ScrollView
      className={`rounded-2xl border border-border bg-background ${className ?? ""}`}
      horizontal
      {...nativeProps}
    >
      <View className="min-w-full">
        {children ? (
          renderNode(children)
        ) : (
          <>
            {columns?.length ? (
              <View className="flex-row border-border border-b bg-default">
                {columns.map((column, index) => (
                  <View className="min-w-32 flex-1 px-3 py-2" key={columnKey(column, index)}>
                    <Text className="text-xs font-semibold text-muted">
                      {column.header ?? String(column.id ?? column.accessorKey ?? "")}
                    </Text>
                  </View>
                ))}
              </View>
            ) : null}
            {visibleRows?.map((row, rowIndex) => (
              <View className="flex-row border-border border-b" key={rowIndex}>
                {(columns ?? []).map((column, columnIndex) => {
                  const value = cellValue(row, column);

                  return (
                    <View
                      className="min-w-32 flex-1 px-3 py-2"
                      key={columnKey(column, columnIndex)}
                    >
                      {renderNode(
                        column.cell
                          ? column.cell(value as never, row)
                          : value == null
                            ? ""
                            : String(value),
                      )}
                    </View>
                  );
                })}
              </View>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
}

export const dataTableVariants = createWebParityVariants;
export const DataTable = Object.assign(DataTableRoot, {
  Root: DataTableRoot,
});

export type ModalRootProps = NativeViewSurfaceProps;
export type ModalBackdropProps = NativeViewSurfaceProps;
export type ModalBodyProps = NativeViewSurfaceProps;
export type ModalCloseTriggerProps = NativePressableSurfaceProps;
export type ModalContainerProps = NativeViewSurfaceProps;
export type ModalDialogProps = NativeViewSurfaceProps;
export type ModalFooterProps = NativeViewSurfaceProps;
export type ModalHeaderProps = NativeViewSurfaceProps;
export type ModalHeadingProps = NativeTextSurfaceProps;
export type ModalIconProps = NativeViewSurfaceProps;
export type ModalTriggerProps = NativePressableSurfaceProps;
export type ModalProps = ModalRootProps;
export type ModalVariants = Record<string, unknown>;

export function ModalRoot({ className, ...props }: ModalRootProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function ModalBackdrop({ className, ...props }: ModalBackdropProps) {
  return (
    <NativeSurface baseClassName="absolute inset-0 bg-black/40" className={className} {...props} />
  );
}

export function ModalContainer({ className, ...props }: ModalContainerProps) {
  return (
    <NativeSurface
      baseClassName="items-center justify-center p-4"
      className={className}
      {...props}
    />
  );
}

export function ModalDialog({ className, ...props }: ModalDialogProps) {
  return (
    <NativeSurface
      baseClassName="w-full max-w-md gap-4 rounded-2xl bg-background p-5"
      className={className}
      {...props}
    />
  );
}

export function ModalHeader({ className, ...props }: ModalHeaderProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export function ModalHeading({ className, ...props }: ModalHeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-lg font-semibold text-foreground"
      className={className}
      {...props}
    />
  );
}

export function ModalBody({ className, ...props }: ModalBodyProps) {
  return <NativeSurface baseClassName="gap-3" className={className} {...props} />;
}

export function ModalFooter({ className, ...props }: ModalFooterProps) {
  return (
    <NativeSurface
      baseClassName="flex-row items-center justify-end gap-2"
      className={className}
      {...props}
    />
  );
}

export function ModalIcon({ className, ...props }: ModalIconProps) {
  return (
    <NativeSurface
      baseClassName="size-10 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    />
  );
}

export function ModalTrigger({ className, ...props }: ModalTriggerProps) {
  return <NativePressableSurface baseClassName="self-start" className={className} {...props} />;
}

export function ModalCloseTrigger({ children, className, ...props }: ModalCloseTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="size-9 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-base text-foreground">×</Text>}
    </NativePressableSurface>
  );
}

export const modalVariants = createWebParityVariants;
export const Modal = Object.assign(ModalRoot, {
  Backdrop: ModalBackdrop,
  Body: ModalBody,
  CloseTrigger: ModalCloseTrigger,
  Container: ModalContainer,
  Dialog: ModalDialog,
  Footer: ModalFooter,
  Header: ModalHeader,
  Heading: ModalHeading,
  Icon: ModalIcon,
  Root: ModalRoot,
  Trigger: ModalTrigger,
});

export type DrawerRootProps = NativeViewSurfaceProps;
export type DrawerBackdropProps = NativeViewSurfaceProps;
export type DrawerBodyProps = NativeViewSurfaceProps;
export type DrawerCloseTriggerProps = NativePressableSurfaceProps;
export type DrawerContentProps = NativeViewSurfaceProps;
export type DrawerDialogProps = NativeViewSurfaceProps;
export type DrawerFooterProps = NativeViewSurfaceProps;
export type DrawerHandleProps = NativeViewSurfaceProps;
export type DrawerHeaderProps = NativeViewSurfaceProps;
export type DrawerHeadingProps = NativeTextSurfaceProps;
export type DrawerTriggerProps = NativePressableSurfaceProps;
export type DrawerProps = DrawerRootProps;
export type DrawerVariants = Record<string, unknown>;

export function DrawerRoot({ className, ...props }: DrawerRootProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function DrawerBackdrop({ className, ...props }: DrawerBackdropProps) {
  return (
    <NativeSurface baseClassName="absolute inset-0 bg-black/35" className={className} {...props} />
  );
}

export function DrawerDialog({ className, ...props }: DrawerDialogProps) {
  return (
    <NativeSurface
      baseClassName="ml-auto h-full w-80 max-w-full gap-4 bg-background p-4"
      className={className}
      {...props}
    />
  );
}

export function DrawerHandle({ className, ...props }: DrawerHandleProps) {
  return (
    <NativeSurface
      baseClassName="mx-auto h-1 w-10 rounded-full bg-border"
      className={className}
      {...props}
    />
  );
}

export function DrawerHeader({ className, ...props }: DrawerHeaderProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export function DrawerHeading({ className, ...props }: DrawerHeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-lg font-semibold text-foreground"
      className={className}
      {...props}
    />
  );
}

export function DrawerBody({ className, ...props }: DrawerBodyProps) {
  return <NativeSurface baseClassName="flex-1 gap-3" className={className} {...props} />;
}

export function DrawerContent({ className, ...props }: DrawerContentProps) {
  return <NativeSurface baseClassName="gap-3" className={className} {...props} />;
}

export function DrawerFooter({ className, ...props }: DrawerFooterProps) {
  return (
    <NativeSurface
      baseClassName="gap-2 border-border border-t pt-3"
      className={className}
      {...props}
    />
  );
}

export function DrawerTrigger({ className, ...props }: DrawerTriggerProps) {
  return <NativePressableSurface baseClassName="self-start" className={className} {...props} />;
}

export function DrawerCloseTrigger({ children, className, ...props }: DrawerCloseTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="size-9 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-base text-foreground">×</Text>}
    </NativePressableSurface>
  );
}

export const drawerVariants = createWebParityVariants;
export const Drawer = Object.assign(DrawerRoot, {
  Backdrop: DrawerBackdrop,
  Body: DrawerBody,
  CloseTrigger: DrawerCloseTrigger,
  Content: DrawerContent,
  Dialog: DrawerDialog,
  Footer: DrawerFooter,
  Handle: DrawerHandle,
  Header: DrawerHeader,
  Heading: DrawerHeading,
  Root: DrawerRoot,
  Trigger: DrawerTrigger,
});

export type NavigationMenuRootProps = NativeViewSurfaceProps;
export type NavigationMenuContentProps = NativeViewSurfaceProps;
export type NavigationMenuIndicatorProps = NativeViewSurfaceProps;
export type NavigationMenuItemProps = NativePressableSurfaceProps;
export type NavigationMenuLinkProps = NativePressableSurfaceProps;
export type NavigationMenuListProps = NativeScrollSurfaceProps;
export type NavigationMenuTriggerProps = NativePressableSurfaceProps;
export type NavigationMenuViewportProps = NativeViewSurfaceProps;
export type NavigationMenuProps = NavigationMenuRootProps;
export type NavigationMenuVariants = Record<string, unknown>;

export function NavigationMenuRoot({ className, ...props }: NavigationMenuRootProps) {
  return <NativeSurface baseClassName="relative gap-2" className={className} {...props} />;
}

export function NavigationMenuList({
  children,
  className,
  horizontal = true,
  ...props
}: NavigationMenuListProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView
      className={`w-full ${className ?? ""}`}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={false}
      {...nativeProps}
    >
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function NavigationMenuItem({ className, ...props }: NavigationMenuItemProps) {
  return <NativePressableSurface baseClassName="rounded-xl" className={className} {...props} />;
}

export function NavigationMenuTrigger({ className, ...props }: NavigationMenuTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2"
      className={className}
      selectedClassName="bg-default"
      {...props}
    />
  );
}

export function NavigationMenuLink({ className, ...props }: NavigationMenuLinkProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function NavigationMenuContent({ className, ...props }: NavigationMenuContentProps) {
  return (
    <NativeSurface
      baseClassName="gap-2 rounded-2xl bg-background p-3"
      className={className}
      {...props}
    />
  );
}

export function NavigationMenuIndicator({ className, ...props }: NavigationMenuIndicatorProps) {
  return (
    <NativeSurface baseClassName="h-1 w-6 rounded-full bg-link" className={className} {...props} />
  );
}

export function NavigationMenuViewport({ className, ...props }: NavigationMenuViewportProps) {
  return (
    <NativeSurface
      baseClassName="overflow-hidden rounded-2xl border border-border bg-background"
      className={className}
      {...props}
    />
  );
}

export const navigationMenuVariants = createWebParityVariants;
export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Content: NavigationMenuContent,
  Indicator: NavigationMenuIndicator,
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  List: NavigationMenuList,
  Root: NavigationMenuRoot,
  Trigger: NavigationMenuTrigger,
  Viewport: NavigationMenuViewport,
});

export type ResizableProps = NativeViewSurfaceProps;
export type ResizablePanelGroupProps = NativeViewSurfaceProps & {
  direction?: "horizontal" | "vertical" | string;
};
export type ResizablePanelProps = NativeViewSurfaceProps;
export type ResizableHandleProps = NativeViewSurfaceProps;
export type ResizableVariants = Record<string, unknown>;

export function ResizableRoot({ className, ...props }: ResizableProps) {
  return <NativeSurface baseClassName="min-w-0" className={className} {...props} />;
}

export function ResizablePanelGroup({
  className,
  direction = "horizontal",
  ...props
}: ResizablePanelGroupProps) {
  return (
    <NativeSurface
      baseClassName={`min-w-0 ${direction === "vertical" ? "gap-1" : "flex-row gap-1"}`}
      className={className}
      {...props}
    />
  );
}

export function ResizablePanel({ className, ...props }: ResizablePanelProps) {
  return <NativeSurface baseClassName="min-w-0 flex-1" className={className} {...props} />;
}

export function ResizableHandle({ className, ...props }: ResizableHandleProps) {
  return (
    <NativeSurface
      baseClassName="self-stretch rounded-full bg-border"
      className={className}
      {...props}
    />
  );
}

export const resizableVariants = createWebParityVariants;
export const Resizable = Object.assign(ResizableRoot, {
  Handle: ResizableHandle,
  Panel: ResizablePanel,
  PanelGroup: ResizablePanelGroup,
});

export type ColorValue = string | { toString(): string };
export type Color = Record<string, unknown> | string;
export type ColorAxes = string | number;
export type ColorChannel = string | number;
export type ColorChannelRange = Record<string, unknown>;
export type ColorFormat = string | number;
export type ColorSpace = string | number;
export type AlphaChannel = string | number;
export type HSBChannel = string | number;
export type HSLChannel = string | number;
export type HSLHSBSharedChannel = string | number;
export type RGBChannel = string | number;

function colorString(value?: ColorValue | ReactNode) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "toString" in value) return value.toString();
  return "#64748b";
}

export function parseColor(value: string): ColorValue {
  return value;
}

export type ColorAreaRootProps = NativeViewSurfaceProps & {
  color?: ColorValue;
  value?: ColorValue;
};
export type ColorAreaThumbProps = NativeViewSurfaceProps;
export type ColorAreaProps = ColorAreaRootProps;
export type ColorAreaVariants = Record<string, unknown>;

export function ColorAreaRoot({ className, color, value, ...props }: ColorAreaRootProps) {
  return (
    <NativeSurface
      baseClassName="h-40 overflow-hidden rounded-2xl border border-border"
      className={className}
      style={[{ backgroundColor: colorString(color ?? value) }, props.style]}
      {...props}
    />
  );
}

export function ColorAreaThumb({ className, ...props }: ColorAreaThumbProps) {
  return (
    <NativeSurface
      baseClassName="size-6 rounded-full border-2 border-background bg-white"
      className={className}
      {...props}
    />
  );
}

export const colorAreaVariants = createWebParityVariants;
export const ColorArea = Object.assign(ColorAreaRoot, {
  Root: ColorAreaRoot,
  Thumb: ColorAreaThumb,
});

export type ColorFieldRootProps = NativeViewSurfaceProps;
export type ColorFieldProps = ColorFieldRootProps;
export type ColorFieldVariants = Record<string, unknown>;

export function ColorFieldRoot({ className, ...props }: ColorFieldRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export const colorFieldVariants = createWebParityVariants;
export const ColorField = Object.assign(ColorFieldRoot, {
  Root: ColorFieldRoot,
});

export type ColorInputGroupRootProps = NativeViewSurfaceProps;
export type ColorInputGroupInputProps = TextInputProps & { className?: string };
export type ColorInputGroupPrefixProps = NativeViewSurfaceProps;
export type ColorInputGroupSuffixProps = NativeViewSurfaceProps;
export type ColorInputGroupProps = ColorInputGroupRootProps;
export type ColorInputGroupVariants = Record<string, unknown>;

export function ColorInputGroupRoot({ className, ...props }: ColorInputGroupRootProps) {
  return (
    <NativeSurface
      baseClassName="min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background"
      className={className}
      {...props}
    />
  );
}

export function ColorInputGroupInput({
  className,
  placeholderTextColor = "#8a8a8a",
  ...props
}: ColorInputGroupInputProps) {
  return (
    <TextInput
      className={`min-h-11 min-w-0 flex-1 px-3 text-base text-foreground ${className ?? ""}`}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

export function ColorInputGroupPrefix({ className, ...props }: ColorInputGroupPrefixProps) {
  return <NativeSurface baseClassName="px-3" className={className} {...props} />;
}

export function ColorInputGroupSuffix({ className, ...props }: ColorInputGroupSuffixProps) {
  return <NativeSurface baseClassName="px-3" className={className} {...props} />;
}

export const colorInputGroupVariants = createWebParityVariants;
export const ColorInputGroup = Object.assign(ColorInputGroupRoot, {
  Input: ColorInputGroupInput,
  Prefix: ColorInputGroupPrefix,
  Root: ColorInputGroupRoot,
  Suffix: ColorInputGroupSuffix,
});

export type ColorPickerRootProps = NativeViewSurfaceProps;
export type ColorPickerPopoverProps = NativeViewSurfaceProps;
export type ColorPickerTriggerProps = NativePressableSurfaceProps;
export type ColorPickerProps = ColorPickerRootProps;
export type ColorPickerVariants = Record<string, unknown>;

export function ColorPickerRoot({ className, ...props }: ColorPickerRootProps) {
  return <NativeSurface baseClassName="relative gap-2" className={className} {...props} />;
}

export function ColorPickerPopover({ className, ...props }: ColorPickerPopoverProps) {
  return (
    <NativeSurface
      baseClassName="gap-3 rounded-2xl border border-border bg-background p-3"
      className={className}
      {...props}
    />
  );
}

export function ColorPickerTrigger({ className, ...props }: ColorPickerTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-2 rounded-xl border border-border px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export const colorPickerVariants = createWebParityVariants;
export const ColorPicker = Object.assign(ColorPickerRoot, {
  Popover: ColorPickerPopover,
  Root: ColorPickerRoot,
  Trigger: ColorPickerTrigger,
});

export type ColorSliderRootProps = NativeViewSurfaceProps;
export type ColorSliderTrackProps = NativeViewSurfaceProps & {
  color?: ColorValue;
  value?: ColorValue;
};
export type ColorSliderThumbProps = NativeViewSurfaceProps;
export type ColorSliderOutputProps = NativeTextSurfaceProps;
export type ColorSliderProps = ColorSliderRootProps;
export type ColorSliderChannelProps = NativeViewSurfaceProps;
export type ColorSliderVariants = Record<string, unknown>;

export function ColorSliderRoot({ className, ...props }: ColorSliderRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export function ColorSliderTrack({ className, color, value, ...props }: ColorSliderTrackProps) {
  return (
    <NativeSurface
      baseClassName="h-3 overflow-hidden rounded-full bg-default"
      className={className}
      style={[{ backgroundColor: colorString(color ?? value) }, props.style]}
      {...props}
    />
  );
}

export function ColorSliderThumb({ className, ...props }: ColorSliderThumbProps) {
  return (
    <NativeSurface
      baseClassName="size-6 rounded-full border-2 border-background bg-white"
      className={className}
      {...props}
    />
  );
}

export function ColorSliderOutput({ className, ...props }: ColorSliderOutputProps) {
  return <NativeTextSurface baseClassName="text-xs text-muted" className={className} {...props} />;
}

export const colorSliderVariants = createWebParityVariants;
export const ColorSlider = Object.assign(ColorSliderRoot, {
  Output: ColorSliderOutput,
  Root: ColorSliderRoot,
  Thumb: ColorSliderThumb,
  Track: ColorSliderTrack,
});

export type ColorSwatchRootProps = NativeViewSurfaceProps & {
  color?: ColorValue;
  value?: ColorValue;
};
export type ColorSwatchProps = ColorSwatchRootProps;
export type ColorSwatchVariants = Record<string, unknown>;

export function ColorSwatchRoot({ className, color, value, ...props }: ColorSwatchRootProps) {
  return (
    <NativeSurface
      baseClassName="size-8 rounded-full border border-border"
      className={className}
      style={[{ backgroundColor: colorString(color ?? value) }, props.style]}
      {...props}
    />
  );
}

export const colorSwatchVariants = createWebParityVariants;
export const ColorSwatch = Object.assign(ColorSwatchRoot, {
  Root: ColorSwatchRoot,
});

export type ColorSwatchPickerRootProps = NativeViewSurfaceProps;
export type ColorSwatchPickerItemProps = NativePressableSurfaceProps & {
  color?: ColorValue;
  value?: ColorValue;
};
export type ColorSwatchPickerIndicatorProps = NativeViewSurfaceProps;
export type ColorSwatchPickerSwatchProps = ColorSwatchRootProps;
export type ColorSwatchPickerProps = ColorSwatchPickerRootProps;
export type ColorSwatchPickerVariants = Record<string, unknown>;

export function ColorSwatchPickerRoot({ className, ...props }: ColorSwatchPickerRootProps) {
  return (
    <NativeSurface baseClassName="flex-row flex-wrap gap-2" className={className} {...props} />
  );
}

export function ColorSwatchPickerItem({
  children,
  className,
  color,
  value,
  ...props
}: ColorSwatchPickerItemProps) {
  return (
    <NativePressableSurface
      baseClassName="size-10 items-center justify-center rounded-full"
      className={className}
      {...props}
    >
      {children ?? <ColorSwatchRoot color={colorString(color ?? value)} />}
    </NativePressableSurface>
  );
}

export function ColorSwatchPickerIndicator({
  children,
  className,
  ...props
}: ColorSwatchPickerIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="absolute inset-0 items-center justify-center rounded-full"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-xs text-background">✓</Text>}
    </NativeSurface>
  );
}

export function ColorSwatchPickerSwatch(props: ColorSwatchPickerSwatchProps) {
  return <ColorSwatchRoot {...props} />;
}

export const colorSwatchPickerVariants = createWebParityVariants;
export const ColorSwatchPicker = Object.assign(ColorSwatchPickerRoot, {
  Indicator: ColorSwatchPickerIndicator,
  Item: ColorSwatchPickerItem,
  Root: ColorSwatchPickerRoot,
  Swatch: ColorSwatchPickerSwatch,
});

export type DateValue = Date | number | string | Record<string, unknown>;
export type DateRange = { end?: DateValue; start?: DateValue };
export type RangeValue<TValue = DateValue> = { end?: TValue; start?: TValue };
export type TimeValue = Date | number | string | Record<string, unknown>;

export type DateFieldRootProps = NativeViewSurfaceProps;
export type DateFieldProps = DateFieldRootProps;
export type DateFieldVariants = Record<string, unknown>;

export function DateFieldRoot({ className, ...props }: DateFieldRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export const dateFieldVariants = createWebParityVariants;
export const DateField = Object.assign(DateFieldRoot, {
  Root: DateFieldRoot,
});

export type DateInputGroupRootProps = NativeViewSurfaceProps;
export type DateInputGroupInputProps = TextInputProps & { className?: string };
export type DateInputGroupInputContainerProps = NativeViewSurfaceProps;
export type DateInputGroupPrefixProps = NativeViewSurfaceProps;
export type DateInputGroupSegmentProps = NativeTextSurfaceProps;
export type DateInputGroupSuffixProps = NativeViewSurfaceProps;
export type DateInputGroupProps = DateInputGroupRootProps;
export type DateInputGroupVariants = Record<string, unknown>;

export function DateInputGroupRoot({ className, ...props }: DateInputGroupRootProps) {
  return (
    <NativeSurface
      baseClassName="min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background"
      className={className}
      {...props}
    />
  );
}

export function DateInputGroupInput({
  className,
  placeholderTextColor = "#8a8a8a",
  ...props
}: DateInputGroupInputProps) {
  return (
    <TextInput
      className={`min-h-11 min-w-0 flex-1 px-2 text-base text-foreground ${className ?? ""}`}
      keyboardType={props.keyboardType ?? "numbers-and-punctuation"}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

export function DateInputGroupInputContainer({
  className,
  ...props
}: DateInputGroupInputContainerProps) {
  return (
    <NativeSurface
      baseClassName="min-w-0 flex-1 flex-row items-center"
      className={className}
      {...props}
    />
  );
}

export function DateInputGroupPrefix({ className, ...props }: DateInputGroupPrefixProps) {
  return <NativeSurface baseClassName="px-3" className={className} {...props} />;
}

export function DateInputGroupSegment({ className, ...props }: DateInputGroupSegmentProps) {
  return (
    <NativeTextSurface baseClassName="text-base text-foreground" className={className} {...props} />
  );
}

export function DateInputGroupSuffix({ className, ...props }: DateInputGroupSuffixProps) {
  return <NativeSurface baseClassName="px-3" className={className} {...props} />;
}

export const dateInputGroupVariants = createWebParityVariants;
export const DateInputGroup = Object.assign(DateInputGroupRoot, {
  Input: DateInputGroupInput,
  InputContainer: DateInputGroupInputContainer,
  Prefix: DateInputGroupPrefix,
  Root: DateInputGroupRoot,
  Segment: DateInputGroupSegment,
  Suffix: DateInputGroupSuffix,
});

type PickerRootProps = NativeViewSurfaceProps;
type PickerPopoverProps = NativeViewSurfaceProps;
type PickerTriggerProps = NativePressableSurfaceProps;
type PickerIndicatorProps = NativeViewSurfaceProps;

export type DatePickerRootProps = PickerRootProps;
export type DatePickerPopoverProps = PickerPopoverProps;
export type DatePickerTriggerProps = PickerTriggerProps;
export type DatePickerTriggerIndicatorProps = PickerIndicatorProps;
export type DatePickerProps = DatePickerRootProps;
export type DatePickerVariants = Record<string, unknown>;

export function DatePickerRoot({ className, ...props }: DatePickerRootProps) {
  return <NativeSurface baseClassName="relative gap-2" className={className} {...props} />;
}

export function DatePickerPopover({ className, ...props }: DatePickerPopoverProps) {
  return (
    <NativeSurface
      baseClassName="rounded-2xl border border-border bg-background p-3"
      className={className}
      {...props}
    />
  );
}

export function DatePickerTrigger({ className, ...props }: DatePickerTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 flex-row items-center gap-2 rounded-xl border border-border px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function DatePickerTriggerIndicator({
  children,
  className,
  ...props
}: DatePickerTriggerIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="ml-auto size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">⌄</Text>}
    </NativeSurface>
  );
}

export const datePickerVariants = createWebParityVariants;
export const DatePicker = Object.assign(DatePickerRoot, {
  Popover: DatePickerPopover,
  Root: DatePickerRoot,
  Trigger: DatePickerTrigger,
  TriggerIndicator: DatePickerTriggerIndicator,
});

export type DateRangePickerRootProps = PickerRootProps;
export type DateRangePickerPopoverProps = PickerPopoverProps;
export type DateRangePickerTriggerProps = PickerTriggerProps;
export type DateRangePickerTriggerIndicatorProps = PickerIndicatorProps;
export type DateRangePickerRangeSeparatorProps = NativeTextSurfaceProps;
export type DateRangePickerProps = DateRangePickerRootProps;
export type DateRangePickerVariants = Record<string, unknown>;

export function DateRangePickerRoot({ className, ...props }: DateRangePickerRootProps) {
  return <NativeSurface baseClassName="relative gap-2" className={className} {...props} />;
}

export function DateRangePickerPopover({ className, ...props }: DateRangePickerPopoverProps) {
  return <DatePickerPopover className={className} {...props} />;
}

export function DateRangePickerTrigger({ className, ...props }: DateRangePickerTriggerProps) {
  return <DatePickerTrigger className={className} {...props} />;
}

export function DateRangePickerTriggerIndicator({
  className,
  ...props
}: DateRangePickerTriggerIndicatorProps) {
  return <DatePickerTriggerIndicator className={className} {...props} />;
}

export function DateRangePickerRangeSeparator({
  children,
  className,
  ...props
}: DateRangePickerRangeSeparatorProps) {
  return (
    <NativeTextSurface baseClassName="px-1 text-sm text-muted" className={className} {...props}>
      {children ?? "-"}
    </NativeTextSurface>
  );
}

export const dateRangePickerVariants = createWebParityVariants;
export const DateRangePicker = Object.assign(DateRangePickerRoot, {
  Popover: DateRangePickerPopover,
  RangeSeparator: DateRangePickerRangeSeparator,
  Root: DateRangePickerRoot,
  Trigger: DateRangePickerTrigger,
  TriggerIndicator: DateRangePickerTriggerIndicator,
});

type CalendarSurfaceProps = NativeViewSurfaceProps;
type CalendarPressableProps = NativePressableSurfaceProps;

export type CalendarRootProps = CalendarSurfaceProps;
export type CalendarHeaderProps = CalendarSurfaceProps;
export type CalendarHeadingProps = NativeTextSurfaceProps;
export type CalendarNavButtonProps = CalendarPressableProps;
export type CalendarGridProps = NativeScrollSurfaceProps;
export type CalendarGridHeaderProps = CalendarSurfaceProps;
export type CalendarGridBodyProps = CalendarSurfaceProps;
export type CalendarHeaderCellProps = NativeTextSurfaceProps;
export type CalendarCellProps = CalendarPressableProps;
export type CalendarCellIndicatorProps = CalendarSurfaceProps;
export type CalendarProps = CalendarRootProps;
export type CalendarVariants = Record<string, unknown>;
export type YearPickerContextValue = Record<string, unknown>;
export type YearPickerStateContextValue = Record<string, unknown>;

export const YearPickerContext = createContext<YearPickerContextValue>({});
export const YearPickerStateContext = createContext<YearPickerStateContextValue>({});
export function useYearPicker() {
  return useContext(YearPickerContext);
}
export function useYearPickerState() {
  return useContext(YearPickerStateContext);
}

export function CalendarRoot({ className, ...props }: CalendarRootProps) {
  return (
    <NativeSurface
      baseClassName="gap-3 rounded-2xl bg-background p-3"
      className={className}
      {...props}
    />
  );
}

export function CalendarHeader({ className, ...props }: CalendarHeaderProps) {
  return (
    <NativeSurface
      baseClassName="flex-row items-center justify-between"
      className={className}
      {...props}
    />
  );
}

export function CalendarHeading({ className, ...props }: CalendarHeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-base font-semibold text-foreground"
      className={className}
      {...props}
    />
  );
}

export function CalendarNavButton({ className, ...props }: CalendarNavButtonProps) {
  return (
    <NativePressableSurface
      baseClassName="size-9 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    />
  );
}

export function CalendarGrid({ children, className, horizontal, ...props }: CalendarGridProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView className={`w-full ${className ?? ""}`} horizontal={horizontal} {...nativeProps}>
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function CalendarGridHeader({ className, ...props }: CalendarGridHeaderProps) {
  return <NativeSurface baseClassName="flex-row" className={className} {...props} />;
}

export function CalendarGridBody({ className, ...props }: CalendarGridBodyProps) {
  return <NativeSurface baseClassName="flex-row flex-wrap" className={className} {...props} />;
}

export function CalendarHeaderCell({ className, ...props }: CalendarHeaderCellProps) {
  return (
    <NativeTextSurface
      baseClassName="w-10 py-1 text-center text-xs text-muted"
      className={className}
      {...props}
    />
  );
}

export function CalendarCell({ className, ...props }: CalendarCellProps) {
  return (
    <NativePressableSurface
      baseClassName="size-10 items-center justify-center rounded-full"
      className={className}
      {...props}
    />
  );
}

export function CalendarCellIndicator({ className, ...props }: CalendarCellIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="absolute bottom-1 size-1 rounded-full bg-link"
      className={className}
      {...props}
    />
  );
}

export const calendarVariants = createWebParityVariants;
export const Calendar = Object.assign(CalendarRoot, {
  Cell: CalendarCell,
  CellIndicator: CalendarCellIndicator,
  Grid: CalendarGrid,
  GridBody: CalendarGridBody,
  GridHeader: CalendarGridHeader,
  Header: CalendarHeader,
  HeaderCell: CalendarHeaderCell,
  Heading: CalendarHeading,
  NavButton: CalendarNavButton,
  Root: CalendarRoot,
});

export type CalendarYearPickerCellProps = CalendarPressableProps;
export type CalendarYearPickerCellRenderProps = InteractiveState;
export type CalendarYearPickerGridProps = NativeScrollSurfaceProps;
export type CalendarYearPickerGridBodyProps = CalendarSurfaceProps;
export type CalendarYearPickerTriggerProps = CalendarPressableProps;
export type CalendarYearPickerTriggerHeadingProps = NativeTextSurfaceProps;
export type CalendarYearPickerTriggerIndicatorProps = CalendarSurfaceProps;
export type CalendarYearPickerTriggerRenderProps = InteractiveState;
export type CalendarYearPickerVariants = Record<string, unknown>;

export function CalendarYearPickerRoot({ className, ...props }: CalendarSurfaceProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export function CalendarYearPickerCell({ className, ...props }: CalendarYearPickerCellProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 min-w-20 items-center justify-center rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function CalendarYearPickerGrid({
  children,
  className,
  horizontal,
  ...props
}: CalendarYearPickerGridProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView className={`max-h-72 ${className ?? ""}`} horizontal={horizontal} {...nativeProps}>
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function CalendarYearPickerGridBody({
  className,
  ...props
}: CalendarYearPickerGridBodyProps) {
  return (
    <NativeSurface baseClassName="flex-row flex-wrap gap-2" className={className} {...props} />
  );
}

export function CalendarYearPickerTrigger({ className, ...props }: CalendarYearPickerTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-2 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function CalendarYearPickerTriggerHeading({
  className,
  ...props
}: CalendarYearPickerTriggerHeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-base font-semibold text-foreground"
      className={className}
      {...props}
    />
  );
}

export function CalendarYearPickerTriggerIndicator({
  children,
  className,
  ...props
}: CalendarYearPickerTriggerIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">⌄</Text>}
    </NativeSurface>
  );
}

export const calendarYearPickerVariants = createWebParityVariants;
export const CalendarYearPicker = Object.assign(CalendarYearPickerRoot, {
  Cell: CalendarYearPickerCell,
  Grid: CalendarYearPickerGrid,
  GridBody: CalendarYearPickerGridBody,
  Trigger: CalendarYearPickerTrigger,
  TriggerHeading: CalendarYearPickerTriggerHeading,
  TriggerIndicator: CalendarYearPickerTriggerIndicator,
});

export type RangeCalendarRootProps = CalendarRootProps;
export type RangeCalendarHeaderProps = CalendarHeaderProps;
export type RangeCalendarHeadingProps = CalendarHeadingProps;
export type RangeCalendarNavButtonProps = CalendarNavButtonProps;
export type RangeCalendarGridProps = CalendarGridProps;
export type RangeCalendarGridHeaderProps = CalendarGridHeaderProps;
export type RangeCalendarGridBodyProps = CalendarGridBodyProps;
export type RangeCalendarHeaderCellProps = CalendarHeaderCellProps;
export type RangeCalendarCellProps = CalendarCellProps;
export type RangeCalendarCellIndicatorProps = CalendarCellIndicatorProps;
export type RangeCalendarProps = RangeCalendarRootProps;
export type RangeCalendarVariants = Record<string, unknown>;

export const RangeCalendarRoot = CalendarRoot;
export const RangeCalendarHeader = CalendarHeader;
export const RangeCalendarHeading = CalendarHeading;
export const RangeCalendarNavButton = CalendarNavButton;
export const RangeCalendarGrid = CalendarGrid;
export const RangeCalendarGridHeader = CalendarGridHeader;
export const RangeCalendarGridBody = CalendarGridBody;
export const RangeCalendarHeaderCell = CalendarHeaderCell;
export const RangeCalendarCell = CalendarCell;
export const RangeCalendarCellIndicator = CalendarCellIndicator;
export const rangeCalendarVariants = createWebParityVariants;
export const RangeCalendar = Object.assign(RangeCalendarRoot, {
  Cell: RangeCalendarCell,
  CellIndicator: RangeCalendarCellIndicator,
  Grid: RangeCalendarGrid,
  GridBody: RangeCalendarGridBody,
  GridHeader: RangeCalendarGridHeader,
  Header: RangeCalendarHeader,
  HeaderCell: RangeCalendarHeaderCell,
  Heading: RangeCalendarHeading,
  NavButton: RangeCalendarNavButton,
  Root: RangeCalendarRoot,
});

export const BUTTON_GROUP_CHILD = "button-group-child";
export type ButtonGroupRootProps = NativeViewSurfaceProps;
export type ButtonGroupSeparatorProps = NativeViewSurfaceProps;
export type ButtonGroupProps = ButtonGroupRootProps;
export type ButtonGroupVariants = Record<string, unknown>;

export const ButtonGroupContext = createContext<Record<string, unknown>>({});

export function ButtonGroupRoot({ className, ...props }: ButtonGroupRootProps) {
  return (
    <NativeSurface
      baseClassName="flex-row items-center overflow-hidden rounded-xl"
      className={className}
      {...props}
    />
  );
}

export function ButtonGroupSeparator({ className, ...props }: ButtonGroupSeparatorProps) {
  return (
    <NativeSurface baseClassName="w-px self-stretch bg-border" className={className} {...props} />
  );
}

export const buttonGroupVariants = createWebParityVariants;
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Context: ButtonGroupContext,
  Root: ButtonGroupRoot,
  Separator: ButtonGroupSeparator,
});

export type CheckboxGroupProps = NativeViewSurfaceProps;

export const CheckboxGroupVariants = createWebParityVariants;
export const checkboxGroupVariants = createWebParityVariants;
export const CheckboxGroup = Object.assign(
  function CheckboxGroupRoot({ className, ...props }: CheckboxGroupProps) {
    return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
  },
  {
    Variants: CheckboxGroupVariants,
  },
);

export type ComboBoxRootProps = NativeViewSurfaceProps;
export type ComboBoxInputGroupProps = NativeViewSurfaceProps;
export type ComboBoxPopoverProps = NativeViewSurfaceProps;
export type ComboBoxTriggerProps = NativePressableSurfaceProps;
export type ComboBoxProps = ComboBoxRootProps;
export type ComboBoxVariants = Record<string, unknown>;

export const ComboBoxContext = createContext<Record<string, unknown>>({});

export function ComboBoxRoot({ className, ...props }: ComboBoxRootProps) {
  return <NativeSurface baseClassName="relative gap-2" className={className} {...props} />;
}

export function ComboBoxInputGroup({ className, ...props }: ComboBoxInputGroupProps) {
  return (
    <NativeSurface
      baseClassName="min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background"
      className={className}
      {...props}
    />
  );
}

export function ComboBoxPopover({ className, ...props }: ComboBoxPopoverProps) {
  return (
    <NativeSurface
      baseClassName="rounded-2xl border border-border bg-background p-2"
      className={className}
      {...props}
    />
  );
}

export function ComboBoxTrigger({ className, ...props }: ComboBoxTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 flex-row items-center gap-2 rounded-xl px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export const comboBoxVariants = createWebParityVariants;
export const ComboBox = Object.assign(ComboBoxRoot, {
  Context: ComboBoxContext,
  InputGroup: ComboBoxInputGroup,
  Popover: ComboBoxPopover,
  Root: ComboBoxRoot,
  Trigger: ComboBoxTrigger,
});

export type NumberFieldRootProps = NativeViewSurfaceProps;
export type NumberFieldGroupProps = NativeViewSurfaceProps;
export type NumberFieldInputProps = TextInputProps & { className?: string };
export type NumberFieldIncrementButtonProps = NativePressableSurfaceProps;
export type NumberFieldDecrementButtonProps = NativePressableSurfaceProps;
export type NumberFieldProps = NumberFieldRootProps;
export type NumberFieldVariants = Record<string, unknown>;

export function NumberFieldRoot({ className, ...props }: NumberFieldRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export function NumberFieldGroup({ className, ...props }: NumberFieldGroupProps) {
  return (
    <NativeSurface
      baseClassName="min-h-11 flex-row items-center overflow-hidden rounded-xl border border-border bg-background"
      className={className}
      {...props}
    />
  );
}

export function NumberFieldInput({
  className,
  placeholderTextColor = "#8a8a8a",
  ...props
}: NumberFieldInputProps) {
  return (
    <TextInput
      className={`min-h-11 min-w-0 flex-1 px-3 text-base text-foreground ${className ?? ""}`}
      keyboardType={props.keyboardType ?? "numeric"}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

export function NumberFieldIncrementButton({
  children,
  className,
  ...props
}: NumberFieldIncrementButtonProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 min-w-11 items-center justify-center border-border border-l"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-lg text-foreground">+</Text>}
    </NativePressableSurface>
  );
}

export function NumberFieldDecrementButton({
  children,
  className,
  ...props
}: NumberFieldDecrementButtonProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 min-w-11 items-center justify-center border-border border-r"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-lg text-foreground">-</Text>}
    </NativePressableSurface>
  );
}

export const numberFieldVariants = createWebParityVariants;
export const NumberField = Object.assign(NumberFieldRoot, {
  DecrementButton: NumberFieldDecrementButton,
  Group: NumberFieldGroup,
  IncrementButton: NumberFieldIncrementButton,
  Input: NumberFieldInput,
  Root: NumberFieldRoot,
});

type TableViewProps = NativeViewSurfaceProps;
type TableScrollProps = NativeScrollSurfaceProps;

export type TableRootProps = TableScrollProps;
export type TableScrollContainerProps = TableScrollProps;
export type TableContentProps = TableViewProps;
export type TableHeaderProps = TableViewProps;
export type TableBodyProps = TableViewProps;
export type TableFooterProps = TableViewProps;
export type TableRowProps = TableViewProps;
export type TableCellProps = TableViewProps;
export type TableColumnProps = TableViewProps;
export type TableColumnResizerProps = TableViewProps;
export type TableLoadMoreContentProps = TableViewProps;
export type TableLoadMoreItemProps = NativePressableSurfaceProps;
export type TableResizableContainerProps = TableViewProps;
export type TableProps = TableRootProps;
export type TableVariants = Record<string, unknown>;

function TableScrollSurface({
  children,
  className,
  horizontal,
  ...props
}: TableScrollProps & { baseClassName?: string }) {
  const { baseClassName = "", ...sharedProps } = props;
  const nativeProps = stripSharedProps(sharedProps);

  return (
    <ScrollView
      className={`${baseClassName} ${className ?? ""}`}
      horizontal={horizontal}
      {...nativeProps}
    >
      {renderNode(sharedContent(children, sharedProps))}
    </ScrollView>
  );
}

export function TableRoot({ className, horizontal = true, ...props }: TableRootProps) {
  return (
    <TableScrollSurface
      baseClassName="rounded-2xl border border-border bg-background"
      className={className}
      horizontal={horizontal}
      {...props}
    />
  );
}

export function TableScrollContainer({
  className,
  horizontal = true,
  ...props
}: TableScrollContainerProps) {
  return <TableScrollSurface className={className} horizontal={horizontal} {...props} />;
}

export function TableContent({ className, ...props }: TableContentProps) {
  return <NativeSurface baseClassName="min-w-full" className={className} {...props} />;
}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <NativeSurface
      baseClassName="border-border border-b bg-default"
      className={className}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <NativeSurface baseClassName="min-w-full" className={className} {...props} />;
}

export function TableFooter({ className, ...props }: TableFooterProps) {
  return (
    <NativeSurface
      baseClassName="border-border border-t bg-default"
      className={className}
      {...props}
    />
  );
}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <NativeSurface
      baseClassName="flex-row border-border border-b"
      className={className}
      {...props}
    />
  );
}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <NativeSurface baseClassName="min-w-32 flex-1 px-3 py-2" className={className} {...props} />
  );
}

export function TableColumn({ className, ...props }: TableColumnProps) {
  return (
    <NativeSurface baseClassName="min-w-32 flex-1 px-3 py-2" className={className} {...props} />
  );
}

export function TableColumnResizer({ className, ...props }: TableColumnResizerProps) {
  return (
    <NativeSurface baseClassName="w-px self-stretch bg-border" className={className} {...props} />
  );
}

export function TableCollection({ className, ...props }: TableContentProps) {
  return <NativeSurface baseClassName="min-w-full" className={className} {...props} />;
}

export function TableLoadMoreContent({ className, ...props }: TableLoadMoreContentProps) {
  return (
    <NativeSurface
      baseClassName="items-center justify-center px-3 py-3"
      className={className}
      {...props}
    />
  );
}

export function TableLoadMoreItem({ className, ...props }: TableLoadMoreItemProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 items-center justify-center px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function TableResizableContainer({ className, ...props }: TableResizableContainerProps) {
  return <NativeSurface baseClassName="min-w-full" className={className} {...props} />;
}

export function TableLayout({ children, className, horizontal, ...props }: TableScrollProps) {
  return (
    <TableScrollSurface className={className} horizontal={horizontal} {...props}>
      {children}
    </TableScrollSurface>
  );
}

export const tableVariants = createWebParityVariants;
export const Table = Object.assign(TableRoot, {
  Body: TableBody,
  Cell: TableCell,
  Collection: TableCollection,
  Column: TableColumn,
  ColumnResizer: TableColumnResizer,
  Content: TableContent,
  Footer: TableFooter,
  Header: TableHeader,
  LoadMoreContent: TableLoadMoreContent,
  LoadMoreItem: TableLoadMoreItem,
  ResizableContainer: TableResizableContainer,
  Root: TableRoot,
  Row: TableRow,
  ScrollContainer: TableScrollContainer,
});

export type TimeFieldRootProps = NativeViewSurfaceProps;
export type TimeFieldProps = TimeFieldRootProps;
export type TimeFieldVariants = Record<string, unknown>;

export function TimeFieldRoot({ className, ...props }: TimeFieldRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export const timeFieldVariants = createWebParityVariants;
export const TimeField = Object.assign(TimeFieldRoot, {
  Root: TimeFieldRoot,
});

export type ToggleRootProps = NativePressableSurfaceProps;
export type ToggleProps = ToggleRootProps;
export type ToggleVariants = Record<string, unknown>;
export type ToggleButtonRootProps = NativePressableSurfaceProps;
export type ToggleButtonProps = ToggleButtonRootProps;
export type ToggleButtonVariants = Record<string, unknown>;

export function ToggleRoot({ className, ...props }: ToggleRootProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center justify-center rounded-xl px-3 py-2"
      className={className}
      selectedClassName="bg-default"
      {...props}
    />
  );
}

export const toggleVariants = createWebParityVariants;
export const Toggle = Object.assign(ToggleRoot, {
  Root: ToggleRoot,
});

export function ToggleButtonRoot({ className, ...props }: ToggleButtonRootProps) {
  return <ToggleRoot className={className} {...props} />;
}

export const toggleButtonVariants = createWebParityVariants;
export const ToggleButton = Object.assign(ToggleButtonRoot, {
  Root: ToggleButtonRoot,
});

export const TOGGLE_BUTTON_GROUP_CHILD = "toggle-button-group-child";
export type ToggleButtonGroupRootProps = NativeViewSurfaceProps;
export type ToggleButtonGroupSeparatorProps = NativeViewSurfaceProps;
export type ToggleButtonGroupProps = ToggleButtonGroupRootProps;
export type ToggleButtonGroupVariants = Record<string, unknown>;

export const ToggleButtonGroupContext = createContext<Record<string, unknown>>({});

export function ToggleButtonGroupRoot({ className, ...props }: ToggleButtonGroupRootProps) {
  return (
    <NativeSurface
      baseClassName="flex-row items-center overflow-hidden rounded-xl bg-default p-1"
      className={className}
      {...props}
    />
  );
}

export function ToggleButtonGroupSeparator({
  className,
  ...props
}: ToggleButtonGroupSeparatorProps) {
  return (
    <NativeSurface baseClassName="w-px self-stretch bg-border" className={className} {...props} />
  );
}

export const toggleButtonGroupVariants = createWebParityVariants;
export const ToggleButtonGroup = Object.assign(ToggleButtonGroupRoot, {
  Context: ToggleButtonGroupContext,
  Root: ToggleButtonGroupRoot,
  Separator: ToggleButtonGroupSeparator,
});

export type ToolbarRootProps = NativeViewSurfaceProps;
export type ToolbarProps = ToolbarRootProps;
export type ToolbarVariants = Record<string, unknown>;

export function ToolbarRoot({ className, ...props }: ToolbarRootProps) {
  return (
    <NativeSurface baseClassName="flex-row items-center gap-1" className={className} {...props} />
  );
}

export const toolbarVariants = createWebParityVariants;
export const Toolbar = Object.assign(ToolbarRoot, {
  Root: ToolbarRoot,
});

export type TooltipRootProps = NativeViewSurfaceProps;
export type TooltipTriggerProps = NativePressableSurfaceProps;
export type TooltipContentProps = NativeViewSurfaceProps;
export type TooltipArrowProps = NativeViewSurfaceProps;
export type TooltipProps = TooltipRootProps;
export type TooltipVariants = Record<string, unknown>;

export function TooltipRoot({ className, ...props }: TooltipRootProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function TooltipTrigger({ className, ...props }: TooltipTriggerProps) {
  return <NativePressableSurface baseClassName="self-start" className={className} {...props} />;
}

export function TooltipContent({ className, ...props }: TooltipContentProps) {
  return (
    <NativeSurface
      baseClassName="rounded-xl bg-foreground px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function TooltipArrow({ className, ...props }: TooltipArrowProps) {
  return (
    <NativeSurface
      baseClassName="size-2 rotate-45 bg-foreground"
      className={className}
      {...props}
    />
  );
}

export const tooltipVariants = createWebParityVariants;
export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
});

export type AccordionBodyProps = NativeViewSurfaceProps;
export type AccordionHeadingProps = NativeTextSurfaceProps;

export function AccordionBody({ className, ...props }: AccordionBodyProps) {
  return <NativeSurface baseClassName="gap-2 px-4 pb-4" className={className} {...props} />;
}

export function AccordionHeading({ className, ...props }: AccordionHeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-base font-semibold text-foreground"
      className={className}
      {...props}
    />
  );
}

export type AlertDialogRootProps = ModalRootProps;
export type AlertDialogBackdropProps = ModalBackdropProps;
export type AlertDialogBodyProps = ModalBodyProps;
export type AlertDialogCloseTriggerProps = ModalCloseTriggerProps;
export type AlertDialogContainerProps = ModalContainerProps;
export type AlertDialogDialogProps = ModalDialogProps;
export type AlertDialogFooterProps = ModalFooterProps;
export type AlertDialogHeaderProps = ModalHeaderProps;
export type AlertDialogHeadingProps = ModalHeadingProps;
export type AlertDialogIconProps = ModalIconProps;
export type AlertDialogTriggerProps = ModalTriggerProps;
export type AlertDialogProps = AlertDialogRootProps;
export type AlertDialogVariants = Record<string, unknown>;

export const AlertDialogRoot = ModalRoot;
export const AlertDialogBackdrop = ModalBackdrop;
export const AlertDialogBody = ModalBody;
export const AlertDialogCloseTrigger = ModalCloseTrigger;
export const AlertDialogContainer = ModalContainer;
export const AlertDialogDialog = ModalDialog;
export const AlertDialogFooter = ModalFooter;
export const AlertDialogHeader = ModalHeader;
export const AlertDialogHeading = ModalHeading;
export const AlertDialogIcon = ModalIcon;
export const AlertDialogTrigger = ModalTrigger;
export const alertDialogVariants = createWebParityVariants;
export const AlertDialog = Object.assign(AlertDialogRoot, {
  Backdrop: AlertDialogBackdrop,
  Body: AlertDialogBody,
  CloseTrigger: AlertDialogCloseTrigger,
  Container: AlertDialogContainer,
  Dialog: AlertDialogDialog,
  Footer: AlertDialogFooter,
  Header: AlertDialogHeader,
  Heading: AlertDialogHeading,
  Icon: AlertDialogIcon,
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
});

export type AutocompleteRootProps = NativeViewSurfaceProps;
export type AutocompleteTriggerProps = NativePressableSurfaceProps;
export type AutocompletePopoverProps = NativeViewSurfaceProps;
export type AutocompleteValueProps = NativeViewSurfaceProps;
export type AutocompleteIndicatorProps = NativeViewSurfaceProps;
export type AutocompleteClearButtonProps = NativePressableSurfaceProps;
export type AutocompleteFilterProps = NativeViewSurfaceProps;
export type AutocompleteProps = AutocompleteRootProps;
export type AutocompleteVariants = Record<string, unknown>;

export function AutocompleteRoot({ className, ...props }: AutocompleteRootProps) {
  return <NativeSurface baseClassName="relative gap-2" className={className} {...props} />;
}

export function AutocompleteTrigger({ className, ...props }: AutocompleteTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-11 flex-row items-center gap-2 rounded-xl border border-border px-3 py-2"
      className={className}
      {...props}
    />
  );
}

export function AutocompletePopover({ className, ...props }: AutocompletePopoverProps) {
  return (
    <NativeSurface
      baseClassName="max-h-72 gap-1 rounded-2xl border border-border bg-background p-2"
      className={className}
      {...props}
    />
  );
}

export function AutocompleteValue({ className, ...props }: AutocompleteValueProps) {
  return <NativeSurface baseClassName="min-w-0 flex-1" className={className} {...props} />;
}

export function AutocompleteIndicator({
  children,
  className,
  ...props
}: AutocompleteIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="ml-auto size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">⌄</Text>}
    </NativeSurface>
  );
}

export function AutocompleteClearButton({
  children,
  className,
  ...props
}: AutocompleteClearButtonProps) {
  return (
    <NativePressableSurface
      baseClassName="size-8 items-center justify-center rounded-full bg-default"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">×</Text>}
    </NativePressableSurface>
  );
}

export function AutocompleteFilter({ className, ...props }: AutocompleteFilterProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export const autocompleteVariants = createWebParityVariants;
export const Autocomplete = Object.assign(AutocompleteRoot, {
  ClearButton: AutocompleteClearButton,
  Filter: AutocompleteFilter,
  Indicator: AutocompleteIndicator,
  Popover: AutocompletePopover,
  Root: AutocompleteRoot,
  Trigger: AutocompleteTrigger,
  Value: AutocompleteValue,
});

export type CheckboxContentProps = NativeTextSurfaceProps;
export type CheckboxControlProps = NativeViewSurfaceProps;

export function CheckboxContent({ className, ...props }: CheckboxContentProps) {
  return (
    <NativeTextSurface baseClassName="text-sm text-foreground" className={className} {...props} />
  );
}

export function CheckboxControl({ className, ...props }: CheckboxControlProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    />
  );
}

export type DisclosureRootProps = NativeViewSurfaceProps;
export type DisclosureTriggerProps = NativePressableSurfaceProps;
export type DisclosureHeadingProps = NativeTextSurfaceProps;
export type DisclosureContentProps = NativeViewSurfaceProps;
export type DisclosureBodyContentProps = NativeViewSurfaceProps;
export type DisclosureIndicatorProps = NativeViewSurfaceProps;
export type DisclosureProps = DisclosureRootProps;
export type DisclosureVariants = Record<string, unknown>;

export function DisclosureRoot({ className, ...props }: DisclosureRootProps) {
  return (
    <NativeSurface
      baseClassName="gap-2 border-border border-b py-3"
      className={className}
      {...props}
    />
  );
}

export function DisclosureTrigger({ className, ...props }: DisclosureTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center justify-between gap-3"
      className={className}
      {...props}
    />
  );
}

export function DisclosureHeading({ className, ...props }: DisclosureHeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-base font-medium text-foreground"
      className={className}
      {...props}
    />
  );
}

export function DisclosureContent({ className, ...props }: DisclosureContentProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export function DisclosureBody({ className, ...props }: DisclosureBodyContentProps) {
  return <NativeSurface baseClassName="gap-2 pb-1" className={className} {...props} />;
}

export function DisclosureIndicator({ children, className, ...props }: DisclosureIndicatorProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-sm text-muted">⌄</Text>}
    </NativeSurface>
  );
}

export const disclosureVariants = createWebParityVariants;
export const Disclosure = Object.assign(DisclosureRoot, {
  Body: DisclosureBody,
  Content: DisclosureContent,
  Heading: DisclosureHeading,
  Indicator: DisclosureIndicator,
  Root: DisclosureRoot,
  Trigger: DisclosureTrigger,
});

export type DisclosureGroupRootProps = NativeViewSurfaceProps;
export type DisclosureGroupProps = DisclosureGroupRootProps;
export type DisclosureGroupVariants = Record<string, unknown>;
export type UseDisclosureGroupNavigationProps = Record<string, unknown>;
export type UseDisclosureGroupNavigationReturn = Record<string, unknown>;

export function DisclosureGroupRoot({ className, ...props }: DisclosureGroupRootProps) {
  return <NativeSurface baseClassName="gap-0" className={className} {...props} />;
}

export const disclosureGroupVariants = createWebParityVariants;
export function useDisclosureGroupNavigation(
  ..._args: readonly unknown[]
): UseDisclosureGroupNavigationReturn {
  return {};
}
export const DisclosureGroup = Object.assign(DisclosureGroupRoot, {
  Root: DisclosureGroupRoot,
});

export type HeaderRootProps = NativeViewSurfaceProps;
export type HeaderProps = HeaderRootProps;
export type HeadingProps = NativeTextSurfaceProps;
export type ParagraphProps = NativeTextSurfaceProps;
export type ProseProps = NativeViewSurfaceProps;

export function HeaderRoot({ className, ...props }: HeaderRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export const Header = HeaderRoot;
export const headerVariants = createWebParityVariants;

export function Heading({ className, ...props }: HeadingProps) {
  return (
    <NativeTextSurface
      baseClassName="text-2xl font-semibold text-foreground"
      className={className}
      {...props}
    />
  );
}

export function Paragraph({ className, ...props }: ParagraphProps) {
  return (
    <NativeTextSurface
      baseClassName="text-base leading-relaxed text-muted"
      className={className}
      {...props}
    />
  );
}

export function Prose({ className, ...props }: ProseProps) {
  return <NativeSurface baseClassName="gap-3" className={className} {...props} />;
}

export type InputGroupTextAreaProps = TextInputProps & { className?: string };

export function InputGroupTextArea({
  className,
  placeholderTextColor = "#8a8a8a",
  ...props
}: InputGroupTextAreaProps) {
  return (
    <TextInput
      className={`min-h-24 min-w-0 flex-1 px-3 py-2 text-base text-foreground ${className ?? ""}`}
      multiline
      placeholderTextColor={placeholderTextColor}
      textAlignVertical={props.textAlignVertical ?? "top"}
      {...props}
    />
  );
}

export type PopoverDialogProps = NativeViewSurfaceProps;

export function PopoverDialog({ className, ...props }: PopoverDialogProps) {
  return (
    <NativeSurface
      baseClassName="rounded-2xl border border-border bg-background p-3"
      className={className}
      {...props}
    />
  );
}

export type RadioContentProps = NativeTextSurfaceProps;
export type RadioControlProps = NativeViewSurfaceProps;

export function RadioContent({ className, ...props }: RadioContentProps) {
  return (
    <NativeTextSurface baseClassName="text-sm text-foreground" className={className} {...props} />
  );
}

export function RadioControl({ className, ...props }: RadioControlProps) {
  return (
    <NativeSurface
      baseClassName="size-5 items-center justify-center"
      className={className}
      {...props}
    />
  );
}

export type SheetRootProps = DrawerRootProps;
export type SheetTriggerProps = DrawerTriggerProps;
export type SheetBackdropProps = DrawerBackdropProps;
export type SheetContentProps = DrawerContentProps;
export type SheetDialogProps = DrawerDialogProps;
export type SheetHeaderProps = DrawerHeaderProps;
export type SheetTitleProps = DrawerHeadingProps;
export type SheetDescriptionProps = NativeTextSurfaceProps;
export type SheetBodyProps = DrawerBodyProps;
export type SheetFooterProps = DrawerFooterProps;
export type SheetCloseProps = DrawerCloseTriggerProps;
export type SheetProps = SheetRootProps;
export type SheetVariants = Record<string, unknown>;

export const SheetRoot = DrawerRoot;
export const SheetTrigger = DrawerTrigger;
export const SheetBackdrop = DrawerBackdrop;
export const SheetContent = DrawerContent;
export const SheetDialog = DrawerDialog;
export const SheetHeader = DrawerHeader;
export const SheetTitle = DrawerHeading;
export function SheetDescription({ className, ...props }: SheetDescriptionProps) {
  return <NativeTextSurface baseClassName="text-sm text-muted" className={className} {...props} />;
}
export const SheetBody = DrawerBody;
export const SheetFooter = DrawerFooter;
export const SheetClose = DrawerCloseTrigger;
export const sheetVariants = createWebParityVariants;
export const Sheet = Object.assign(SheetRoot, {
  Backdrop: SheetBackdrop,
  Body: SheetBody,
  Close: SheetClose,
  Content: SheetContent,
  Description: SheetDescription,
  Dialog: SheetDialog,
  Footer: SheetFooter,
  Header: SheetHeader,
  Root: SheetRoot,
  Title: SheetTitle,
  Trigger: SheetTrigger,
});

export type SidebarContextProps = {
  isMobile?: boolean;
  open?: boolean;
  openMobile?: boolean;
  setOpen?: (value: boolean) => void;
  setOpenMobile?: (value: boolean) => void;
  state?: "collapsed" | "expanded";
  toggleSidebar?: () => void;
};

export type SidebarMenuButtonProps = NativePressableSurfaceProps & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: ReactNode;
};

const SidebarContext = createContext<SidebarContextProps>({
  isMobile: true,
  open: true,
  openMobile: false,
  state: "expanded",
});

export type SidebarProviderProps = NativeViewSurfaceProps & SidebarContextProps;
export type SidebarRootProps = NativeViewSurfaceProps;
export type SidebarTriggerProps = NativePressableSurfaceProps;
export type SidebarRailProps = NativePressableSurfaceProps;
export type SidebarInsetProps = NativeViewSurfaceProps;
export type SidebarInputProps = TextInputProps & { className?: string };
export type SidebarHeaderProps = NativeViewSurfaceProps;
export type SidebarFooterProps = NativeViewSurfaceProps;
export type SidebarContentProps = NativeScrollSurfaceProps;
export type SidebarSeparatorProps = ViewProps & { className?: string };
export type SidebarGroupProps = NativeViewSurfaceProps;
export type SidebarGroupLabelProps = NativeTextSurfaceProps;
export type SidebarGroupContentProps = NativeViewSurfaceProps;
export type SidebarGroupActionProps = NativePressableSurfaceProps;
export type SidebarMenuProps = NativeViewSurfaceProps;
export type SidebarMenuItemProps = NativeViewSurfaceProps;
export type SidebarMenuActionProps = NativePressableSurfaceProps;
export type SidebarMenuBadgeProps = NativeTextSurfaceProps;
export type SidebarMenuSkeletonProps = NativeViewSurfaceProps;
export type SidebarMenuSubProps = NativeViewSurfaceProps;
export type SidebarMenuSubItemProps = NativeViewSurfaceProps;
export type SidebarMenuSubButtonProps = NativePressableSurfaceProps;

export function SidebarProvider({
  children,
  isMobile = true,
  open = true,
  openMobile = false,
  setOpen,
  setOpenMobile,
  state = open ? "expanded" : "collapsed",
  toggleSidebar,
}: SidebarProviderProps) {
  const value = useMemo(
    () => ({
      isMobile,
      open,
      openMobile,
      setOpen,
      setOpenMobile,
      state,
      toggleSidebar,
    }),
    [isMobile, open, openMobile, setOpen, setOpenMobile, state, toggleSidebar],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarRoot({ className, ...props }: SidebarRootProps) {
  return (
    <NativeSurface
      baseClassName="w-72 max-w-full gap-3 border-border border-r bg-background"
      className={className}
      {...props}
    />
  );
}

export function SidebarTrigger({ children, className, ...props }: SidebarTriggerProps) {
  return (
    <NativePressableSurface
      baseClassName="size-10 items-center justify-center rounded-xl bg-default"
      className={className}
      {...props}
    >
      {children ?? <Text className="text-lg text-foreground">≡</Text>}
    </NativePressableSurface>
  );
}

export function SidebarRail({ className, ...props }: SidebarRailProps) {
  return (
    <NativePressableSurface baseClassName="w-2 self-stretch" className={className} {...props} />
  );
}

export function SidebarInset({ className, ...props }: SidebarInsetProps) {
  return <NativeSurface baseClassName="min-w-0 flex-1" className={className} {...props} />;
}

export function SidebarInput({
  className,
  placeholderTextColor = "#8a8a8a",
  ...props
}: SidebarInputProps) {
  return (
    <TextInput
      className={`min-h-10 rounded-xl border border-border px-3 text-base text-foreground ${className ?? ""}`}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}

export function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return <NativeSurface baseClassName="gap-2 p-3" className={className} {...props} />;
}

export function SidebarFooter({ className, ...props }: SidebarFooterProps) {
  return (
    <NativeSurface
      baseClassName="gap-2 border-border border-t p-3"
      className={className}
      {...props}
    />
  );
}

export function SidebarContent({ children, className, horizontal, ...props }: SidebarContentProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView className={`flex-1 ${className ?? ""}`} horizontal={horizontal} {...nativeProps}>
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export function SidebarSeparator(props: SidebarSeparatorProps) {
  return <NativeSeparator {...props} />;
}

export function SidebarGroup({ className, ...props }: SidebarGroupProps) {
  return <NativeSurface baseClassName="gap-1 px-2 py-2" className={className} {...props} />;
}

export function SidebarGroupLabel({ className, ...props }: SidebarGroupLabelProps) {
  return (
    <NativeTextSurface
      baseClassName="px-2 py-1 text-xs font-semibold uppercase text-muted"
      className={className}
      {...props}
    />
  );
}

export function SidebarGroupContent({ className, ...props }: SidebarGroupContentProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export function SidebarGroupAction({ className, ...props }: SidebarGroupActionProps) {
  return (
    <NativePressableSurface
      baseClassName="size-8 items-center justify-center rounded-lg"
      className={className}
      {...props}
    />
  );
}

export function SidebarMenu({ className, ...props }: SidebarMenuProps) {
  return <NativeSurface baseClassName="gap-1" className={className} {...props} />;
}

export function SidebarMenuItem({ className, ...props }: SidebarMenuItemProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function SidebarMenuButton({
  className,
  isActive,
  selected,
  ...props
}: SidebarMenuButtonProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-10 flex-row items-center gap-3 rounded-xl px-3 py-2"
      className={className}
      selected={selected ?? isActive}
      selectedClassName="bg-default"
      {...props}
    />
  );
}

export function SidebarMenuAction({ className, ...props }: SidebarMenuActionProps) {
  return (
    <NativePressableSurface
      baseClassName="size-8 items-center justify-center rounded-lg"
      className={className}
      {...props}
    />
  );
}

export function SidebarMenuBadge({ className, ...props }: SidebarMenuBadgeProps) {
  return (
    <NativeTextSurface
      baseClassName="ml-auto rounded-full bg-default px-2 py-0.5 text-xs text-muted"
      className={className}
      {...props}
    />
  );
}

export function SidebarMenuSkeleton({ className, ...props }: SidebarMenuSkeletonProps) {
  return (
    <NativeSurface baseClassName="h-10 rounded-xl bg-default" className={className} {...props} />
  );
}

export function SidebarMenuSub({ className, ...props }: SidebarMenuSubProps) {
  return (
    <NativeSurface
      baseClassName="ml-4 gap-1 border-border border-l pl-2"
      className={className}
      {...props}
    />
  );
}

export function SidebarMenuSubItem({ className, ...props }: SidebarMenuSubItemProps) {
  return <NativeSurface baseClassName="relative" className={className} {...props} />;
}

export function SidebarMenuSubButton({ className, ...props }: SidebarMenuSubButtonProps) {
  return (
    <NativePressableSurface
      baseClassName="min-h-9 flex-row items-center gap-2 rounded-lg px-2 py-1.5"
      className={className}
      selectedClassName="bg-default"
      {...props}
    />
  );
}

export const sidebarMenuButtonVariants = createWebParityVariants;
export const Sidebar = Object.assign(SidebarRoot, {
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  GroupLabel: SidebarGroupLabel,
  Header: SidebarHeader,
  Input: SidebarInput,
  Inset: SidebarInset,
  Menu: SidebarMenu,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuButton: SidebarMenuButton,
  MenuItem: SidebarMenuItem,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubButton: SidebarMenuSubButton,
  MenuSubItem: SidebarMenuSubItem,
  Provider: SidebarProvider,
  Rail: SidebarRail,
  Root: SidebarRoot,
  Separator: SidebarSeparator,
  Trigger: SidebarTrigger,
});

export type SliderMarksProps = NativeViewSurfaceProps;

export function SliderMarks({ className, ...props }: SliderMarksProps) {
  return (
    <NativeSurface baseClassName="mt-2 flex-row justify-between" className={className} {...props} />
  );
}

export const SurfaceContext = createContext<Record<string, unknown>>({});

export type SwitchContentProps = NativeTextSurfaceProps;
export type SwitchControlProps = NativeViewSurfaceProps;
export type SwitchIconProps = NativeViewSurfaceProps;
export type SwitchGroupRootProps = NativeViewSurfaceProps;
export type SwitchGroupProps = SwitchGroupRootProps;
export type SwitchGroupVariants = Record<string, unknown>;

export function SwitchContent({ className, ...props }: SwitchContentProps) {
  return (
    <NativeTextSurface baseClassName="text-sm text-foreground" className={className} {...props} />
  );
}

export function SwitchControl({ className, ...props }: SwitchControlProps) {
  return (
    <NativeSurface
      baseClassName="min-w-11 items-center justify-center"
      className={className}
      {...props}
    />
  );
}

export function SwitchIcon({ className, ...props }: SwitchIconProps) {
  return (
    <NativeSurface
      baseClassName="size-4 items-center justify-center"
      className={className}
      {...props}
    />
  );
}

export function SwitchGroupRoot({ className, ...props }: SwitchGroupRootProps) {
  return <NativeSurface baseClassName="gap-2" className={className} {...props} />;
}

export const switchGroupVariants = createWebParityVariants;
export const SwitchGroup = Object.assign(SwitchGroupRoot, {
  Root: SwitchGroupRoot,
});

export const TagGroupContext = createContext<Record<string, unknown>>({});
export const TextFieldContext = createContext<Record<string, unknown>>({});

export type ToastIndicatorProps = NativeViewSurfaceProps;
export type ToastContentValue = {
  actionProps?: Record<string, unknown>;
  description?: ReactNode;
  indicator?: ReactNode;
  isLoading?: boolean;
  title?: ReactNode;
  variant?: "accent" | "danger" | "default" | "success" | "warning";
};
export type ToastQueueOptions = {
  maxVisibleToasts?: number;
  wrapUpdate?: (fn: () => void) => void;
};

export const DEFAULT_GAP = 12;
export const DEFAULT_MAX_VISIBLE_TOAST = 3;
export const DEFAULT_TOAST_TIMEOUT = 4000;

let nextToastKey = 0;

export class ToastQueue<T extends object = ToastContentValue> {
  private listeners = new Set<() => void>();
  private toasts: Array<{ content: T; key: string }> = [];
  readonly maxVisibleToasts?: number;

  constructor(options?: ToastQueueOptions) {
    this.maxVisibleToasts = options?.maxVisibleToasts;
  }

  add(content: T): string {
    const key = `toast-${nextToastKey++}`;
    this.toasts = [{ content, key }, ...this.toasts].slice(0, this.maxVisibleToasts ?? undefined);
    this.emit();
    return key;
  }

  close(key: string): void {
    this.toasts = this.toasts.filter((toastItem) => toastItem.key !== key);
    this.emit();
  }

  pauseAll(): void {}

  resumeAll(): void {}

  clear(): void {
    this.toasts = [];
    this.emit();
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  get visibleToasts() {
    return this.toasts;
  }

  getQueue() {
    return this;
  }

  private emit() {
    for (const listener of this.listeners) listener();
  }
}

export function ToastIndicator({ className, ...props }: ToastIndicatorProps) {
  return (
    <NativeSurface baseClassName="size-2 rounded-full bg-link" className={className} {...props} />
  );
}

export const toastQueue = new ToastQueue<ToastContentValue>({
  maxVisibleToasts: DEFAULT_MAX_VISIBLE_TOAST,
});

function makeToast(queue: ToastQueue<ToastContentValue>) {
  const toastFn = (message: ReactNode, options?: Omit<ToastContentValue, "title">): string =>
    queue.add({
      ...options,
      title: message,
      variant: options?.variant ?? "default",
    });

  toastFn.success = (message: ReactNode, options?: Omit<ToastContentValue, "title" | "variant">) =>
    toastFn(message, { ...options, variant: "success" });
  toastFn.danger = (message: ReactNode, options?: Omit<ToastContentValue, "title" | "variant">) =>
    toastFn(message, { ...options, variant: "danger" });
  toastFn.info = (message: ReactNode, options?: Omit<ToastContentValue, "title" | "variant">) =>
    toastFn(message, { ...options, variant: "accent" });
  toastFn.warning = (message: ReactNode, options?: Omit<ToastContentValue, "title" | "variant">) =>
    toastFn(message, { ...options, variant: "warning" });
  toastFn.close = (key: string) => queue.close(key);
  toastFn.pauseAll = () => queue.pauseAll();
  toastFn.resumeAll = () => queue.resumeAll();
  toastFn.clear = () => queue.clear();
  toastFn.getQueue = () => queue.getQueue();

  return toastFn;
}

export const toast = makeToast(toastQueue);

type ProviderPassthroughProps = {
  children?: ReactNode;
};

function ProviderPassthrough({ children }: ProviderPassthroughProps) {
  return <>{children}</>;
}

export const I18nProvider = ProviderPassthrough;
export const RouterProvider = ProviderPassthrough;

export type CollectionProps = NativeScrollSurfaceProps;
export type ListLayoutProps = NativeScrollSurfaceProps;
export type VirtualizerProps = NativeScrollSurfaceProps;

function NativeCollection({ children, className, horizontal, ...props }: NativeScrollSurfaceProps) {
  const nativeProps = stripSharedProps(props);

  return (
    <ScrollView className={className} horizontal={horizontal} {...nativeProps}>
      {renderNode(sharedContent(children, props))}
    </ScrollView>
  );
}

export const Collection = NativeCollection;
export const ListLayout = NativeCollection;
export const Virtualizer = NativeCollection;

export function getLocalizationScript(..._args: readonly unknown[]) {
  return "";
}

export function isRTL(locale?: string) {
  return typeof locale === "string" && /^(ar|fa|he|ur)(-|$)/i.test(locale);
}

export function useFilter(..._args: readonly unknown[]) {
  return {
    contains: (value: string, search: string) =>
      value.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
    endsWith: (value: string, search: string) =>
      value.toLocaleLowerCase().endsWith(search.toLocaleLowerCase()),
    startsWith: (value: string, search: string) =>
      value.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()),
  };
}

export function useLocale() {
  return {
    direction: "ltr" as const,
    locale: "en-US",
  };
}

export type UseScrollShadowProps = Record<string, unknown>;
export function useScrollShadow(..._args: readonly unknown[]) {
  return {};
}

export type Direction = "ltr" | "rtl" | string;
export type HoverEvent = Record<string, unknown>;
export type KeyboardEvent = Record<string, unknown>;
export type Orientation = "horizontal" | "vertical" | string;
export type PointerType = "keyboard" | "mouse" | "pen" | "touch" | "virtual" | string;
export type PressEvent = Record<string, unknown>;
export type RouterConfig = Record<string, unknown>;
export type SortDescriptor = {
  column?: number | string;
  direction?: "ascending" | "descending" | string;
};
export type ValidationResult =
  | {
      isInvalid?: boolean;
      validationDetails?: Record<string, unknown>;
      validationErrors?: string[];
    }
  | null
  | undefined;
