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
DEST = ROOT / "public" / "images"

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


def stamp(path):
    im = ImageOps.exif_transpose(Image.open(path)).convert("RGBA")
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
        for p in originals:
            out = DEST / p.name
            print(f"  {'ok     ' if out.exists() else 'MISSING'} {p.name}")
        if missing:
            print(f"\n{len(missing)} served image(s) have no original and are "
                  f"therefore unstamped: {', '.join(sorted(missing))}")
            return 1
        print(f"\n{len(originals)} image(s) stamped from originals.")
        return 0

    for p in originals:
        out = DEST / p.name
        stamp(p).save(out, quality=QUALITY, optimize=True, progressive=True)
        print(f"  stamped  {p.name}")

    if missing:
        print(f"\n! unstamped (no original): {', '.join(sorted(missing))}")
        return 1
    print(f"\n{len(originals)} image(s) stamped. Originals untouched in "
          f"{SRC.relative_to(ROOT)}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
