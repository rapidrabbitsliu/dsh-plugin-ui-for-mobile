# Whale mascot assets

Generated using GPT Image through the configured local codex2api service on 2026-10-29, using the user's supplied blue whale/maid character image as visual reference.

The reference image itself is not included. These are unofficial AI-generated adaptations, not official DeepSeek artwork. The source character's ownership/licensing has not been independently verified. Distribution of these generated adaptations was requested by the user; this does not establish a license to the underlying character. Reusers must assess any third-party rights before redistribution. The repository MIT code license does not assert ownership of the reference character.

- whale-sprites.png: original transparent 2×2 generated sprite sheet.
- whale-idle.png: sleepy idle navigation button.
- whale-happy.png, whale-wave.png, whale-sleep.png: additional expression assets.

- girl-sprites.png: recovered 1536×1024 GPT Image result completed at 16:35:57 (client connection ended earlier, no duplicate generation).
- girl-peek.png, girl-blink.png, girl-wave.png: humanoid maid peeking animation.
- girl-drag1.png through girl-drag3.png: humanoid full-body struggling poses. The generated clothing does not strongly depict a pinched back collar; the UI rotation pivot near the shoulders suggests suspension but this detail remains an artwork limitation.

The small sprites are cropped/downscaled from the GPT Image output using nearest-neighbor resampling; they are not programmatically drawn substitutes. Additional girl-actions.png sheet was generated with GPT Image and recovered from the service after the 10-minute client timeout; no duplicate request was sent. girl-wave1..4.png and girl-pick1..4.png are its cropped frames. The falling 3px speck is a CSS UI effect, not a generated image.

girl-apple.png was successfully generated using GPT Image with girl-peek.png as reference; girl-apple1..8.png are its cropped frames for reveal, inspection, highlight glint, showing off, two bites, and contentment.

apple-expanded.png and pick-expanded.png are newly generated GPT Image 4×4 sheets with sixteen poses each; girl-apple-smooth1..16.png and girl-pick-smooth1..16.png are their aligned cropped frames. The runtime now uses these expanded scenes rather than the old apple/pick poses.

The build embeds the humanoid animation PNGs into client.js as a data URL, requiring no extra asset server or runtime route.
