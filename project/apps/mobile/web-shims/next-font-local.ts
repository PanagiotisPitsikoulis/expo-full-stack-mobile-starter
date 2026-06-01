type LocalFontOptions = {
  variable?: string;
};

export default function localFont(options?: LocalFontOptions) {
  return {
    className: "",
    style: {},
    variable: options?.variable ?? "",
  };
}
