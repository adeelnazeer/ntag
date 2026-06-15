/**
 * CSP-safe carousel: only Tailwind classes (no inline style / transform).
 * All translate classes are string literals so Tailwind JIT includes them.
 */
const TRACK_WIDTH = {
  1: "w-full",
  2: "w-[200%]",
  3: "w-[300%]",
  4: "w-[400%]",
  5: "w-[500%]",
  6: "w-[600%]",
  7: "w-[700%]",
  8: "w-[800%]",
  9: "w-[900%]",
  10: "w-[1000%]",
};

const TRANSLATE_BY_COUNT = {
  1: ["translate-x-0"],
  2: ["translate-x-0", "-translate-x-1/2"],
  3: ["translate-x-0", "-translate-x-[33.333333%]", "-translate-x-[66.666667%]"],
  4: ["translate-x-0", "-translate-x-[25%]", "-translate-x-[50%]", "-translate-x-[75%]"],
  5: ["translate-x-0", "-translate-x-[20%]", "-translate-x-[40%]", "-translate-x-[60%]", "-translate-x-[80%]"],
  6: [
    "translate-x-0",
    "-translate-x-[16.666667%]",
    "-translate-x-[33.333333%]",
    "-translate-x-[50%]",
    "-translate-x-[66.666667%]",
    "-translate-x-[83.333333%]",
  ],
  7: [
    "translate-x-0",
    "-translate-x-[14.285714%]",
    "-translate-x-[28.571429%]",
    "-translate-x-[42.857143%]",
    "-translate-x-[57.142857%]",
    "-translate-x-[71.428571%]",
    "-translate-x-[85.714286%]",
  ],
  8: [
    "translate-x-0",
    "-translate-x-[12.5%]",
    "-translate-x-[25%]",
    "-translate-x-[37.5%]",
    "-translate-x-[50%]",
    "-translate-x-[62.5%]",
    "-translate-x-[75%]",
    "-translate-x-[87.5%]",
  ],
  9: [
    "translate-x-0",
    "-translate-x-[11.111111%]",
    "-translate-x-[22.222222%]",
    "-translate-x-[33.333333%]",
    "-translate-x-[44.444444%]",
    "-translate-x-[55.555556%]",
    "-translate-x-[66.666667%]",
    "-translate-x-[77.777778%]",
    "-translate-x-[88.888889%]",
  ],
  10: [
    "translate-x-0",
    "-translate-x-[10%]",
    "-translate-x-[20%]",
    "-translate-x-[30%]",
    "-translate-x-[40%]",
    "-translate-x-[50%]",
    "-translate-x-[60%]",
    "-translate-x-[70%]",
    "-translate-x-[80%]",
    "-translate-x-[90%]",
  ],
};

/** @param {number} count */
export function heroCarouselTrackWidthClass(count) {
  const c = Math.min(Math.max(Math.floor(count), 1), 10);
  return TRACK_WIDTH[c] ?? "w-full";
}

/** @param {number} count @param {number} activeIndex */
export function heroCarouselTrackTranslateClass(count, activeIndex) {
  const c = Math.min(Math.max(Math.floor(count), 1), 10);
  const row = TRANSLATE_BY_COUNT[c] ?? TRANSLATE_BY_COUNT[1];
  const i = Math.min(Math.max(Math.floor(activeIndex), 0), row.length - 1);
  return row[i] ?? "translate-x-0";
}

/** Each slide flex-basis as fraction of track (track is N × viewport wide). */
const SLIDE_CHILD_CLASS = {
  1: "w-full shrink-0",
  2: "w-1/2 shrink-0",
  3: "w-1/3 shrink-0",
  4: "w-1/4 shrink-0",
  5: "w-1/5 shrink-0",
  6: "w-1/6 shrink-0",
  7: "w-[14.285714%] shrink-0",
  8: "w-[12.5%] shrink-0",
  9: "w-[11.111111%] shrink-0",
  10: "w-[10%] shrink-0",
};

/** @param {number} count */
export function heroCarouselSlideChildClass(count) {
  const c = Math.min(Math.max(Math.floor(count), 1), 10);
  return SLIDE_CHILD_CLASS[c] ?? SLIDE_CHILD_CLASS[1];
}
