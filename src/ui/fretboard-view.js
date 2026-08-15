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

const DEFAULT_GEOMETRY = {
  nutX: 16, lastFretX: 94, headerTop: 32.5, headerHeight: 8.5,
  nutTopString: 46, nutStringGap: 8.8,
  bodyTopString: 41.5, bodyStringGap: 8.3
};

const FRETBOARD_EXPLORER_GEOMETRY = {
  nutX: 12.5, lastFretX: 97, headerTop: 2, headerHeight: 8.5,
  nutTopString: 24.5, nutStringGap: 10.2,
  bodyTopString: 26.1, bodyStringGap: 9.55
};

function setBox(element, left, top, width, height) {
  element.style.setProperty("--cell-left", `${left}%`);
  element.style.setProperty("--cell-top", `${top}%`);
  element.style.setProperty("--cell-width", `${width}%`);
  element.style.setProperty("--cell-height", `${height}%`);
}

function fretBoundaries(maxFret, geometry) {
  const widths = fretWidths(maxFret);
  const total = widths.reduce((sum, width) => sum + width, 0);
  let position = geometry.nutX;
  return [position, ...widths.map((width) => {
    position += (width / total) * (geometry.lastFretX - geometry.nutX);
    return position;
  })];
}

function stringBox(stringIndex, xCenter, geometry) {
  const progress = Math.max(0, Math.min(1, (xCenter - geometry.nutX) / (geometry.lastFretX - geometry.nutX)));
  const nutCenter = geometry.nutTopString + (stringIndex * geometry.nutStringGap);
  const bodyCenter = geometry.bodyTopString + (stringIndex * geometry.bodyStringGap);
  const center = nutCenter + ((bodyCenter - nutCenter) * progress);
  const height = geometry.nutStringGap + ((geometry.bodyStringGap - geometry.nutStringGap) * progress);
  return { top: center - (height / 2), height };
}

export function positionFretboardCells(table, maxFret = FRETBOARD_MAX_FRET) {
  const compactOpen = table.classList.contains("fretboard-diagnostic");
  const geometry = compactOpen ? FRETBOARD_EXPLORER_GEOMETRY : DEFAULT_GEOMETRY;
  const boundaries = fretBoundaries(maxFret, geometry);
  const headerCells = table.querySelectorAll("thead th");
  const openWidth = compactOpen ? 3 : 6;

  if (headerCells[0]) setBox(headerCells[0], 0, geometry.headerTop, 7.5, geometry.headerHeight);
  if (headerCells[1]) {
    headerCells[1].classList.add("open-position");
    setBox(headerCells[1], geometry.nutX - (openWidth / 2), geometry.headerTop, openWidth, geometry.headerHeight);
  }
  for (let fret = 1; fret <= maxFret; fret += 1) {
    const left = boundaries[fret - 1];
    setBox(headerCells[fret + 1], left, geometry.headerTop, boundaries[fret] - left, geometry.headerHeight);
  }

  table.querySelectorAll("tbody tr").forEach((row, stringIndex) => {
    const cells = row.querySelectorAll("td");
    const labelBox = stringBox(stringIndex, geometry.nutX, geometry);
    if (cells[0]) setBox(cells[0], 0, labelBox.top, 7.5, labelBox.height);

    if (cells[1]) {
      cells[1].classList.add("open-position");
      const openBox = stringBox(stringIndex, geometry.nutX, geometry);
      setBox(cells[1], geometry.nutX - (openWidth / 2), openBox.top, openWidth, openBox.height);
    }

    for (let fret = 1; fret <= maxFret; fret += 1) {
      const left = boundaries[fret - 1];
      const width = boundaries[fret] - left;
      const box = stringBox(stringIndex, left + (width / 2), geometry);
      if (cells[fret + 1]) setBox(cells[fret + 1], left, box.top, width, box.height);
    }
  });
}
