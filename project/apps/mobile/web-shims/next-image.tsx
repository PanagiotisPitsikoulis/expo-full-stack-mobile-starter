import type { CSSProperties, ImgHTMLAttributes } from "react";

export type StaticImageData = {
  blurDataURL?: string;
  height?: number;
  src: string;
  width?: number;
};

type NextImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "height" | "src" | "width"> & {
  fill?: boolean;
  height?: number | `${number}`;
  priority?: boolean;
  quality?: number | `${number}`;
  sizes?: string;
  src: StaticImageData | string;
  width?: number | `${number}`;
};

function resolveImageSource(src: StaticImageData | string): string {
  return typeof src === "string" ? src : src.src;
}

export default function Image({
  alt = "",
  fill,
  height,
  priority: _priority,
  quality: _quality,
  sizes: _sizes,
  src,
  style,
  width,
  ...props
}: NextImageProps) {
  const source = resolveImageSource(src);
  const imageStyle: CSSProperties | undefined = fill
    ? {
        height: "100%",
        inset: 0,
        objectFit: "cover",
        position: "absolute",
        width: "100%",
        ...style,
      }
    : style;

  return (
    <img
      alt={alt}
      height={height ?? (typeof src === "string" ? undefined : src.height)}
      src={source}
      style={imageStyle}
      width={width ?? (typeof src === "string" ? undefined : src.width)}
      {...props}
    />
  );
}
