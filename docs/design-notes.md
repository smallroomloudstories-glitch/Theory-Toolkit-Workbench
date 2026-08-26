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


## Future design brief: Progression Explorer

### Purpose and instructional level

- Progression Explorer is a later-stage theory tool for students who already have introductory familiarity with chords, the fretboard, scales, and keys under an instructor's guidance.
- It is primarily about harmonic relationships rather than guitar fingering. A guitar may be useful while exploring, but the Explorer does not require the illustrated fretboard.
- Do not add a dedicated “view this in Chord Shape Explorer” invitation merely because chords are present. Normal site navigation is sufficient. By this point, the student should already know where to return for chord-shape or fingering help.
- Progression Explorer should not become a complete independent harmony course. It should identify relationships, provide concise language for discussing them, and direct the student's attention toward what can be heard. The instructor determines the depth, exceptions, and lesson sequence.
- The Explorer should provide enough interpretation to be useful rather than presenting unexplained chord data. Appropriate prompts include “Why it works,” “Listen for,” and “Try changing.”

### Key-relative chord presentation

- Use the established centered key-wheel interaction for selecting a key.
- Display the seven diatonic chords of the selected key as a compact reference, labeled I, ii, iii, IV, V, vi, and vii°.
- Show chord names and qualities, but do not identify or display the component root, third, and fifth notes in this reference. Key Explorer and Chord Shape Explorer already serve those purposes.
- Example in C major: I C, ii Dm, iii Em, IV F, V G, vi Am, vii° Bdim.
- Begin with major-key harmony unless a later design decision deliberately adds minor-key progression behavior.

### Common Progressions list

- Store each progression as an abstract Roman-numeral sequence rather than hard-coded chord names.
- Beside every Common Progressions entry, translate the progression into chord names from the currently selected key.
- Example entries in C major:
  - I–IV–V–I becomes C–F–G–C.
  - I–V–vi–IV becomes C–G–Am–F.
  - ii–V–I becomes Dm–G–C.
  - vi–IV–I–V becomes Am–F–C–G.
- Changing the selected key updates the chord names everywhere while preserving the selected progression and its Roman-numeral identity.
- Each progression entry is selectable. Selecting it opens a stable detail area without causing distracting page jumps.

### Selected-progression details

The detail presentation may include:

- The Roman-numeral pattern.
- The translated chords in the currently selected key.
- A short “Why it works” explanation.
- A “Listen for” prompt describing tension, release, expectation, delayed resolution, looping behavior, or another clearly audible relationship.
- A limited “Try changing” suggestion, such as reversing two chords or testing a common substitution.
- Common variations or substitutions when they belong at the current instructional level.
- Example songs and authorized listening links when available.

Keep each explanation concise. For example, an I–V–vi–IV description may identify I as home, V as creating tension, vi as delaying the expected return while sharing notes with I, and IV as creating a stable path back to the beginning. Deeper topics such as detailed voice leading, harmonic rhythm, melody interaction, inversions, cadential classification, borrowed harmony, and exceptions can be introduced selectively or reserved for later expansion and instructor discussion.

### Song examples and listening links

- A “Songs that use it” or “Hear it in context” section should connect abstract progressions to recognizable music.
- Each example should identify the song, artist, relevant section such as verse or chorus, the progression used there, and the recording's actual key when known.
- Song examples remain attached to the abstract progression, not to the currently selected display key. If the Explorer is showing C major but the recording is in E major, state that explicitly. This reinforces transposition.
- Do not imply that an entire song uses one repeating progression when the example applies only to a specific section or uses a variation.
- Link priority:
  1. Official artist or label YouTube video.
  2. Official audio uploaded by the artist or label.
  3. Another legitimate free listening service.
  4. Unlinked song and artist identification when no suitable authorized free source is available.
- Link outward rather than hosting or reproducing copyrighted audio.
- These are educational references, not affiliate links. Do not use referral identifiers or accept compensation without explicit disclosure.
- External links should be reviewed periodically because videos and streaming addresses can disappear or change.

### Later harmonic expansion

- Progression Explorer may eventually grow from common diatonic patterns into secondary dominants, useful out-of-key connecting chords, borrowed chords, modal interchange, modulation between keys, and other practical harmonic movement.
- Begin simply. More advanced features should be added in response to real teaching needs and informed tester input rather than attempting to encode all of harmony in the first build.
- The larger learning path remains: Fretboard Explorer to Chord Shape Explorer to Scale Explorer to Key Explorer, followed by Progression Explorer. Triad Groups Explorer may provide an additional bridge between key knowledge, fretboard harmony, and progression movement.

## Progression Explorer Build 1: session close, 2026-08-19

### Implemented in Workbench

- Added `progression-explorer.html` and linked it from the Workbench landing page.
- Build 1 remains strictly within the seven diatonic chords of a selected major key.
- C major is the default. The Explorer reuses the established centered key wheel with indefinite chromatic scrolling and a 25 ms limiter.
- The page displays I, ii, iii, IV, V, vi, and vii° with their translated chord names and qualities.
- Six starting progression entries are included:
  - I - IV - V
  - I - V - vi - IV
  - vi - IV - I - V
  - I - vi - IV - V
  - ii - V - I
  - I - IV - vi - V
- Selecting a progression highlights its participating diatonic chords and fills a stable detail area with the Roman-numeral pattern, translated chords, a concise explanation, and a common variation.
- A Clear Progression control returns the page to its neutral state.
- No fretboard, chord-tone breakdown, borrowed harmony, modulation, or other advanced material is included in Build 1.
- The page is not yet promoted to the live test repository.

### Restored learning guidance

The original spreadsheet guidance now appears above the progression choices:

> Learn the common patterns first. Once you understand why they work, you'll know which ones to keep, which ones to bend, and which ones to ignore.
>
> Music theory isn't a rulebook; it's a field guide. It helps you recognize the paths others have taken, understand why they work, and choose whether to follow them or head off in your own direction.

### Three-chord family decision

- I - IV - V and I - V - IV should be treated as one foundational three-chord family rather than separate progression entries.
- Their song examples will be divided into clearly labeled I - IV - V and I - V - IV groups.
- The explanation should distinguish their motion: I - IV - V builds toward dominant tension and an expected return to I, while I - V - IV reaches the dominant earlier and relaxes toward IV.
- Reordered four-chord loops remain separate entries when their starting point and order create a distinctly different flavor, especially I - V - vi - IV versus vi - IV - I - V.

### Song-example plan before promotion

- Adding verified song examples and authorized listening links is the largest remaining requirement before live-test promotion.
- Aim for two or three strong examples per progression at minimum, with additional examples for the combined three-chord family.
- Seek examples across divergent genres such as rock, folk, country, bluegrass, pop, blues, and related traditions so no progression is accidentally presented as genre-specific.
- Balance genre coverage across the Explorer rather than forcing a weak example into every genre slot.
- Each example should include:
  - Song and artist.
  - Recording key.
  - Roman-numeral progression and actual chords.
  - The section where it occurs, such as verse or chorus.
  - A concise note explaining where the progression changes elsewhere in the song.
  - An official artist or label link when available, followed by other legitimate free listening sources when necessary.
  - Capo, alternate tuning, transposition, or close-variation notes when relevant.
- Label exact uses, section-only uses, close variations, and brief departures honestly.
- Progressions are part of a song's harmonic foundation, not its genre identity. Rhythm, melody, phrasing, arrangement, and performance distinguish songs that share the same chord movement.
- Research and verify each example individually rather than relying on unsourced progression lists.

### Featured medley demonstration

- Add a small featured explanation linked to an authorized four-chord pop-song medley, likely the Axis of Awesome-style demonstration after the best official source is verified.
- Explain that the medley works because the songs are transposed into a common key and share a compatible repeating chord framework.
- Clarify that the original recordings may use different keys, may use the progression only in one section, and may reorder, shorten, or slightly alter it.
- Use the demonstration to reinforce why the Toolkit presents progressions with Roman numerals: the relationship survives transposition.
- Do not imply that songs sharing a progression are musically identical.

### Next session

- Begin identifying and verifying song examples for the six Build 1 progression families.
- Prefer official artist or label YouTube videos, then official audio, then another legitimate free listening service.
- Confirm the recorded key, exact progression, relevant song section, and any departures before adding an example to the Explorer.



## Session close — 2026-08-26: outside feedback, CAVARTS demonstration, and permanent address

### First detailed outside-user feedback

Daryl Clemons submitted two unusually useful reports after finding Theory Toolkit through Rob's Facebook post:

- In Fretboard Explorer, he entered without instructions, created a custom diagram containing 23 focused positions, described the Explorer as a valuable fretboard-learning and diagram-building tool, and requested lap-steel tunings and printable output.
- The requested six-string lap-steel tunings are D A D F# A D and C G C D G C. These appear compatible with the existing pitch-and-fret engine, but implementation must wait for informed answers about low-to-high order, string numbering and labels, expected orientation, other important tunings, and whether lap-steel users would prefer a neutral fretboard instead of the STUDio guitar illustration.
- In Scale Explorer, he selected F major pentatonic over the whole fretboard and reported that the presentation revealed usable notes missing from his everyday playing. He called it his favorite Toolkit feature and said he intended to use it.
- These reports validate two intended roles: Fretboard Explorer as an instructor-controlled custom diagram workspace, and Scale Explorer as a discovery and practice tool that makes musical relationships visible without requiring a walkthrough.

Daryl received a combined response thanking him and inviting further lap-steel guidance without assigning him an obligation to design the feature.

### PDF export direction

- Clean PDF export is preferred over building browser-print behavior first.
- The first useful export should contain the fretboard and relevant diagram information without controls, feedback UI, or page scaffolding.
- A generated PDF can be saved, shared, printed, and collected into practice or instruction binders through the user's normal PDF software.
- Consider including tuning, accidental preference, and a small optional title or label area, but do not turn the first version into a general document-layout system.
- Begin with Fretboard Explorer. Reuse the export capability elsewhere only after the first implementation is accepted.

### Paul Lilly feedback and future audio

Paul Lilly reviewed the Toolkit and compared it with FaChords and Fret Monster. His suggestions included individual-note audio, chord playback, arpeggiated 1–3–5 presentation, a keyboard relationship view, triads across the neck, additional tunings, and a left-handed view.

- These suggestions reinforce previously identified directions rather than requiring an immediate change in scope.
- Audio should eventually be a shared musical capability: individual pitches in Fretboard Explorer, scales or positions in Scale Explorer, strummed and arpeggiated shapes in Chord Shape Explorer, and 1–3–5 playback in a future Triad Groups Explorer.
- Audio triggering requires deliberate interaction design because normal clicks already select, Focus, hide, restore, or mute positions. Do not bolt audio onto the existing click cycle without resolving that conflict.
- A correct left-handed view still requires proper string order, physical note positions, labels, interaction geometry, and suitable artwork. It is not a simple image flip.
- Triad Groups Explorer remains a strong future priority for inversions, adjacent string groups, movement across the neck, voice leading, and double-stop relationships.

FaChords is a mature chord reference and teaching site with significant overlap, but it does not invalidate Theory Toolkit. Theory Toolkit's distinguishing direction is an instructor-controlled visual workspace and a consistent Swiss Army Knife of related Explorers, not an attempt to become the largest chord encyclopedia. When another resource already solves a problem exceptionally well, Theory Toolkit may link to it, learn from it, build only the teaching behavior still needed, or explicitly decide that duplication is unnecessary.

### CAVARTS demonstration opportunity

Paul offered two recurring CAVARTS opportunities:

- Office Hours on the last Friday of each month at 1:00 p.m. Eastern, normally attended by roughly 15–20 teachers and players.
- The Cyber Instructor meeting on the fourth Wednesday of each month at 7:00 p.m. Eastern, normally attended by about a dozen regular instructors. After the demonstration, Paul may send an email request for feedback to more than 80 Cyber Chapter volunteers.

Rob selected the Wednesday, September 23, 2026 meeting at 7:00 p.m. Eastern as the best fit because the Friday event conflicts with his workday. A response was sent asking Paul to confirm availability and provide:

- Expected presentation length.
- Meeting platform and screen-sharing capability.
- Whether the meeting is recorded.
- Whether questions should occur during or after the demonstration.
- Whether participants should watch or open the Toolkit and follow along.
- Any normal agenda or meeting format that should shape preparation.

### Demonstration mindset and preparation

The demonstration is not a sales pitch and does not require defending Theory Toolkit against every existing resource.

- Theory Toolkit was built first to help Rob teach his own students. That purpose has already made it worthwhile.
- Broader usefulness is welcome, but universal adoption is neither required nor expected.
- The purpose of the CAVARTS session is to show intentional teaching uses and learn what other instructors expect, find unclear, or would genuinely use.
- “Another site does this better” is useful research. Appropriate responses may include linking to that resource, studying what it does well, adding a missing capability, explaining the different teaching purpose, or deciding not to duplicate it.
- Before the meeting, prepare a deliberate path through the Explorers, one or two concrete teaching examples per view, concise opening and closing language, optional sections that can be skipped, and practiced answers to predictable questions.
- Rehearse interruptions and skeptical comparisons. Freeze consequential interface changes well before the event and verify the exact public build used for screen sharing.
- Do not rush audio or left-handed presentation merely to impress the meeting. Complete only features that can be tested and stabilized.

### Free-use and funding position

- The browser version is intended to remain free and fully functional. Do not remove useful web features or cripple the free experience to manufacture a paid tier.
- A possible future app may offer genuinely additional services such as accounts, saved Explorer states, saved lesson plans, quizzes, and other persistence-dependent conveniences.
- There are real development, hosting, service, equipment, and time costs, but Rob does not currently need to recover them.
- A future voluntary “buy me a coffee” or “shot of bourbon” contribution link is compatible with free use.
- Advertising is not planned. If costs eventually make it necessary, prefer static, unobtrusive, mostly text advertising.
- Payment, donation, subscription, or advertising interaction must never be required to use the core web Toolkit.

### Permanent public address

The preferred permanent public address is now:

`https://theorytoolkit.smallroomloudstories.com/`

This is preferred over a path beneath the podcast site because it gives Theory Toolkit its own identity while keeping it clearly within the Small Room, Loud Stories domain.

- Keep `Theory-Toolkit` as the authoritative approved-release repository and continue using GitHub Pages as the underlying static host.
- Publish the approved landing page at the subdomain root rather than exposing `/tests/` as the permanent public location.
- Preserve the Workbench-to-approved-repository promotion model; do not create a manually maintained copy inside the podcast repository.
- Existing GitHub Pages links must continue to lead users to the Toolkit.
- Retired `/tests/` pages should display a clear moved notice, an immediate destination link, and an automatic redirect after approximately 10 seconds. Ten seconds is long enough to read and update a bookmark without making the visitor wait unnecessarily.
- Preserve destination intent for direct old links: an old Scale Explorer URL should lead to the new Scale Explorer, not merely the landing page.
- During migration, update the Cloudflare feedback Worker to allow both `https://smallroomloudstories-glitch.github.io` and `https://theorytoolkit.smallroomloudstories.com`. Otherwise feedback from the new browser origin will fail with a 403.
- Add the custom domain in the Theory-Toolkit repository before adding the Namecheap DNS CNAME, then verify DNS, HTTPS, assets, internal navigation, Explorer behavior, and end-to-end feedback.
- The expected Namecheap DNS record is host `theorytoolkit`, pointing to `smallroomloudstories-glitch.github.io`, without the repository name.
- Keep both feedback origins during the transition and remove the old origin only after there is a deliberate reason to stop supporting legacy access.

No DNS or production-domain change was made during this session. Prepare the root release and compatibility behavior first, then perform the domain migration as a controlled, independently verified increment.

### Outreach status

- Reddit is not a practical outreach channel under current community policies. r/MusicTheory now disallows self-made app and diagram posts unless the author is a regular contributor who receives prior moderator approval; attempts to work around that rule in comments may also result in removal or a ban.
- Rob does not intend to manufacture forum participation merely to qualify for promotion. Open theory discussions are often tedious and are not the best use of development time.
- Direct instructor relationships, Guitars for Veterans, Facebook musician contacts, and referrals are producing more valuable engagement.
- Daryl's feedback confirms that a small number of serious users is more valuable at this stage than broad low-engagement visibility.
