// The illustrated STUDio guitar remains legible through fret 15. This still
// carries the chromatic sequence beyond the octave at fret 12.
export const FRETBOARD_MAX_FRET = 15;

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
  positionFretboardCells(table, maxFret);
}

const NUT_X = 16;
const LAST_FRET_X = 94;
const HEADER_TOP = 32.5;
const HEADER_HEIGHT = 8.5;
const NUT_TOP_STRING = 46;
const NUT_STRING_GAP = 8.8;
const BODY_TOP_STRING = 41.5;
const BODY_STRING_GAP = 8.3;

function setBox(element, left, top, width, height) {
  element.style.setProperty("--cell-left", `${left}%`);
  element.style.setProperty("--cell-top", `${top}%`);
  element.style.setProperty("--cell-width", `${width}%`);
  element.style.setProperty("--cell-height", `${height}%`);
}

function fretBoundaries(maxFret) {
  const widths = fretWidths(maxFret);
  const total = widths.reduce((sum, width) => sum + width, 0);
  let position = NUT_X;
  return [position, ...widths.map((width) => {
    position += (width / total) * (LAST_FRET_X - NUT_X);
    return position;
  })];
}

function stringBox(stringIndex, xCenter) {
  const progress = Math.max(0, Math.min(1, (xCenter - NUT_X) / (LAST_FRET_X - NUT_X)));
  const nutCenter = NUT_TOP_STRING + (stringIndex * NUT_STRING_GAP);
  const bodyCenter = BODY_TOP_STRING + (stringIndex * BODY_STRING_GAP);
  const center = nutCenter + ((bodyCenter - nutCenter) * progress);
  const height = NUT_STRING_GAP + ((BODY_STRING_GAP - NUT_STRING_GAP) * progress);
  return { top: center - (height / 2), height };
}

export function positionFretboardCells(table, maxFret = FRETBOARD_MAX_FRET) {
  const boundaries = fretBoundaries(maxFret);
  const headerCells = table.querySelectorAll("thead th");
  const compactOpen = table.classList.contains("fretboard-diagnostic");
  const openWidth = compactOpen ? 3 : 6;

  if (headerCells[0]) setBox(headerCells[0], 0, HEADER_TOP, 7.5, HEADER_HEIGHT);
  if (headerCells[1]) {
    headerCells[1].classList.add("open-position");
    setBox(headerCells[1], NUT_X - (openWidth / 2), HEADER_TOP, openWidth, HEADER_HEIGHT);
  }
  for (let fret = 1; fret <= maxFret; fret += 1) {
    const left = boundaries[fret - 1];
    setBox(headerCells[fret + 1], left, HEADER_TOP, boundaries[fret] - left, HEADER_HEIGHT);
  }

  table.querySelectorAll("tbody tr").forEach((row, stringIndex) => {
    const cells = row.querySelectorAll("td");
    const labelBox = stringBox(stringIndex, NUT_X);
    if (cells[0]) setBox(cells[0], 0, labelBox.top, 7.5, labelBox.height);

    if (cells[1]) {
      cells[1].classList.add("open-position");
      const openBox = stringBox(stringIndex, NUT_X);
      setBox(cells[1], NUT_X - (openWidth / 2), openBox.top, openWidth, openBox.height);
    }

    for (let fret = 1; fret <= maxFret; fret += 1) {
      const left = boundaries[fret - 1];
      const width = boundaries[fret] - left;
      const box = stringBox(stringIndex, left + (width / 2));
      if (cells[fret + 1]) setBox(cells[fret + 1], left, box.top, width, box.height);
    }
  });
}
