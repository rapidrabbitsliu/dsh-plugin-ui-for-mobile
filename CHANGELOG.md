# Changelog

## 0.1.14 — public release

- Rewrite the README with complete Chinese feature/interaction documentation, an aligned English summary, installation examples, verification scope and known limitations.

- Keep sidebar workspace/session action strips visible on mobile, removing the hover-only display changes that can consume a first iOS tap.
- Keep workspace expand chevrons permanently visible instead of swapping folder/chevron on hover.
- Preserve original single-click workspace toggle and session navigation handlers; do not simulate double-clicks or alter session history.
- Disable session-row double-click rename on mobile; row menu actions remain available.
- Touch fixture covers first-tap toggle/open, action menus, and double-click suppression. Actual iOS/Android and bottom session navigation need user confirmation.

## 0.1.13 — public release

Includes the Enter-to-dismiss behavior developed in local preview 0.1.12. The user confirmed the combined mobile behavior works (device/browser unspecified).

- Add a mobile-only ↵ line-break button in the existing conversation.input.right slot.
- Use the host's captureInsertion/insertText/persistDraft API to insert at the caret without sending or replacing the draft.
- Preserve focus on touch and ignore the follow-up pointer click to avoid duplicate line breaks; desktop hides the control.
- Fixture verifies middle-of-draft insertion and focus retention; the user also confirmed the combined behavior on their mobile device.

## 0.1.12 — local preview

- Blur the mobile chat composer after plain Enter consumes/clears the draft, requesting keyboard dismissal without interfering with the host submit handler.
- Keep focus for Shift+Enter, modified/repeated Enter, IME candidate confirmation, completion selection and blocked sends that retain the draft.
- Handle synchronous and asynchronous draft clearing within a bounded 1.5-second window; clean up timers/listeners on disposal.
- Browser fixture covers submission blur and focus-preserving exclusions. Real-device keyboard dismissal remains to be confirmed.

## 0.1.11 — public release

- Set prefixed/unprefixed text-size-adjust to 100% to prevent mobile browser text inflation during orientation changes, without fixing message font sizes or disabling pinch zoom.
- Keep text sizing protection active for coarse-pointer phone landscape windows beyond the narrow-layout breakpoint.
- Observe orientation changes and restore owned markers/listeners on teardown.
- Simulated browser regression covers repeated portrait/landscape transitions with unchanged message nodes; the user confirmed the fix on their mobile device (browser/device model unspecified).

## 0.1.10 — public release

Consolidates local previews 0.1.3–0.1.9: full-width mobile chat, draggable animated mascot navigation, compact header controls, and header overflow corrections. No DSH source modifications.


- Remove the desktop corner's negative right margin on mobile so the right panel button remains fully visible.
- Allow the title/breadcrumb to shrink before fixed-size counters and corner actions.
- Collapse utility containers that only contain the hidden native-app launcher.
- Test long-title header geometry with desktop-like flex rules and negative margins.

## 0.1.9 — local preview

- Hide the native directory/app split launcher and More conversation views picker in the mobile header.
- Keep other header controls and all desktop behavior unchanged.

## 0.1.8 — local preview

- Compact mobile header subagent/background-job counters to icons plus numbers, hiding text and chevrons while preserving accessible labels and running indicators.
- Add outlined triggers with expanded-state border feedback.
- Reduce header right-side gaps and button padding without changing desktop layout or menu content.
- Cover live counter updates, preserved click behavior and compact dimensions in the browser fixture.

## 0.1.7 — local preview

- Replace four-pose mischief and eight-pose apple scenes with sixteen newly generated poses each, including intermediate hand movements.
- Extend mischief to 7.36s and apple to 10.17s, adding inspection, anticipation, chewing and recovery beats.
- Predecode frame images before idle playback to reduce first-use image switching delays.
- Retain interruption, particle cleanup, dragging and reduced-motion behavior.

## 0.1.6 — local preview

- Add an eight-frame apple snack scene: reveal, inspect, highlight glint, show off, two bites and contented smile.
- Include apple scenes in the low-frequency idle action pool, retaining interaction cancellation and reduced-motion behavior.
- Test apple frame order and interruption in the browser fixture.

## 0.1.5 — local preview

- Replace static wave with timed raise, alternating wave and lower frames.
- Add a low-frequency playful nose-pick/flick sequence with a tiny noninteractive pixel particle falling offscreen.
- Interrupt idle actions and remove particles on pointer interaction or teardown; disable them for reduced motion and hidden documents.
- Add deterministic animation timeline tests.

## 0.1.4 — local preview

- Replace animal whale with a humanoid chibi whale-maid girl peeking from the left edge.
- Add occasional idle blink/wave and three-frame full-body drag animation.
- Support pointer dragging with an 8px threshold, click suppression after drag, left-edge snapping and locally persisted vertical position.
- Clamp placement to the visible viewport and respect reduced-motion preferences.
- Add browser regression assertions for dragging, full-body state, snapping and subsequent sidebar activation.

## 0.1.3 — local preview

- Remove the persistent mobile navigation rail; conversation uses full viewport width.
- Add a left-edge pixel whale button that opens the original sidebar through the layout service.
- Hide the whale while the drawer is open and preserve backdrop/Escape close paths.
- Embed the GPT Image-generated idle mascot in the client bundle; keep additional expressions as local assets.
- Artwork redistribution requires confirmation of the reference character's rights before public release.

## 0.1.2

- Make the mobile settings dialog fill the visual viewport, including while the keyboard is open.
- Replace the fixed-width side navigation with horizontally scrollable category buttons.
- Keep the close control in the top-right with a 44px touch target.
- Give settings content its own scroll area and safe-area padding.
- Add simulated mobile settings layout regression checks.

## 0.1.1

First public release as `dsh-plugin-ui-for-mobile`.

- Follow the visual viewport for mobile keyboard layout.
- Reduce focus zoom with 16px input text; retain pinch zoom.
- Contain document horizontal overflow.
- Present the expanded sidebar as an overlay without squeezing the conversation.
- Compact mobile composer statistics and hide verbose Chinese labels visually.
- Clean up plugin-owned styles, markers and event listeners on unload.

The earlier local prototype used `@local/dsh-plugin-ui-for-mobile`; uninstall it before installing this package.

Validation: unit tests and a Chromium simulated-shell fixture. Native mobile keyboard and authenticated full-application automation are not covered by these tests.
