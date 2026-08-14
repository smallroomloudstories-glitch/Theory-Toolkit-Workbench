// Theory Toolkit v0.5
// Source: verified against the Theory Toolkit v0.1 workbook where applicable.

export const CHROMATIC_SHARPS = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B"
];

// Tuning presets are data, not special fretboard logic. The fretboard engine
// receives whichever tuning is active and calculates notes from those strings.
export const GUITAR_TUNINGS = {
  standard: {
    id: "standard",
    name: "Standard (E A D G B E)",
    strings: [
      { string: 1, label: "1 (e)", note: "E" },
      { string: 2, label: "2 (B)", note: "B" },
      { string: 3, label: "3 (G)", note: "G" },
      { string: 4, label: "4 (D)", note: "D" },
      { string: 5, label: "5 (A)", note: "A" },
      { string: 6, label: "6 (E)", note: "E" }
    ]
  },
  dropD: {
    id: "dropD",
    name: "Drop D (D A D G B E)",
    strings: [
      { string: 1, label: "1 (e)", note: "E" },
      { string: 2, label: "2 (B)", note: "B" },
      { string: 3, label: "3 (G)", note: "G" },
      { string: 4, label: "4 (D)", note: "D" },
      { string: 5, label: "5 (A)", note: "A" },
      { string: 6, label: "6 (D)", note: "D" }
    ]
  }
};

export const STANDARD_GUITAR_TUNING = GUITAR_TUNINGS.standard.strings;
