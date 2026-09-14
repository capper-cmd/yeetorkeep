#!/usr/bin/env python3
"""
Stamp a tiled copyright watermark into every image the site serves.

Reads pristine files from assets/originals/ and writes stamped copies to
public/images/. Always works from the originals, so re-running never
double-stamps — change the settings below and run it again.

    python3 scripts/watermark.py            # stamp everything
    python3 scripts/watermark.py --check    # report what's stamped, write nothing

assets/ is in .vercelignore, so the pristine originals are never deployed.
That's the point: a watermark only protects anything if the clean file
isn't sitting one URL away on the same host.
"""
import argparse
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "originals"

# Each variant is (destination, max long edge in px). None keeps the
# original dimensions. Downscaling is the real protection — the watermark
# only deters, but a 900px file simply isn't enough pixels to reproduce a
# 16x20 painting at any size worth having.
VARIANTS = [
    (ROOT / "public" / "images", None),
    (ROOT / "public" / "images" / "lowres", 900),
]
DEST = VARIANTS[0][0]

# A few images are displayed far larger than the rest, so the shared cap
# would upscale them — soft, and the watermark grows with the upscale.
# These are room photos rather than artwork, so the protection lost by
# giving them more pixels costs little. Keyed by filename; the value
# replaces the variant's cap only when it is larger.
DISPLAY_OVERRIDES = {
    # spans half the viewport in the Collector's Wall split
    "installed-wall.jpg": 1800,
}

TEXT = "© ERIC SAMUEL TIMM"
ANGLE = 30           # degrees, bottom-left to top-right
OPACITY = 26         # 0-255. ~10% — readable up close, recedes at a glance.
FONT_RATIO = 0.030   # cap height as a fraction of the image's long edge
GAP_X = 2.15         # tile spacing, in multiples of the text's own size
GAP_Y = 5.0
FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
QUALITY = 88


def load_font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except OSError:
        print(f"  ! {FONT_PATH} missing, falling back to a bitmap font", file=sys.stderr)
        return ImageFont.load_default()


def build_tile(size, font):
    """One diagonal band of repeated text, large enough to cover the image
    once rotated (hence the sqrt(2) padding)."""
    w, h = size
    pad = int(math.hypot(w, h)) + 1
    layer = Image.new("RGBA", (pad, pad), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    l, t, r, b = draw.textbbox((0, 0), TEXT, font=font)
    tw, th = r - l, b - t
    step_x = int(tw * GAP_X)
    step_y = int(th * GAP_Y)

    for row, y in enumerate(range(0, pad, step_y)):
        # offset every other row so the marks don't line up in columns
        offset = (row % 2) * step_x // 2
        for x in range(-step_x, pad, step_x):
            # a dark pass under a light one keeps it legible over both
            # pale mat board and near-black backgrounds
            draw.text((x + offset + 1, y + 1), TEXT, font=font,
                      fill=(0, 0, 0, OPACITY // 2))
            draw.text((x + offset, y), TEXT, font=font,
                      fill=(255, 255, 255, OPACITY))

    layer = layer.rotate(ANGLE, resample=Image.BICUBIC)
    left = (pad - w) // 2
    top = (pad - h) // 2
    return layer.crop((left, top, left + w, top + h))


def stamp(path, max_edge=None):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
    if max_edge and max(im.size) > max_edge:
        im.thumbnail((max_edge, max_edge), Image.LANCZOS)
    # FONT_RATIO is a fraction of the long edge, so the mark stays the same
    # relative size however far the image has been scaled down.
    font = load_font(max(11, int(max(im.size) * FONT_RATIO)))
    im = Image.alpha_composite(im, build_tile(im.size, font))
    return im.convert("RGB")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", action="store_true",
                    help="report coverage without writing")
    args = ap.parse_args()

    if not SRC.is_dir():
        sys.exit(f"missing {SRC.relative_to(ROOT)} — the pristine originals live there")

    originals = sorted(SRC.glob("*.jpg"))
    if not originals:
        sys.exit(f"no .jpg files in {SRC.relative_to(ROOT)}")

    served = {p.name for p in DEST.glob("*.jpg")}
    missing = served - {p.name for p in originals}

    if args.check:
        gaps = 0
        for dest, max_edge in VARIANTS:
            label = dest.relative_to(ROOT)
            absent = [p.name for p in originals if not (dest / p.name).exists()]
            cap = f"<= {max_edge}px" if max_edge else "full size"
            print(f"  {len(originals) - len(absent):>2}/{len(originals)} {label} ({cap})")
            for n in absent:
                print(f"       MISSING {n}")
                gaps += 1
        if missing:
            print(f"\n{len(missing)} served image(s) have no original and are "
                  f"therefore unstamped: {', '.join(sorted(missing))}")
            gaps += len(missing)
        if gaps:
            return 1
        print(f"\n{len(originals)} image(s) stamped in each of "
              f"{len(VARIANTS)} variants.")
        return 0

    for dest, max_edge in VARIANTS:
        dest.mkdir(parents=True, exist_ok=True)
        for p in originals:
            cap = max_edge
            override = DISPLAY_OVERRIDES.get(p.name)
            if cap and override and override > cap:
                cap = override
            stamp(p, cap).save(dest / p.name, quality=QUALITY,
                               optimize=True, progressive=True)
        cap = f"<= {max_edge}px" if max_edge else "full size"
        print(f"  stamped  {len(originals):>2} -> {dest.relative_to(ROOT)} ({cap})")

    if missing:
        print(f"\n! unstamped (no original): {', '.join(sorted(missing))}")
        return 1
    print(f"\nOriginals untouched in {SRC.relative_to(ROOT)}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
