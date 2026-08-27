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
  nutX: 13.88, lastFretX: 101.5, headerTop: 88, headerHeight: 7.5,
  labelLeft: 9.8, labelWidth: 2.25,
  selectorHeaderLeft: 7.85, selectorHeaderTop: 12.5,
  selectorHeaderWidth: 4.2, selectorHeaderHeight: 5.8,
  nutTopString: 24.5, nutStringGap: 10.2,
  bodyTopString: 17.8, bodyStringGap: 11.8,
  // Calibrated directly to the marked fret wires in the locked STUDio image.
  fretBoundaries: [
    13.88, 23.58, 31.88, 39.64, 46.79, 53.58, 60.18, 66.18,
    71.80, 76.97, 82.48, 87.33, 92.06, 96.15, 98.35, 101.50
  ]
};

const LAP_STEEL_EXPLORER_GEOMETRY = {
  // Calibrated directly to the strings and position lines in Daryl Clemons's
  // close photograph. The note rows follow the strings' subtle widening.
  nutX: 5.08, lastFretX: 97.73, headerTop: 88, headerHeight: 7.5,
  labelLeft: 1.1, labelWidth: 3,
  selectorHeaderLeft: .4, selectorHeaderTop: 3,
  selectorHeaderWidth: 6, selectorHeaderHeight: 5.8,
  nutTopString: 24.36, nutStringGap: 10.26,
  bodyTopString: 18, bodyStringGap: 13.2,
  fretBoundaries: [
    5.08, 12.43, 19.57, 26.38, 32.97, 39.24, 45.19, 50.81,
    56.16, 61.24, 66.11, 70.76, 75.24, 79.57, 83.57, 87.41,
    90.97, 94.43, 97.73
  ]
};

function setBox(element, left, top, width, height) {
  element.style.setProperty("--cell-left", `${left}%`);
  element.style.setProperty("--cell-top", `${top}%`);
  element.style.setProperty("--cell-width", `${width}%`);
  element.style.setProperty("--cell-height", `${height}%`);
}

function fretBoundaries(maxFret, geometry) {
  if (geometry.fretBoundaries?.length === maxFret + 1) {
    return [...geometry.fretBoundaries];
  }

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

export function positionFretboardCells(table, maxFret = FRETBOARD_MAX_FRET, instrumentId = table.dataset.instrument) {
  const compactOpen = table.classList.contains("fretboard-diagnostic");
  const geometry = compactOpen
    ? (instrumentId === "lapSteel" ? LAP_STEEL_EXPLORER_GEOMETRY : FRETBOARD_EXPLORER_GEOMETRY)
    : DEFAULT_GEOMETRY;
  const boundaries = fretBoundaries(maxFret, geometry);
  const headerCells = table.querySelectorAll("thead th");
  const openWidth = compactOpen ? 3 : 6;

  if (headerCells[0]) {
    setBox(
      headerCells[0],
      geometry.selectorHeaderLeft ?? geometry.labelLeft ?? 0,
      geometry.selectorHeaderTop ?? geometry.headerTop,
      geometry.selectorHeaderWidth ?? geometry.labelWidth ?? 7.5,
      geometry.selectorHeaderHeight ?? geometry.headerHeight
    );
  }
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
    if (cells[0]) setBox(cells[0], geometry.labelLeft ?? 0, labelBox.top, geometry.labelWidth ?? 7.5, labelBox.height);

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
