// Key Explorer data translated from the Theory Toolkit v0.1 workbook.

export const MAJOR_KEYS = [
  { id: "C", label: "C", notes: ["C", "D", "E", "F", "G", "A", "B"] },
  { id: "Db", label: "Db", notes: ["Db", "Eb", "F", "Gb", "Ab", "Bb", "C"] },
  { id: "D", label: "D", notes: ["D", "E", "F#", "G", "A", "B", "C#"] },
  { id: "Eb", label: "Eb", notes: ["Eb", "F", "G", "Ab", "Bb", "C", "D"] },
  { id: "E", label: "E", notes: ["E", "F#", "G#", "A", "B", "C#", "D#"] },
  { id: "F", label: "F", notes: ["F", "G", "A", "Bb", "C", "D", "E"] },
  { id: "F#", label: "F#", notes: ["F#", "G#", "A#", "B", "C#", "D#", "E#"] },
  { id: "G", label: "G", notes: ["G", "A", "B", "C", "D", "E", "F#"] },
  { id: "Ab", label: "Ab", notes: ["Ab", "Bb", "C", "Db", "Eb", "F", "G"] },
  { id: "A", label: "A", notes: ["A", "B", "C#", "D", "E", "F#", "G#"] },
  { id: "Bb", label: "Bb", notes: ["Bb", "C", "D", "Eb", "F", "G", "A"] },
  { id: "B", label: "B", notes: ["B", "C#", "D#", "E", "F#", "G#", "A#"] }
];

export const DIATONIC_CHORDS = [
  { degree: "I", quality: "Major", suffix: "", triadDegrees: [0, 2, 4] },
  { degree: "ii", quality: "minor", suffix: "m", triadDegrees: [1, 3, 5] },
  { degree: "iii", quality: "minor", suffix: "m", triadDegrees: [2, 4, 6] },
  { degree: "IV", quality: "Major", suffix: "", triadDegrees: [3, 5, 0] },
  { degree: "V", quality: "Major", suffix: "", triadDegrees: [4, 6, 1] },
  { degree: "vi", quality: "minor", suffix: "m", triadDegrees: [5, 0, 2] },
  { degree: "vii°", quality: "diminished", suffix: "dim", triadDegrees: [6, 1, 3] }
];

export const HARMONY = {
  "I": {
    alsoCalled: "Home",
    movesTo: "Anywhere",
    explanation: "The point of rest. Music often begins or ends here because it feels complete and stable."
  },
  "ii": {
    alsoCalled: "Predominant",
    movesTo: "V, vii° chords",
    explanation: "A “getting ready” chord. It usually leads toward the dominant and increases forward motion."
  },
  "iii": {
    alsoCalled: "Mediant",
    movesTo: "vi, IV chords",
    explanation: "Less common than other chords. It shares two notes with the tonic, giving it a gentle, stable sound without feeling fully at home."
  },
  "IV": {
    alsoCalled: "Predominant",
    movesTo: "V, vii°, I chords",
    explanation: "One of the strongest setup chords. It moves naturally toward the dominant or sometimes returns directly to the tonic."
  },
  "V": {
    alsoCalled: "Dominant",
    movesTo: "I chord",
    explanation: "The chord that creates the strongest expectation of returning home. This is the main source of harmonic tension in a key."
  },
  "vi": {
    alsoCalled: "Relative Minor",
    movesTo: "ii, IV chords",
    explanation: "Uses the same key signature as the major key but centers on the sixth degree. It often feels reflective or wistful while remaining connected to the tonic."
  },
  "vii°": {
    alsoCalled: "Leading-tone Chord",
    movesTo: "I chord",
    explanation: "Built on the leading tone, this diminished chord strongly wants to resolve to the tonic because of its unstable sound."
  }
};
