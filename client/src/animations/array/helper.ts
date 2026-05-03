import gsap from "gsap";
import type { DataItem, GetElementByIndex } from "../../App";
import type { RefObject } from "react";

export class MissingElementError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingElementError";
    }
}

// create the highlight rect 
const getHighlightOverlay = (el: SVGElement): SVGRectElement => {
    const rect = el.querySelector("rect");
    if (!rect) throw new MissingElementError(`No <rect> element found`);

    // const parent = el.parentElement;
    // if (!parent) throw new MissingElementError(`Element has no parent`);

    const overlay = rect.cloneNode(false) as SVGRectElement;

    overlay.setAttribute("fill", "none");
    overlay.setAttribute("stroke-opacity", "0");
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

    // el was parent before. Revert if something breaks
    el.appendChild(overlay);

    return overlay;
};

// highlight the given index with the specified color
export const highlightTL = (
    tl: GSAPTimeline,
    index: number,
    getEl: GetElementByIndex,
    color: "yellow" | "orange" | "blue" | "green" | "red",
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
export const removeOverlayTL = (
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
export const compareGTTL = (
    tl: GSAPTimeline,
    i: number,
    j: number,
    array: DataItem[],
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>,
) => {
    const isGreater = array[i].val > array[j].val;
    const color = isGreater ? "red" : "green";

    const o1 = highlightTL(tl, i, getEl, color);
    const o2 = highlightTL(tl, j, getEl, color, "<");

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

    // delay
    tl.to({}, { duration: 0.25 });

    removeOverlayTL(tl, o1);
    removeOverlayTL(tl, o2, "<");

    return isGreater;
};

export const swapTL = (
    array: DataItem[],
    i: number,
    j: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {
    const el1 = getEl(i);
    const el2 = getEl(j);

    if (!el1)
        throw new MissingElementError(`No element at index ${i}`);
    if (!el2)
        throw new MissingElementError(`No element at index ${j}`);

    const txt1 = el1.querySelector("text");
    const txt2 = el2.querySelector("text");

    if (!txt1)
        throw new MissingElementError(`Missing text at index ${i}`);
    if (!txt2)
        throw new MissingElementError(`Missing text at index ${j}`);

    const dest1 = gsap.getProperty(txt2, "x") as number;
    const dest2 = gsap.getProperty(txt1, "x") as number;
    console.log(dest1, dest2);
    tl.to(txt1, {
        x: dest1,
        duration: 0.25,
    });
    tl.to(txt2, {
        x: dest2,
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
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); });

    [array[i], array[j]] = [array[j], array[i]];

}

export const shiftTL = (
    array: DataItem[],
    index: number,
    offset: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>
) => {
    const el1 = getEl(index);
    const el2 = getEl(index + offset);

    if (!el1)
        throw new MissingElementError(`No element at index ${index}`);
    if (!el2)
        throw new MissingElementError(`No element at index ${index + offset}`);

    const txt1 = el1.querySelector("text");
    const txt2 = el2.querySelector("text");

    if (!txt1)
        throw new MissingElementError(`Missing text at index ${index}`);
    if (!txt2)
        throw new MissingElementError(`Missing text at index ${index + offset}`);

    const txt1Copy = txt1.cloneNode(true) as SVGTextElement;
    el1.appendChild(txt1Copy);
    const dest = gsap.getProperty(txt2, "x") as number;
    tl.to(txt1Copy, {
        x: dest,
        duration: 0.25,
    });
    tl.call(() => {
        txt2.textContent = txt1.textContent;
        txt1Copy.remove();
    })
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); });
    array[index + offset] = array[index];

}

export const setValueTL = (
    value: number,
    index: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
) => {
    const target = getEl(index);
    if (!target)
        throw new MissingElementError(`No element at index ${target}`);

    const txt = target.querySelector("text");
    if (!txt)
        throw new MissingElementError(`Missing text at index ${index}`);

    const txtClone = txt.cloneNode(true) as SVGTextElement;
    txtClone.textContent = String(value);
    txtClone.setAttribute("opacity", "0");
    target.appendChild(txtClone);
    const endY = gsap.getProperty(txt, "y") as number;
    const startY = endY - 150;
    tl.set(txtClone, {opacity:1})
    tl.fromTo(txtClone,
        { y: startY },
        {
            y: endY,
            duration: 0.25
        });
    tl.call(() => {
        txt.textContent = String(value);
        txtClone.remove();
    });
    // no need to set the value, it changes the reset structure. 
    // array[index].val = value;
}

