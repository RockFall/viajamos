import Image, { type ImageProps } from "next/image";
import { resolveEntityImage, resolveTripDayImage } from "@/lib/images/resolve";
import type { EntityImageKind } from "@/lib/images/types";

type BaseProps = Omit<ImageProps, "src" | "alt"> & {
  alt: string;
};

type EntityImageProps = BaseProps & {
  kind: EntityImageKind;
  entityId: string;
  category?: string | null;
};

type TripDayImageProps = BaseProps & {
  dayId: string;
  area?: "Miami" | "Islamorada" | "Travel" | null;
};

export function EntityImage({
  kind,
  entityId,
  category,
  alt,
  ...props
}: EntityImageProps) {
  return (
    <Image
      src={resolveEntityImage(kind, entityId, category)}
      alt={alt}
      {...props}
    />
  );
}

export function TripDayImage({
  dayId,
  area,
  alt,
  ...props
}: TripDayImageProps) {
  return (
    <Image
      src={resolveTripDayImage(dayId, area)}
      alt={alt}
      {...props}
    />
  );
}
