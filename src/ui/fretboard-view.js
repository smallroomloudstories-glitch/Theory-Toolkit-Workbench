export const FRETBOARD_MAX_FRET = 18;

// Equal-temperament fret positions. Each fret occupies the physical distance
// between two adjacent points on a scale length, so cells narrow toward the body.
export function fretWidths(maxFret = FRETBOARD_MAX_FRET) {
  return Array.from({ length: maxFret }, (_, index) => {
    const fret = index + 1;
    const near = 1 - (2 ** (-(fret - 1) / 12));
    const far = 1 - (2 ** (-fret / 12));
    return far - near;
  });
}

export function configureFretboardView({ table, head, maxFret = FRETBOARD_MAX_FRET, firstHeader = "String" }) {
  if (!(table instanceof HTMLTableElement) || !(head instanceof HTMLTableSectionElement)) {
    throw new Error("A fretboard table and table head are required.");
  }

  table.classList.add("fretboard-view");
  table.dataset.maxFret = String(maxFret);

  const widths = fretWidths(maxFret);
  const playedLength = widths.reduce((sum, width) => sum + width, 0);
  const labelWidth = 8;
  const openWidth = 7;
  const fretAreaWidth = 100 - labelWidth - openWidth;
  const colgroup = document.createElement("colgroup");

  for (const [className, width] of [["string-label-column", labelWidth], ["open-string-column", openWidth]]) {
    const column = document.createElement("col");
    column.className = className;
    column.style.width = `${width}%`;
    colgroup.appendChild(column);
  }

  widths.forEach((width, index) => {
    const column = document.createElement("col");
    column.style.width = `${(width / playedLength) * fretAreaWidth}%`;
    column.dataset.fret = String(index + 1);
    colgroup.appendChild(column);
  });

  table.querySelector("colgroup")?.remove();
  table.prepend(colgroup);
  head.innerHTML = `<tr><th>${firstHeader}</th>${Array.from(
    { length: maxFret + 1 },
    (_, fret) => `<th>${fret === 0 ? "Open" : fret}</th>`
  ).join("")}</tr>`;
}
