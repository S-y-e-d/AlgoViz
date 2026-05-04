import gsap from "gsap";
import type { DataItem, GetElementByIndex } from "../../App";
import type { RefObject } from "react";

export class MissingElementError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MissingElementError";
    }
}

// create the highlight rect to avoid overlapping of lines in normal array structure
const getHighlightOverlay = (rect: SVGRectElement): SVGRectElement => {

    // const parent = el.parentElement;
    // if (!parent) throw new MissingElementError(`Element has no parent`);

    const overlay = rect.cloneNode(false) as SVGRectElement;
    overlay.setAttribute("class", "temp");

    overlay.setAttribute("fill", "none");
    overlay.setAttribute("stroke-opacity", "0");
    overlay.setAttribute("pointer-events", "none");

    // I don't know why this works, since I only have set the position using transform
    // should have used gsap.getProperty but this is working so not changing.

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
    const parent = rect.parentElement;
    if (!parent) {
        throw new MissingElementError("Parent missing");
    }
    parent.appendChild(overlay);

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
    const rect = el.querySelector("rect");
    if (!rect) throw new MissingElementError(`No <rect> element found`);

    const overlay = getHighlightOverlay(rect);

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
    txt1Copy.setAttribute("class", "temp");
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
    txtClone.setAttribute("class", "temp");
    txtClone.textContent = String(value);
    txtClone.setAttribute("opacity", "0");
    target.appendChild(txtClone);
    const endY = gsap.getProperty(txt, "y") as number;
    const startY = endY - 150;
    tl.set(txtClone, { opacity: 1 })
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

export type ClonedGroup = {
    rect: SVGRectElement;
    text: SVGTextElement;
}

// not commenting to check if AI broke anything
// export const createSplitArrayTL = (
//     array: DataItem[],
//     splitSize: number,
//     getEl: GetElementByIndex,
//     tl: GSAPTimeline,
//     isTLPaused: RefObject<boolean>,
// ): ClonedGroup[] => {
//     const arr: ClonedGroup[] = [];
//     const canvas = document.querySelector("#canvas");
//     if (!canvas)
//         throw new MissingElementError("Where did the canvas go");

//     const temp = getEl(0)?.querySelector("rect");
//     if (!temp)
//         throw new MissingElementError("Nothing it index 0");

//     const rectSize = gsap.getProperty(temp, "width") as number || 0;
//     const gapSize = rectSize / 4;
//     const splitArrayLength = rectSize * array.length + gapSize * (Math.ceil(array.length / splitSize) - 1);
//     // 12 34 56 78 9
//     const startX = (1000 - splitArrayLength) / 2;
//     let currentX = startX;
//     const Y = gsap.getProperty(temp, "y") as number - 2 * rectSize;
//     for (let i = 0; i < array.length; i++) {
//         const group = getEl(i);
//         if (!group)
//             throw new MissingElementError("Could not split, array missing cell");
//         const rect = group.querySelector("rect");
//         if (!rect)
//             throw new MissingElementError("Could not split, array missing rect");
//         const text = group.querySelector("text");
//         if (!text)
//             throw new MissingElementError("Could not split, array missing text");

//         const rectClone = rect.cloneNode(false) as SVGRectElement;
//         const textClone = text.cloneNode(true) as SVGTextElement;
//         textClone.setAttribute("opacity", "0");
//         textClone.textContent = String(array[i].val);

//         tl.set(text, { opacity: 0, }, i === 0 ? undefined : "<");
//         tl.set(textClone, { opacity: 1 }, "<");

//         tl.fromTo(rectClone,
//             {
//                 opacity: 0,
//             },
//             {
//                 opacity: 1,
//                 x: currentX,
//                 y: Y,
//                 duration: 0.25,
//             },
//             "<",
//         );


//         tl.to(textClone, {
//             opacity: 1,
//             x: currentX + rectSize / 2,
//             y: Y + rectSize / 2,
//             duration: 0.25,
//         }, "<")


//         canvas.appendChild(rectClone);
//         canvas.appendChild(textClone);

//         arr.push({ rect: rectClone, text: textClone });
//         currentX += rectSize;
//         currentX += (i + 1) % splitSize === 0 ? gapSize : 0;
//     }

//     tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

//     return arr;
// }

export const createSplitArrayTL = (
    array: DataItem[],
    splitSize: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
): ClonedGroup[] => {
    const arr: ClonedGroup[] = [];

    const canvas = document.querySelector("#canvas");
    if (!canvas)
        throw new MissingElementError("Where did the canvas go");

    const temp = getEl(0)?.querySelector("rect");
    if (!temp)
        throw new MissingElementError("Nothing at index 0");

    const rectSize = (gsap.getProperty(temp, "width") as number) || 0;

    const smallGap = rectSize / 4;
    const largeGap = smallGap * 2;

    const chunkCount = Math.ceil(array.length / splitSize);
    const gapCount = chunkCount - 1;

    const largeGapCount = Math.floor(gapCount / 2);
    const smallGapCount = gapCount - largeGapCount;

    const splitArrayLength =
        rectSize * array.length +
        smallGapCount * smallGap +
        largeGapCount * largeGap;

    const startX = (1000 - splitArrayLength) / 2;
    let currentX = startX;

    const Y = (gsap.getProperty(temp, "y") as number) - 2 * rectSize;

    for (let i = 0; i < array.length; i++) {
        const group = getEl(i);
        if (!group)
            throw new MissingElementError("Could not split, array missing cell");

        const rect = group.querySelector("rect");
        if (!rect)
            throw new MissingElementError("Could not split, array missing rect");

        const text = group.querySelector("text");
        if (!text)
            throw new MissingElementError("Could not split, array missing text");

        const rectClone = rect.cloneNode(false) as SVGRectElement;
        rectClone.setAttribute("class", "temp");
        const textClone = text.cloneNode(true) as SVGTextElement;
        textClone.setAttribute("class", "temp");

        textClone.setAttribute("opacity", "0");
        textClone.textContent = String(array[i].val);
        

        tl.set(text, { opacity: 0 }, i === 0 ? undefined : "<");
        tl.set(textClone, { opacity: 1 }, "<");

        tl.fromTo(
            rectClone,
            { opacity: 0 },
            {
                opacity: 1,
                x: currentX,
                y: Y,
                duration: 0.25,
            },
            "<"
        );

        tl.to(
            textClone,
            {
                opacity: 1,
                x: currentX + rectSize / 2,
                y: Y + rectSize / 2,
                duration: 0.25,
            },
            "<"
        );

        canvas.appendChild(rectClone);
        canvas.appendChild(textClone);

        arr.push({ rect: rectClone, text: textClone });

        currentX += rectSize;

        // add gap at chunk boundary (except last element)
        if ((i + 1) % splitSize === 0 && i !== array.length - 1) {
            const chunkIndex = Math.floor((i + 1) / splitSize) - 1;
            const isLarge = chunkIndex % 2 === 1;

            currentX += isLarge ? largeGap : smallGap;
        }
    }

    tl.call(() => {
        if (isTLPaused.current === true) tl.pause();
    });

    return arr;
};

export const removeSplitArrayTL = (
    array: ClonedGroup[],
    tl: GSAPTimeline
) => {
    for (let i = 0; i < array.length; i++) {
        const { rect, text } = array[i];
        tl.to(rect, {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
                rect.remove();
            },
        }, i === 0 ? undefined : "<");
        tl.to(text, {
            opacity: 0,
            duration: 0.25,
            onComplete: () => {
                text.remove();
            },
        }, "<");
    }
    array = [];
}

export const moveAndSetText = (
    array: DataItem[],
    k: number,
    val: number,
    clonedText: SVGTextElement,
    trueText: SVGTextElement,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {
    const x = gsap.getProperty(trueText, "x");
    const y = gsap.getProperty(trueText, "y");
    tl.to(clonedText, {
        x: x,
        y: y,
        duration: 0.25,
    });
    tl.call(() => {
        clonedText.remove();
        trueText.textContent = String(val);
    });
    tl.set(trueText, { opacity: 1 }, "<");
    array[k] = { val: val, id: crypto.randomUUID() };
    tl.to({}, { duration: 0.25 });
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
}

export const highlightTempRectTL = (
    rect: SVGRectElement,
    color: string,
    tl: GSAPTimeline,
    position?: string,
): string => {
    const ogColor = gsap.getProperty(rect, "stroke") as string;
    tl.to(rect, {
        stroke: color,
        duration: 0.25,
    }, position)
    return ogColor;
}


// 1234 5678 9
