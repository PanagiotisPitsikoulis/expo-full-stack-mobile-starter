export type KbdKey =
  | "alt"
  | "capslock"
  | "command"
  | "ctrl"
  | "delete"
  | "down"
  | "end"
  | "enter"
  | "escape"
  | "fn"
  | "help"
  | "home"
  | "left"
  | "option"
  | "pagedown"
  | "pageup"
  | "right"
  | "shift"
  | "space"
  | "tab"
  | "up"
  | "win";

export const kbdKeysMap: Record<KbdKey, string> = {
  alt: "⌥",
  capslock: "⇪",
  command: "⌘",
  ctrl: "⌃",
  delete: "⌫",
  down: "↓",
  end: "↘",
  enter: "↵",
  escape: "⎋",
  fn: "Fn",
  help: "?",
  home: "↖",
  left: "←",
  option: "⌥",
  pagedown: "⇟",
  pageup: "⇞",
  right: "→",
  shift: "⇧",
  space: "␣",
  tab: "⇥",
  up: "↑",
  win: "⌘",
};

export const kbdKeysLabelMap: Record<KbdKey, string> = {
  alt: "Alt",
  capslock: "Caps Lock",
  command: "Command",
  ctrl: "Control",
  delete: "Delete",
  down: "Down",
  end: "End",
  enter: "Enter",
  escape: "Escape",
  fn: "Fn",
  help: "Help",
  home: "Home",
  left: "Left",
  option: "Option",
  pagedown: "Page Down",
  pageup: "Page Up",
  right: "Right",
  shift: "Shift",
  space: "Space",
  tab: "Tab",
  up: "Up",
  win: "Win",
};
