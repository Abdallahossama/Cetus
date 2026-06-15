// Shared brand tokens + the Cetus "sparkle" star mark, used by the generated
// icons and social share images. Kept framework-agnostic (plain strings) so it
// can be imported by the build-time ImageResponse routes.

export const brandColors = {
  ink: "#0a1124",
  navy: "#16233f",
  royal: "#243a6b",
  gold: "#c6a75e",
  goldLite: "#e6c77e",
  goldDeep: "#9c7c3c",
  beige: "#e8dcc8",
  beigeDim: "#b9b19e",
} as const;

/** The four-point gold sparkle — the studio's star motif (Cetus is a constellation). */
function starSvg(size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${size}" height="${size}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${brandColors.goldDeep}"/><stop offset="0.5" stop-color="${brandColors.goldLite}"/><stop offset="1" stop-color="${brandColors.gold}"/></linearGradient></defs><path fill="url(#g)" d="M256 86C272 214 298 240 426 256 298 272 272 298 256 426 240 298 214 272 86 256 214 240 240 214 256 86Z"/></svg>`;
}

/** The sparkle as a data URI — embeddable in an <img> inside ImageResponse. */
export function starDataUri(size = 512): string {
  return `data:image/svg+xml,${encodeURIComponent(starSvg(size))}`;
}
