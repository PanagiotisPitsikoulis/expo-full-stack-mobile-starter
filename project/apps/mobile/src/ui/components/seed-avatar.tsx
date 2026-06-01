import { Image, View } from "react-native";

function hashSeed(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function SeedAvatar({ seed, size }: { seed: string; size: number }) {
  const safeSeed = encodeURIComponent(seed || "guest");
  const uri = `https://api.dicebear.com/9.x/fun-emoji/png?seed=${safeSeed}&size=256`;
  const hue = hashSeed(seed || "guest") % 360;
  return (
    <View
      style={{
        backgroundColor: `hsl(${hue}, 55%, 88%)`,
        borderRadius: size / 2,
        height: size,
        overflow: "hidden",
        width: size,
      }}
    >
      <Image
        accessibilityIgnoresInvertColors
        resizeMode="cover"
        source={{ uri }}
        style={{ height: "100%", width: "100%" }}
      />
    </View>
  );
}
