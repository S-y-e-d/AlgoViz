import gsap from "gsap";
import type { DataItem, GetElementByIndex } from "../../App";

class MissingElementError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MissingElementError";
  }
}

// create the highlight rect 
const getHighlightOverlay = (el: SVGElement): SVGRectElement => {
  const rect = el.querySelector("rect");
  if (!rect) throw new MissingElementError(`No <rect> element found`);

  const parent = el.parentElement;
  if (!parent) throw new MissingElementError(`Element has no parent`);

  const overlay = rect.cloneNode(false) as SVGRectElement;

  overlay.setAttribute("fill", "none");
  overlay.setAttribute("pointer-events", "none");

  const x = parseFloat(rect.getAttribute("x") || "0");
  const y = parseFloat(rect.getAttribute("y") || "0");
  const width = parseFloat(rect.getAttribute("width") || "0");
  const height = parseFloat(rect.getAttribute("height") || "0");

  overlay.setAttribute("x", String(x + 2));
  overlay.setAttribute("y", String(y + 2));
  overlay.setAttribute("width", String(width - 4));
  overlay.setAttribute("height", String(height - 4));
  overlay.setAttribute("filter", "url(#glow)");

  parent.appendChild(overlay);

  return overlay;
};

// highlight the given index with the specified color
const highlightTL = (
  tl: GSAPTimeline,
  index: number,
  getEl: GetElementByIndex,
  color: "yellow" | "orange" | "green" | "red",
  position?: string | number
) => {
  const el = getEl(index);
  if (!el) throw new MissingElementError(`No element at index ${index}`);

  const overlay = getHighlightOverlay(el);

  tl.fromTo(
    overlay,
    { strokeOpacity: 0 },
    {
      stroke: color,
      strokeWidth: 4,
      strokeOpacity: 1,
      duration: 0.25,
    },
    position
  );

  return overlay;
};

// remove the highlight overlay rect
const removeOverlayTL = (
  tl: GSAPTimeline,
  overlay: SVGRectElement,
  position?: string | number
) => {
  tl.to(
    overlay,
    {
      strokeOpacity: 0,
      duration: 0.25,
      onComplete: () => overlay.remove(),
    },
    position
  );
};

// compare elements at two indices
const compareGTTL = (
  tl: GSAPTimeline,
  i: number,
  j: number,
  array: DataItem[],
  getEl: GetElementByIndex
) => {
  const isGreater = array[i].val > array[j].val;
  const color = isGreater ? "green" : "red";

  const o1 = highlightTL(tl, i, getEl, color);
  const o2 = highlightTL(tl, j, getEl, color, "<");

  // delay
  tl.to({}, { duration: 0.25 });

  removeOverlayTL(tl, o1);
  removeOverlayTL(tl, o2, "<");

  return isGreater;
};

const swapTL = (
  i: number,
  j: number,
  getEl: GetElementByIndex,
  tl: GSAPTimeline,
) => {
  const el1 = getEl(i);
  if (!el1)
    throw new MissingElementError(`No element at index ${i}`);
  const el2 = getEl(j);
  if (!el2)
    throw new MissingElementError(`No element at index ${j}`);
  const txt1 = el1.querySelector("text");
  if (!txt1)
    throw new MissingElementError(`Missing text at index ${i}`);
  const txt2 = el2.querySelector("text");
  if (!txt2)
    throw new MissingElementError(`Missing text at index ${j}`);

  const dest1 = gsap.getProperty(txt2, "x") as number;
  const dest2 = gsap.getProperty(txt1, "x") as number;
  console.log(dest1, dest2);
  tl.to(txt1, {
    x: dest1,
    // y: 350,
    duration: 0.25,
  });
  tl.to(txt2, {
    x: dest2,
    // y: 350,
    duration: 0.25,
  }, "<");

  tl.set(txt1, {
    x: dest2,
  });
  tl.set(txt2, {
    x: dest1,
  });
  tl.call(() => {
    [txt1.textContent, txt2.textContent] = [txt2.textContent, txt1.textContent];
  })
}

export const bubbleSortTL = (
  array: DataItem[],
  getEl: GetElementByIndex
) => {
  const tl = gsap.timeline();

  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - 1 - i; j++) {

      // add < at the end to synchronize with the previous 
      const o1 = highlightTL(tl, j, getEl, "yellow");
      const o2 = highlightTL(tl, j + 1, getEl, "orange", "<");

      // wait
      tl.to({}, { duration: 0.25 });

      const isGT = compareGTTL(tl, j, j + 1, array, getEl);
      if (isGT) {
        swapTL(j, j + 1, getEl, tl);
        [array[j], array[j+1]] = [array[j+1], array[j]];
      }

      removeOverlayTL(tl, o1);
      removeOverlayTL(tl, o2, "<");

      // gap
      // tl.to({}, { duration: 0.5 });
    }
  }

  return tl;
};