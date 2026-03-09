#!/usr/bin/env python3
"""Generate extension icons at all required sizes."""

from PIL import Image, ImageDraw, ImageFont
import os

SIZES = [16, 32, 48, 128]
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "icons")
os.makedirs(OUT_DIR, exist_ok=True)

def draw_icon(size):
    scale = size / 128
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background: rounded rectangle (YouTube-red inspired, but shifted to a
    # calm productivity blue-violet to differentiate from YouTube itself)
    bg_color = (79, 70, 229)  # indigo-600
    margin = max(1, int(4 * scale))
    radius = max(2, int(24 * scale))
    draw.rounded_rectangle(
        [margin, margin, size - margin - 1, size - margin - 1],
        radius=radius,
        fill=bg_color,
    )

    # Shield / block icon: a simple "eye-slash" concept —
    # draw a white circle (eye) with a diagonal slash
    cx, cy = size // 2, size // 2
    eye_r = max(2, int(30 * scale))
    pupil_r = max(1, int(14 * scale))

    # Eye outline
    draw.ellipse(
        [cx - eye_r, cy - eye_r, cx + eye_r, cy + eye_r],
        outline=(255, 255, 255, 230),
        width=max(1, int(5 * scale)),
    )

    # Pupil
    draw.ellipse(
        [cx - pupil_r, cy - pupil_r, cx + pupil_r, cy + pupil_r],
        fill=(255, 255, 255, 240),
    )

    # Diagonal slash across the eye
    slash_w = max(1, int(5 * scale))
    offset = int(eye_r * 1.15)
    draw.line(
        [cx - offset, cy + offset, cx + offset, cy - offset],
        fill=(255, 255, 255, 255),
        width=slash_w,
    )

    # Red accent slash (thinner, on top)
    accent_w = max(1, int(3 * scale))
    draw.line(
        [cx - offset, cy + offset, cx + offset, cy - offset],
        fill=(239, 68, 68),  # red-500
        width=accent_w,
    )

    return img


for s in SIZES:
    icon = draw_icon(s)
    path = os.path.join(OUT_DIR, f"icon{s}.png")
    icon.save(path, "PNG")
    print(f"  Created {path} ({s}x{s})")

print("Done.")
