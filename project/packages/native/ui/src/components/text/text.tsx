import { forwardRef } from "react";
import { HeroText, type HeroTextProps } from "../../helpers/internal/components";
import type { TextRef } from "../../helpers/internal/types";

export interface TextProps extends HeroTextProps {}

const Text = forwardRef<TextRef, TextProps>((props, ref) => <HeroText ref={ref} {...props} />);

Text.displayName = "PitsiUINative.Text";

export { Text };
export default Text;
