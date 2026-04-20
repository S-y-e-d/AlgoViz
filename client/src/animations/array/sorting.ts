import gsap from "gsap";
import type { GetElementByIndex } from "../../App"

class MissingElementError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingElementError";
    }
}

type HighlightHandle = {
    remove: () => Promise<void>,
}

const getHighlightOverlay = (el: SVGElement): SVGRectElement => {

    const rect = el.querySelector("rect");
    if (!rect) throw new MissingElementError(`No <rect> element found`);
    const parent = el.parentElement
    if (!parent) throw new MissingElementError(`Element has no parent`);

    // clone rect node but not children
    const highlightOverlay = rect.cloneNode(false) as SVGRectElement;

    // ensure it's purely visual
    highlightOverlay.setAttribute("fill", "none");
    highlightOverlay.setAttribute("pointer-events", "none");

    // shrink inward by 1px on all sides
    const x = parseFloat(rect.getAttribute("x") || "0");
    const y = parseFloat(rect.getAttribute("y") || "0");
    const width = parseFloat(rect.getAttribute("width") || "0");
    const height = parseFloat(rect.getAttribute("height") || "0");

    highlightOverlay.setAttribute("x", String(x + 2));
    highlightOverlay.setAttribute("y", String(y + 2));
    highlightOverlay.setAttribute("width", String(width - 4));
    highlightOverlay.setAttribute("height", String(height - 4));
    highlightOverlay.setAttribute("filter", "url(#glow)");

    parent.appendChild(highlightOverlay);

    return highlightOverlay;
}

const highlight = async (
    index: number,
    getElementByIndex: GetElementByIndex,
    color: "yellow" | "orange" | "green" | "red"
): Promise<HighlightHandle> => {
    const el = getElementByIndex(index);
    if (!el) throw new MissingElementError(`No <g> element for index ${index}`);

    // clone rect node but not children
    const highlightOverlay = getHighlightOverlay(el);

    await new Promise<void>((resolve) => {
        gsap.to(highlightOverlay, {
            stroke: color,
            strokeWidth: 4,
            duration: 0.25,
            onComplete: resolve,
        });
    });

    return {
        remove: async () => {
            await gsap.to(highlightOverlay, {
                strokeOpacity: 0,
                duration: 0.25,
            });
            highlightOverlay.remove();
        }
    }
}

const compareGT = async (i: number, j: number, array: number[], getElementByIndex: GetElementByIndex): Promise<boolean> => {
    const el1 = getElementByIndex(i);
    const el2 = getElementByIndex(j);
    if (!el1) throw new MissingElementError(`No <g> element for index ${i}`);
    if (!el2) throw new MissingElementError(`No <g> element for index ${j}`);

    let compBool = false;
    if (array[i] > array[j]) {
        compBool = true;
    }
    const [h1, h2] = await Promise.all([
        highlight(i, getElementByIndex, compBool ? "green" : "red"),
        highlight(j, getElementByIndex, compBool ? "green" : "red")
    ]);
    await new Promise((r) => setTimeout(r, 250));
    await Promise.all([
        h1.remove(),
        h2.remove()
    ])
    return compBool;

}

export const bubbleSort = async (array: number[], getElementByIndex: GetElementByIndex) => {
    // test code to highlight all
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {
            const [h1, h2] = await Promise.all([
                highlight(j, getElementByIndex, "yellow"),
                highlight(j + 1, getElementByIndex, "orange")
            ])

            await new Promise((r) => setTimeout(r, 250))

            await compareGT(j, j+1, array, getElementByIndex);

            await Promise.all([
                h1.remove(),
                h2.remove()
            ])

            await new Promise((r) => setTimeout(r, 500));
        }
    }
}