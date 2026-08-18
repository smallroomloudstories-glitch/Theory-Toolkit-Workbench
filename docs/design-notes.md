# Theory Toolkit — Evolving Design Notes

> **Status:** Working ideas, not requirements carved in stone.
>
> This document records design ideas and principles that come up during development so they are not lost. Any item here may be changed, discarded, or revisited when implementation begins or testing suggests a better answer.

## Environment and promotion workflow

Theory Toolkit uses one development environment and one forward-facing code line:

- **Workbench** — internal development between Rob and ChatGPT. Experimental, incomplete, or broken work belongs here. The Workbench URL is not distributed to outside testers.
- **Forward-facing `Theory-Toolkit/main`** — approved Workbench features are deliberately promoted here. The same tested code serves as the external live-test environment now and will become the live public site when it is linked or published from smallroomloudstories.com. There is no separate live-code branch or second product promotion.

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

### Illustrated presentation checkpoint completed

The scaffold-free illustrated presentation was completed and approved in the Workbench on 2026-08-15:

- Fret-cell grid lines and translucent cell backgrounds are hidden.
- Fret numbers and Open are displayed below the neck without box scaffolding; Show All remains above the string selectors.
- Notes are drawn directly over the illustrated strings with calibrated narrow-fret corrections.
- Selected notes and manually focused notes use circular markers centered around their visible labels.
- The complete invisible fret cell remains the click/touch target even though the visible treatment is compact.
- Compact string controls remain visibly identifiable and retain remembered string-scope behavior.
- Fret 15 remains part of the shared geometry and hit-area model, but its note labels are suppressed because they are clipped at the edge of the illustration.
- The complete treatment was approved first in Fretboard Explorer and then ported to Scale Explorer without changing Scale Explorer's scale, position, interval, or Focus logic.

### Next build priority

After the illustrated fretboard presentation checkpoint is accepted, return to the beginner-useful Chord Explorer. It remains the next major teaching capability and should consume the shared fretboard geometry, Focus behavior, and presentation rather than creating another fretboard implementation.

## Session close — 2026-08-15: approved fretboard presentation and Scale Explorer port

### Fretboard Explorer presentation accepted

- The locked STUDio guitar crop, zoom, vertical placement, calibrated fret boundaries, and tapered string paths were preserved.
- Notes use a common left-aligned label area within each physical fret position. Main note letters are larger than accidentals; sharp and flat characters are deliberately smaller.
- Selected notes use white circular markers. Manual Focus uses yellow circular markers with a dark border. The whole invisible fret area remains clickable.
- String selector boxes were reduced and placed immediately left of the nut without overlapping the open-string hit area. Unselected string labels use white lettering with a dark outline; selected/all-string behavior remains unchanged.
- Show All sits above the individual string selectors. Open and fret numbers sit below the neck.
- Presentation-specific note offsets are applied at frets 12 and 14. Do not change the shared guitar image or calibrated geometry to replace these small overlay corrections.
- Hover tooltips identify string, fret/open position, and displayed pitch.

### Enharmonic display behavior

- Sharps are the default display; flats are opt-in through a compact `#` / `b` toggle.
- The toggle respells the five shared pitch classes: C# / Db, D# / Eb, F# / Gb, G# / Ab, and A# / Bb. Natural notes are unchanged.
- Enharmonic switching is display-only. Canonical pitch-class values remain sharp-based internally so selections, Focus, tuning, scale logic, and physical positions survive a spelling change.
- Key-aware theoretical spellings such as B#, Cb, E#, and Fb are outside this simple global display preference and remain future scale/chord-spelling work.

### Scale Explorer presentation port accepted

- Scale Explorer now consumes the approved illustrated surface, string selectors, Focus markers, fret-number placement, note typography, sharp/flat display behavior, and narrow-fret corrections.
- Existing Major/Minor, Diatonic/Pentatonic/Blues, whole-fretboard/position, five-shape, and note/interval behavior was preserved and browser-tested.
- Root, third, fifth, and blue-note meanings retain their established colors but now use circular markers instead of whole-cell fills.
- Focus remains tied to exact physical positions while musical views change. String scope may hide out-of-scope Focus while retaining it in memory, matching the accepted shared behavior.

### Chromatic key wheel accepted

- Scale Explorer's Root / Key control is a compact custom wheel backed by the existing canonical selector.
- Clicking the selector opens seven chromatic notes: the current center note, three above, and three below.
- The wheel is geometrically centered over the closed selector, allowing the pointer to remain stationary while scrolling and then click the note currently beneath it.
- Notes advance in chromatic order and wrap indefinitely in either direction.
- Mouse-wheel and two-finger touchpad scrolling are supported. The accepted limiter is 25 milliseconds per one-semitone movement: intentionally responsive, while still preventing completely uncontrolled acceleration. Different input devices will feel somewhat different.
- Clicking a visible note commits it and closes the wheel. Arrow keys navigate; Enter commits; Escape closes.
- The sharp/flat preference respells the wheel without changing its canonical order or selected pitch class.

### Promotion state and next work

- Fretboard Explorer and Scale Explorer are considered presentation-complete enough for testing. Further visual changes should be driven by real tester feedback rather than attempts at abstract perfection.
- The next major build priority remains the beginner-useful Chord Explorer. It should reuse this shared illustrated fretboard, geometry, string scope, Focus behavior, note-marker language, and enharmonic display model.

## Promotion checkpoint — 2026-08-16

- The approved Fretboard Explorer and Scale Explorer were promoted from `Theory-Toolkit-Workbench/main` to the forward-facing `Theory-Toolkit/main` in commit `1d6262cd51f68bcf032d1024beee87b72e8dde35`.
- Existing tester URLs and the tester-feedback system were preserved. The promoted pages are `tests/fretboard-selection-test.html` and `tests/scale-explorer-test.html`, with `tests/index.html` as their landing page.
- The shared illustrated presentation files and STUDio guitar asset were added to the forward-facing repository. The existing music-data and fretboard engines remained in place because they were functionally compatible.
- Browser verification confirmed that both deployed Explorers load with populated controls, illustrated fretboards, interactive note selection and Focus, string scope, enharmonic display, and feedback access. Scale Explorer also retains its chromatic key wheel and scale controls.
- `Theory-Toolkit/main` is now both the live-test code line and the eventual live-site code line. Going live through smallroomloudstories.com will expose this tested artifact rather than create another code fork.
- The next development session begins the Chord Shape Explorer in the Workbench only.


## Session close — 2026-08-18: Chord Shape Explorer, Key Explorer, and broader public testing

### Chord Shape Explorer completed and promoted

- Chord Shape Explorer was built in the Workbench on the approved shared illustrated fretboard and then promoted to the forward-facing test repository.
- The initial programmed open-chord library contains A, Am, Asus2, C, D, Dm, E, Em, Easy F, and G. The selector groups related chord families and opens with no chord selected.
- The chord panel shows chord tones in root, third, fifth order. Notes and fingering labels are alternate views of the same shape.
- Default beginner fingerings match Rob's intended teaching sequence. Fingering assignments can be changed during a demonstration without changing the underlying note positions; those temporary edits need not persist when switching views.
- Programmed chord positions support a three-state teaching cycle: visible, Focus, and hidden. Clear Focus removes Focus only and does not reset the chord presentation.
- Nut positions support normal/open, Focus, and muted states. Muting is shown with a red X and may be applied to any string.
- Nut interaction was extended beyond programmed chord shapes. With no chord selected, every open-string position can still cycle through normal, Focus, and muted. This makes the Explorer useful for manually constructing and demonstrating unprogrammed chords and voicings anywhere on the fretboard.
- The no-chord nut behavior was fixed in both Workbench and the forward-facing test build. Rob verified its usefulness by quickly mapping a B diminished chord and exploring it across the fretboard.

### Key Explorer completed and promoted

- Key Explorer was translated from the original Theory Toolkit spreadsheet into a compact browser Explorer.
- C major and its I chord are the default presentation so the page opens with meaningful information rather than blank placeholders.
- The chromatic key wheel uses the accepted centered, indefinitely wrapping wheel interaction and 25 millisecond input limiter.
- Key spelling follows key-signature and Circle of Fifths conventions rather than a global sharp/flat preference. This includes theoretical spellings such as E# in F# major when required to preserve one letter name per scale degree.
- Each major key displays its seven scale degrees, diatonic triads, chord qualities, chord tones, harmonic role descriptions, alternate functional names, and common next-chord destinations.
- Selecting a diatonic chord highlights its root, third, and fifth within the scale. Detail and selected-tone regions retain their physical space when cleared so the page does not jump.
- A single quiet invitation links to Chord Shape Explorer. Individual chord cards do not attempt to duplicate Chord Shape Explorer's fingering presentation.
- The general philosophy box ending with “Learn the common patterns first” was removed from both versions. That material belongs more naturally in the future Progression Explorer.
- Key Explorer was promoted to the forward-facing repository, added to Current Builds as a New Feature, connected to the feedback system, and dated August 18, 2026.

### Feedback delivery

- The browser feedback form submits through the Cloudflare Worker to the private Theory Toolkit Feedback repository.
- The Worker also sends a notification through Resend to the Small Room, Loud Stories email account. The Resend API key remains a Cloudflare secret and must never be committed to either repository.
- End-to-end submission and email delivery were verified.
- Gmail routes these notifications directly into a Feedback label without producing a loud phone notification. GitHub issues remain the durable feedback record.

### Broader tester outreach

- The forward-facing GitHub Pages build is ready for a broader public-beta testing audience.
- A call for testers was prepared and posted to the Zombie Guitar community. It asks for general functional and presentation feedback, with particular attention to additions that would improve Key Explorer while keeping it focused on keys.
- The message credits Brian Kelly's Zombie Guitar lessons as the foundation of much of Rob's theory knowledge while stating explicitly that Theory Toolkit is Rob's independent project. Brian and Zombie Guitar are not involved in its development or responsible for its content; any errors come from Rob's interpretation, not Brian's teaching.
- The message also establishes that Theory Toolkit is a free visual supplement to instruction. It is not intended to replace an instructor or teach music theory independently.
- Additional music communities may be invited after the initial broader response. The current approved public test remains hosted through GitHub until the permanent domain arrangement is implemented.

### Eventual smallroomloudstories.com publication

- Permanent publication is tabled until after broader testing. No repository or DNS changes are required now.
- The preferred direction is a unified address such as smallroomloudstories.com/theory-toolkit/.
- Theory Toolkit should remain in its own authoritative repository. A future GitHub Actions deployment can assemble the approved Toolkit into a theory-toolkit path inside the published SRLS website without maintaining a second manual copy or creating another testing environment.
- A simpler alternative remains theory.smallroomloudstories.com, configured as a custom subdomain for the Theory Toolkit GitHub Pages repository.
- Cloudflare proxying is possible but not preferred because it adds rewriting, caching, and asset-path complexity.
- Namecheap is the domain registrar. This does not change the architecture. Before any DNS-dependent option is implemented, verify which provider's nameservers are authoritative. The path-based GitHub Actions option does not require a DNS change.

### Future Explorer boundaries

- Modes Explorer remains a separate future tool rather than being folded into Key Explorer.
- Progression Explorer should eventually cover common Western progressions, chord movement, modulation between keys, useful out-of-key connecting chords, borrowed harmony, and modal interchange. It may begin simply and expand with input from testers who have deeper harmonic experience.
- Triad Groups Explorer is now a formal future candidate. It should show the same triad across the fretboard and across different three-string groups, inversions, root/third/fifth locations, natural movement between nearby triads, connections to familiar chord shapes, voice leading, and the development of musically appropriate double stops for improvising over chord changes.
- The intended conceptual path is Key Explorer to Triad Groups Explorer to Progression Explorer: identify the harmony, locate and manipulate it on the neck, then understand how it moves.
- Chord Shape Explorer remains distinct. It answers how a chord or voicing can be played and illustrated; Triad Groups Explorer will answer how harmony is distributed across the neck and used melodically.

### Current state

- Fretboard Explorer, Chord Shape Explorer, Scale Explorer, and Key Explorer are all available in the forward-facing GitHub Pages test environment.
- The current goal is to gather real human feedback rather than add speculative polish.
- The project remains intended as a free-to-use teaching supplement that can eventually reach a wider community.
