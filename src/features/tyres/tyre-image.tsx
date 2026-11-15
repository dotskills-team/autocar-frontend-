import Image from "next/image";
import { TyreArt } from "@/components/shared/tyre-art";
import { cn } from "@/lib/utils";

/** TASY photo when available (remote host, so unoptimized), tyre render otherwise. */
export function TyreImage({ src, alt, className, priority }: { src: string | null; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className={cn("relative flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(ellipse_at_50%_40%,#ffffff_0%,#f3f4f6_70%,#e9eaed_100%)] p-4", className)}>
      {src ? <Image src={src} alt={alt} fill unoptimized priority={priority} className="object-contain p-3" /> : <TyreArt />}
    </div>
  );
}
