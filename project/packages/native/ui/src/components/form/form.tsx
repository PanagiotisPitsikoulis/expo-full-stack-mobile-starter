import { forwardRef, type ReactNode } from "react";
import { View, type ViewProps } from "react-native";

export interface FormRootProps extends ViewProps {
  children?: ReactNode;
  className?: string;
  onReset?: () => void;
  onSubmit?: () => void;
}

const FormRoot = forwardRef<View, FormRootProps>(
  ({ children, className, onReset: _onReset, onSubmit: _onSubmit, ...props }, ref) => {
    return (
      <View className={className} ref={ref} {...props}>
        {children}
      </View>
    );
  },
);

FormRoot.displayName = "PitsiUINative.Form";

export { FormRoot };
