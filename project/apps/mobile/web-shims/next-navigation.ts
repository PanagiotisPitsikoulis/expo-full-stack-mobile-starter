export function redirect(url: string): never {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }

  throw new Error(`Redirected to ${url}`);
}

export function usePathname() {
  return typeof window === "undefined" ? "/" : window.location.pathname;
}

export function useRouter() {
  return {
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    prefetch: async () => undefined,
    push: (url: string) => {
      window.location.href = url;
    },
    refresh: () => window.location.reload(),
    replace: (url: string) => window.location.replace(url),
  };
}
