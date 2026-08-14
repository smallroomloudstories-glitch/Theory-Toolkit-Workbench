import { CHROMATIC_SHARPS } from "../data/music-data.js";

export function noteAtFret(openNote, fret) {
  const openIndex = CHROMATIC_SHARPS.indexOf(openNote);

  if (openIndex === -1) {
    throw new Error(`Unknown open-string note: ${openNote}`);
  }

  if (!Number.isInteger(fret) || fret < 0) {
    throw new Error(`Fret must be a non-negative integer: ${fret}`);
  }

  return CHROMATIC_SHARPS[(openIndex + fret) % CHROMATIC_SHARPS.length];
}

export function buildFretboard(tuning, maxFret) {
  if (!Array.isArray(tuning) || tuning.length === 0) {
    throw new Error("Tuning must be a non-empty array.");
  }

  if (!Number.isInteger(maxFret) || maxFret < 0) {
    throw new Error(`Maximum fret must be a non-negative integer: ${maxFret}`);
  }

  return tuning.map((stringData) => ({
    ...stringData,
    frets: Array.from(
      { length: maxFret + 1 },
      (_, fret) => ({ fret, note: noteAtFret(stringData.note, fret) })
    )
  }));
}
