import { ImageResponse } from "next/og";
import { brandColors, starDataUri } from "@/lib/brand";
import { site } from "@/lib/site";

export const dynamic = "force-static";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The branded share card shown when the site is posted to WhatsApp, iMessage,
// X, LinkedIn, Slack, Facebook, etc. — the gold logo on the navy field.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          backgroundColor: brandColors.ink,
          backgroundImage: `linear-gradient(135deg, ${brandColors.royal} 0%, ${brandColors.navy} 45%, ${brandColors.ink} 100%)`,
        }}
      >
        {/* Thin gold frame */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            right: 40,
            bottom: 40,
            border: `1px solid ${brandColors.gold}59`,
            borderRadius: 10,
            display: "flex",
          }}
        />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img width={92} height={92} src={starDataUri(92)} alt="" />

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 30,
            letterSpacing: 12,
            color: brandColors.gold,
          }}
        >
          {site.tagline.toUpperCase()}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 168,
            letterSpacing: 22,
            fontWeight: 600,
            color: brandColors.goldLite,
          }}
        >
          CETUS
        </div>

        <div
          style={{
            display: "flex",
            width: 150,
            height: 1,
            marginTop: 18,
            backgroundColor: `${brandColors.gold}99`,
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 38,
            color: brandColors.beige,
          }}
        >
          Spaces designed to be lived in.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 70,
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            color: brandColors.beigeDim,
          }}
        >
          {site.url.replace(/^https?:\/\//, "")}
        </div>
      </div>
    ),
    { ...size }
  );
}
