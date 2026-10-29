# v0.1.10 — Full-width mobile chat and animated navigation

This release consolidates local previews 0.1.3–0.1.9. Independent plugin: no DSH core/source modifications, no second React root, no runtime npm dependencies.

## Highlights

- Remove the permanent 56px mobile sidebar rail; the conversation uses the full viewport width.
- Add a pixel chibi whale-maid sidebar launcher: tap to open navigation, drag to reposition, release to snap left. Vertical position is stored locally.
- Occasional wave, playful idle and apple-snack animations; expanded scenes use sixteen poses each. Respects reduced-motion preferences and cancels idle effects on interaction.
- Compact subagent/background-job header entries to outlined icons plus numbers, preserving accessible labels and running indicators.
- Hide the native-app directory launcher and More conversation views picker on mobile.
- Fix long-title header shrink behavior, hidden utility spacing and the far-right button's negative margin.
- Preserve previous keyboard/visualViewport, compact statistics, overlay drawer and mobile settings improvements.

## Install / upgrade

```sh
dsh plugin --profile web add dsh-plugin-ui-for-mobile@0.1.10
```

Or download the attached archive:

```sh
dsh plugin --profile web add ./dsh-plugin-ui-for-mobile-0.1.10.tgz
```

Use the profile running your DSH Web instance. Refresh the authenticated page; restart the original `dsh web` instance if necessary. Remove the old `@local/dsh-plugin-ui-for-mobile` prototype first if present.

## Compatibility and verification

- Mobile browser widths ≤767 CSS px; native desktop shells are excluded.
- Statically checked against DSH 0.2.1-rc.3. DOM compatibility adapter, not a stable cross-version API.
- Eight Node unit tests; simulated Chrome browser regression covers full-width chat, drawer interactions, drag/snap, idle timelines/particle cleanup, reduced motion, mobile settings and header containment.
- Installed in the local web profile; user feedback guided mobile iteration. Independent authenticated-page automation and a full iOS/Android device matrix remain unverified.
- The model/add-menu automatic keyboard-focus issue is not fixed by this release.

## Artwork

Mascot sprites are unofficial GPT Image-generated adaptations based on a user-provided reference. The original reference is not distributed. The code's MIT license does not assert ownership of the underlying character; third-party character rights have not been independently verified. See assets/README.md for provenance and limitations. The back-collar suspension detail in drag artwork is approximate.
