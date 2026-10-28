# Changelog

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
