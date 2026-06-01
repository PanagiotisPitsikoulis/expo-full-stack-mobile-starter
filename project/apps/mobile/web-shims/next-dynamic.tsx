import type { ComponentType } from "react";

type Loader<TProps> = () => Promise<{ default: ComponentType<TProps> } | ComponentType<TProps>>;

export default function dynamic<TProps>(loader: Loader<TProps>) {
  let Loaded: ComponentType<TProps> | null = null;

  const DynamicComponent = (props: TProps) => {
    if (!Loaded) {
      void loader().then((module) => {
        Loaded = "default" in module ? module.default : module;
      });
      return null;
    }

    return <Loaded {...props} />;
  };

  return DynamicComponent;
}
