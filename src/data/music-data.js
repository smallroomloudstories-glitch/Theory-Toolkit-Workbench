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

export const LAP_STEEL_TUNINGS = {
  openD: {
    id: "openD",
    name: "Open D (D A D F# A D)",
    strings: [
      { string: 1, label: "1 (D)", note: "D" },
      { string: 2, label: "2 (A)", note: "A" },
      { string: 3, label: "3 (F#)", note: "F#" },
      { string: 4, label: "4 (D)", note: "D" },
      { string: 5, label: "5 (A)", note: "A" },
      { string: 6, label: "6 (D)", note: "D" }
    ]
  },
  cgcdgc: {
    id: "cgcdgc",
    name: "C9 (C G C D G C)",
    strings: [
      { string: 1, label: "1 (C)", note: "C" },
      { string: 2, label: "2 (G)", note: "G" },
      { string: 3, label: "3 (D)", note: "D" },
      { string: 4, label: "4 (C)", note: "C" },
      { string: 5, label: "5 (G)", note: "G" },
      { string: 6, label: "6 (C)", note: "C" }
    ]
  }
};

export const BASS_TUNINGS = {
  standard: {
    id: "standard",
    name: "Standard (E A D G)",
    strings: [
      { string: 1, label: "1 (G)", note: "G" },
      { string: 2, label: "2 (D)", note: "D" },
      { string: 3, label: "3 (A)", note: "A" },
      { string: 4, label: "4 (E)", note: "E" }
    ]
  }
};

export const FRETBOARD_INSTRUMENTS = {
  guitar: {
    id: "guitar",
    name: "Guitar",
    maxFret: 15,
    suppressLastFret: true,
    thumbnail: "./assets/studio-guitar-full.webp",
    thumbnailAlt: "The full STUDio guitar",
    info: {
      title: "Rob's STUDio Guitar",
      summary: "The Yamaha acoustic guitar whose fretboard became Theory Toolkit's original illustrated reference instrument.",
      credit: "Instrument and reference photography: Rob Miles",
      photo: "./assets/rob-studio-guitar-original.webp",
      photoAlt: "Rob's Yamaha STUDio guitar covered with guest signatures",
      facts: [
        ["Instrument", "Yamaha acoustic guitar"],
        ["Strings", "Six"],
        ["Toolkit role", "Representative guitar"]
      ]
    },
    defaultTuning: "standard",
    tunings: GUITAR_TUNINGS
  },
  lapSteel: {
    id: "lapSteel",
    name: "Lap Steel",
    maxFret: 18,
    suppressLastFret: false,
    thumbnail: "./assets/daryl-electro-hawaiian-lap-steel.webp",
    thumbnailAlt: "Daryl Clemons's Electro Hawaiian lap steel",
    info: {
      title: "Daryl Clemons's Electro Hawaiian Lap Steel",
      summary: "The six-string lap steel used to develop and validate Theory Toolkit's first alternate-instrument profile.",
      credit: "Reference photography and testing: Daryl Clemons",
      photo: "./assets/daryl-electro-hawaiian-original.webp",
      photoAlt: "Daryl Clemons's red Electro Hawaiian lap steel",
      facts: [
        ["Instrument", "Electro Hawaiian lap steel"],
        ["Strings", "Six"],
        ["Toolkit role", "Representative lap steel"]
      ]
    },
    defaultTuning: "openD",
    tunings: LAP_STEEL_TUNINGS
  },
  bass: {
    id: "bass",
    name: "Bass",
    maxFret: 15,
    suppressLastFret: true,
    thumbnail: "./assets/rob-epiphone-viola-bass-full.webp",
    thumbnailAlt: "Rob's Epiphone Viola Bass",
    info: {
      title: "Rob's Epiphone Viola Bass",
      summary: "The short-scale four-string bass used to prove that Fretboard Explorer is not secretly wearing six-string trousers.",
      credit: "Instrument and reference photography: Rob Miles",
      photo: "./assets/rob-epiphone-viola-bass-full-original.jpg",
      photoAlt: "Rob's sunburst Epiphone Viola Bass",
      facts: [
        ["Instrument", "Epiphone Viola Bass"],
        ["Strings", "Four"],
        ["Toolkit role", "Representative bass"]
      ]
    },
    defaultTuning: "standard",
    tunings: BASS_TUNINGS
  }
};

export const STANDARD_GUITAR_TUNING = GUITAR_TUNINGS.standard.strings;
