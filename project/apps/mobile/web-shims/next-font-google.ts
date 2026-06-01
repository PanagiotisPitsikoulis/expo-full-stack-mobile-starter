type FontOptions = {
  variable?: string;
};

type FontResult = {
  className: string;
  style: Record<string, string>;
  variable: string;
};

function createFont(options?: FontOptions): FontResult {
  return {
    className: "",
    style: {},
    variable: options?.variable ?? "",
  };
}

export const DM_Sans = createFont;
export const Figtree = createFont;
export const Geist = createFont;
export const Geist_Mono = createFont;
export const Inter = createFont;
export const JetBrains_Mono = createFont;
export const Noto_Sans = createFont;
export const Nunito_Sans = createFont;
export const Outfit = createFont;
export const Poppins = createFont;
export const Public_Sans = createFont;
export const Raleway = createFont;
export const Roboto = createFont;
