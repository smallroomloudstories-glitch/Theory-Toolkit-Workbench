# Theory Toolkit — Evolving Design Notes

> **Status:** Working ideas, not requirements carved in stone.
>
> This document records design ideas and principles that come up during development so they are not lost. Any item here may be changed, discarded, or revisited when implementation begins or testing suggests a better answer.

## Environment and promotion workflow

Theory Toolkit uses three distinct stages:

- **Workbench** — internal development between Rob and ChatGPT. Experimental, incomplete, or broken work belongs here. The Workbench URL is not distributed to outside testers.
- **External Test** — approved Workbench features are deliberately promoted to the testing pages in the main `Theory-Toolkit` repository for outside testing.
- **Live** — after testing, approved features may later be promoted to the public Theory Toolkit reached through smallroomloudstories.com.

The Workbench is the authoritative home of this design-notes document (THE BOOK™). Development documentation does not need to be promoted with product code.

## Tooling workflow — transient GitHub write blocks

When an otherwise legitimate GitHub write is blocked with the specific OpenAI message that it "couldn't determine the safety status of the request," treat the first failure as potentially transient.

- Wait briefly, re-fetch the current file/SHA as appropriate, and retry the same intended legitimate write once without waiting for Rob to request a retry.
- If the second attempt succeeds, continue normally.
- If the second attempt fails with the same indeterminate-safety message, report it and use a manual fallback if needed rather than repeatedly hammering the connector.
- If the denial is materially different (authentication, permission, conflict, repository error, or an actual safety determination), stop and report that immediately instead of treating it as the transient glitch.
- Do not alter, disguise, fragment, or otherwise manipulate legitimate code merely to bypass a safety check. This is a retry policy, not a bypass policy.

## Near-term student-ready roadmap

The immediate development priority is to make Theory Toolkit useful for real beginner guitar lessons expected to begin within roughly three weeks. Capability comes before final navigation/presentation polish.

### 1. Shared fretboard Focus capability

Build individual-position focus into the shared fretboard presentation rather than implementing separate click behavior inside individual Explorers.

- A fretboard position can be clicked to focus/highlight that exact position.
- Clicking the focused position again removes its focus.
- Provide a way to clear all manually focused positions.
- Manual Focus must remain distinct from the musical/theoretical highlighting supplied by the current Explorer; it should draw attention to a position without replacing information such as selected pitch, root, third, fifth, scale membership, or other musical meaning.
- First implement and test this capability in Fretboard Explorer.
- Likely teaching uses include pointing to individual fret landmarks, demonstrating octave relationships, and drawing attention to arbitrary positions that arise during a lesson.

### 2. Enable shared Focus in Scale Explorer

Once the shared interaction feels right in Fretboard Explorer, enable the same capability in Scale Explorer with no separate implementation.

- Verify that manual Focus coexists cleanly with scale highlighting and interval/degree labels.
- Preserve the ability to teach near-term concepts hidden inside Scale Explorer, especially root and the 1–3–5 relationship, even before a student formally begins studying scales.
- This step also serves as proof that Focus is genuinely a reusable fretboard capability rather than Fretboard Explorer-specific behavior.

### 3. Beginner-useful Chord Shape Explorer

Bring Chord Shape Explorer to a simple but genuinely useful teaching state soon after shared Focus is proven.

- At minimum, allow selection of a chord and display its shape.
- Use the shared fretboard presentation and shared Focus behavior.
- Support discussing individual chord tones when useful, including roots, thirds, fifths, and duplicated chord tones within a voicing.
- Favor immediate usefulness in beginner lessons over completeness; additional sophistication can follow actual teaching needs.

### Later presentation/UI direction

Do not solve the broader navigation/presentation architecture yet. One promising later idea is to keep a fretboard visible and provide tabs across the top for selecting the musical principle/view being explored. Revisit that after the shared fretboard capability, Scale integration, and beginner Chord Shape Explorer are working. Build teaching capabilities first; design the elegant container around proven capabilities afterward.

## Session close — 2026-08-14: live testing, Focus, and STUDio fretboard

### Repository and promotion state

- The forward-facing `Theory-Toolkit` repository was cleaned up after promotion. Its active branch is `main`; the former workbench is preserved as `archive/Legacy-workbench`. Obsolete `develop`, `release-builds`, and `tester-builds` branches were removed.
- GitHub Pages for the forward-facing repository builds from `main`.
- Fretboard Explorer and Scale Explorer were promoted for external testing. A missing shared `src/engine/fretboard-focus.js` dependency was repaired after the initial promotion.
- New development remains exclusively in `Theory-Toolkit-Workbench` until explicitly approved for promotion.

### Shared Focus behavior accepted

- Focus remembers exact physical positions (string plus fret), independent of the currently displayed scale or selected-note filter.
- Focus selected in one major/minor view remains visible when that position is meaningful in the other view, including positions added after switching views.
- Fretboard Explorer string scope deliberately differs: moving from all strings to selected strings may hide out-of-scope Focus while retaining it in memory.
- In “Filter selected notes,” a focused position that is not part of the filter may disappear; “Show all notes + highlight selections” remains the teaching view for seeing Focus alongside selected notes.
- Clicking the visible string label area selects string scope; the full fret-position hit area remains interactive.

### Explorer layout accepted for external testing

- The fretboard is the primary work surface and appears above controls in both current Explorers.
- Fretboard Explorer controls use a compact grid instead of full-width stacked selectors.
- The current external-test builds were judged stable enough for human testing; later discoveries remain normal tester feedback rather than reasons to delay indefinitely.

### Shared illustrated fretboard direction

- All present and future fretboard-based Explorers should consume one shared presentation/geometry layer rather than maintain independent fretboard layouts.
- The master asset is `Signed Monochrome Yamaha Acoustic Guitar.png`. Preserve the complete illustration for a future welcome page.
- Explorer presentation uses a cropped/zoomed underlay showing only part of the headstock, the neck, and optional upper-bout detail. The image is decorative; interaction remains in an HTML layer above it.
- Initial orientation is for a right-handed player. A future left-handed option requires correct string order, note positions, labels, and artwork orientation; it is not a simple 180-degree flip.
- Mobile-phone optimization is not a goal. Preserve a useful laptop/desktop work surface and allow narrow displays to scroll.
- The illustrated Workbench view is standardized at fret 15. This still shows the chromatic sequence repeating beyond the octave at fret 12.
- Fret spacing and string paths are calibrated to the illustration rather than assuming a perfect mathematical instrument. The accepted checkpoint uses measured fret boundaries and separately interpolated outside-string paths.
- Fretboard Explorer alignment checkpoint 5 was declared “good enough.” The guitar image is now locked; future work should not move, crop, or zoom it without a new explicit decision.

### Next presentation checkpoint before external promotion

Remove the temporary alignment scaffolding from Fretboard Explorer:

- Hide fret-cell grid lines and translucent cell backgrounds.
- Keep the fret-number row separated above the neck, without box scaffolding.
- Display notes directly on the illustrated strings.
- Render manually focused notes as circles centered on the string.
- Preserve the entire invisible fret cell as the click/touch target; only the visible Focus treatment becomes circular.
- Keep string-selection controls visibly identifiable as controls.
- Complete and approve this presentation pass in Fretboard Explorer before applying the shared treatment to Scale Explorer or promoting the illustrated fretboard to external testing.

### Next build priority

After the illustrated fretboard presentation checkpoint is accepted, return to the beginner-useful Chord Explorer. It remains the next major teaching capability and should consume the shared fretboard geometry, Focus behavior, and presentation rather than creating another fretboard implementation.

