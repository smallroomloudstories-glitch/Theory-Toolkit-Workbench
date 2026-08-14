// Shared manual-focus state for fretboard-based tools.
// Focus identifies an exact physical position: string number + fret number.

export function createFretboardFocus() {
  const focused = new Set();

  function key(stringNumber, fretNumber) {
    return `${stringNumber}:${fretNumber}`;
  }

  return {
    toggle(stringNumber, fretNumber) {
      const position = key(stringNumber, fretNumber);
      if (focused.has(position)) focused.delete(position);
      else focused.add(position);
      return focused.has(position);
    },

    has(stringNumber, fretNumber) {
      return focused.has(key(stringNumber, fretNumber));
    },

    clear() {
      focused.clear();
    },

    get size() {
      return focused.size;
    }
  };
}
