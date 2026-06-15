import { ImageResponse } from "next/og";
import { brandColors, starDataUri } from "@/lib/brand";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Apple touch icon — the gold sparkle on the deep-navy field. iOS rounds the
// corners itself, so we just centre the mark on a full-bleed background.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: brandColors.ink,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={120} height={120} src={starDataUri(120)} alt="" />
      </div>
    ),
    { ...size }
  );
}
