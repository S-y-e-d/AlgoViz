import gsap from "gsap";
import type { ColorType, DataItem, GetElementByIndex } from "../App";
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
export const highlightArrayTL = (
    el: SVGGElement | null,
    color: ColorType,
    tl: GSAPTimeline,
    position?: string | number
) => {
    if (!el) throw new MissingElementError(`No element to highlight`);
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
    overlay: SVGRectElement,
    tl: GSAPTimeline,
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
    i: number,
    j: number,
    array: DataItem[],
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {
    const isGreater = array[i].val > array[j].val;
    const color = isGreater ? "red" : "green";

    const o1 = highlightArrayTL(getEl(i), color, tl);
    const o2 = highlightArrayTL(getEl(j), color, tl, "<");

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

    // delay
    tl.to({}, { duration: 0.25 });

    removeOverlayTL(o1, tl);
    removeOverlayTL(o2, tl, "<");

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

/* ============ Common Node Helpers ============ */

function edgeLine(
    px: number,
    py: number,
    cx: number,
    cy: number,
    r: number
) {
    const dx = cx - px;
    const dy = cy - py;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
        return { x1: px, y1: py, x2: cx, y2: cy };
    }

    const ux = dx / dist;
    const uy = dy / dist;

    return {
        x1: px + ux * r,
        y1: py + uy * r,
        x2: cx - ux * r,
        y2: cy - uy * r,
    };
}

/* ============ Linked List ============ */

export const highlightListTL = (
    node: SVGGElement,
    tl: GSAPTimeline,
    color: ColorType,
    position?: string,
) => {

    if (!node)
        throw new MissingElementError(`Missing node while highlighting`);

    tl.to(node, {
        stroke: color,
        duration: 0.25,
    }, position);

}

export const createNewListNode = (
    value: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
): SVGGElement => {

    const head = getEl(0);
    if (!head)
        throw new MissingElementError("Empty list");

    const clone = head.cloneNode(true) as SVGCircleElement;
    clone.setAttribute("opacity", "0");
    const newText = clone.querySelector("text");
    if (newText !== null) {
        newText.textContent = String(value);
    }
    clone.classList.add("temp");

    head.parentElement?.after(clone);

    const circ = head.querySelector("circle");
    if (!circ)
        throw new MissingElementError("Missing circle in head");
    const radius = gsap.getProperty(circ, "r") as number;
    const currentY = gsap.getProperty(head, "y") as number;
    tl.to(clone, {
        y: currentY + 4 * radius,
        duration: 0.25,
        opacity: 1
    });

    gsap.set(clone.querySelector("circle"), { stroke: "green" });

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

    return clone;
}

const animateArrowTL = (
    current: SVGGElement,
    tl: GSAPTimeline,
    position?: string | undefined,
) => {
    const line = current.parentElement?.querySelector("line") as SVGLineElement;
    line.classList.add("temp");

    const clone = line.cloneNode(false) as SVGLineElement;
    line.after(clone);
    const length = line.getTotalLength();

    tl.fromTo(clone,
        {
            strokeDasharray: length,
            strokeDashoffset: length,
            stroke: "yellow",
        },
        {
            strokeDashoffset: 0,
            duration: 0.125,
            ease: "none"
        },
        position
    );
    tl.to(clone, {
        strokeDashoffset: -length,
        duration: 0.125,
        ease: "none",
        onComplete: () => clone.remove(),
    });
}

export const highlightNodeTL = (
    el: SVGGElement,
    color: ColorType,
    tl: GSAPTimeline,
    position?: string | number,
) => {

    if (!el)
        return;

    const node = el.querySelector("circle") as SVGCircleElement;

    if (!node)
        throw new MissingElementError("Missing Circle");

    tl.to(node, {
        // css: {stroke: color},
        stroke: color,
        duration: 0.25,
    }, position);
}

export const moveNodeTL = (
    node: SVGGElement,
    pos: { x?: number, y?: number },
    tl: GSAPTimeline,
    position?: string | number,
) => {
    tl.to(node, {
        ...pos,
        duration: 0.25,
    }, position)


}

export const highlightNextTL = (
    current: SVGGElement | null,
    next: SVGGElement | null,
    originalColor: ColorType,
    highlightColor: ColorType,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
    position?: string | number,
) => {


    if (!current)
        throw new MissingElementError(`Missing current node`);
    if (!next)
        throw new MissingElementError(`Missing next node`);

    highlightNodeTL(current, originalColor, tl);

    tl.addLabel(position as string);

    animateArrowTL(current, tl, "<");

    highlightNodeTL(next, highlightColor, tl);

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
}

export const connectNodesTL = (
    from: SVGGElement | null,
    to: SVGGElement | null,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {
    if (!from)
        throw new MissingElementError("Missing from node");
    if (!to)
        throw new MissingElementError("Missing to node");

    const parent = from.parentElement;
    if (!parent)
        throw new MissingElementError("Batman");

    let line;
    if (from.classList.contains("temp")) {
        line = from.querySelector("line") as SVGLineElement;
    } else {
        line = parent.querySelector("line") as SVGLineElement;
    }

    if (!line) {
        if (!from.classList.contains("temp")) {
            console.log(line);
            console.log(parent);
            console.log(from);

        }
        line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );
        from.after(line);
        line.classList.add("temp");
        line.classList.add("temp-line");
    }

    const circ = to.querySelector("circle") as SVGCircleElement;
    if (!circ)
        throw new MissingElementError("No circle");

    const radius = gsap.getProperty(circ, "r") as number;

    const fromX = () => gsap.getProperty(from, "x") as number;
    const fromY = () => gsap.getProperty(from, "y") as number;

    const toX = () => gsap.getProperty(to, "x") as number;
    const toY = () => gsap.getProperty(to, "y") as number;

    // edgeLine is a function that gives me the coords of the line that starts
    // and ends at the edges of two circles, and not at their centers.
    const x1 = () => edgeLine(fromX(), fromY(), toX(), toY(), radius).x1;
    const y1 = () => edgeLine(fromX(), fromY(), toX(), toY(), radius).y1;
    const x2 = () => edgeLine(fromX(), fromY(), toX(), toY(), radius).x2;
    const y2 = () => edgeLine(fromX(), fromY(), toX(), toY(), radius).y2;

    tl.to(line, {
        attr: {
            x1: x1,
            y1: y1,
            x2: x1,
            y2: y1,
        },
        duration: 0.25,
    })

    tl.call(() => {
        line.setAttribute("marker-end", "url(#arrow)");
    })

    tl.to(line, {
        attr: {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
        },
        duration: 0.25,
    })

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

}

export const readjustListPositions = (
    array: DataItem[],
    targetIdx: number,
    newNode: SVGGElement,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
) => {

    const stagger = 0.125;
    let overlap = stagger;
    const circ = getEl(0)?.querySelector("circle") as SVGCircleElement;
    if (!circ)
        throw new MissingElementError("No circ");
    const r = gsap.getProperty(circ, "r") as number;

    for (let i = 0; i < targetIdx; i++) {
        const el = getEl(i) as SVGGElement;
        const x = gsap.getProperty(el, "x") as number - 2 * r;
        const y = gsap.getProperty(el, "y") as number;

        tl.to(el,
            {
                x: x, y: y,
                duration: 0.25,
            },
            // i === 0 ? "move" : `-=${overlap}`
            i === 0 ? "move" : `move+=${overlap}`
        );
        overlap += stagger;

        const nextLine = el.parentElement?.querySelector("line") as SVGLineElement;
        if (nextLine) {
            tl.to(
                nextLine,
                {
                    attr: { x1: x + r, y1: y },
                    duration: 0.25,
                },
                "<"
            )
        }
        const prevLine = getEl(i - 1)?.parentElement?.querySelector("line") as SVGLineElement;
        if (prevLine) {
            tl.to(
                prevLine,
                {
                    attr: { x2: x - r, y2: y },
                    duration: 0.25,
                },
                "<"
            )
        }
    }

    overlap = stagger;
    for (let i = array.length - 1; i >= targetIdx; i--) {
        const el = getEl(i) as SVGGElement;
        const circ = el.querySelector("circle") as SVGCircleElement;
        if (!circ)
            throw new MissingElementError("No circ");
        const r = gsap.getProperty(circ, "r") as number;
        const x = gsap.getProperty(el, "x") as number + 2 * r;
        const y = gsap.getProperty(el, "y") as number;

        tl.to(el, {
            x: x, y: y,
            duration: 0.25,
        },
            // i === array.length - 1 ? "move" : `-=${overlap}`
            i === array.length - 1 ? "move" : `move+=${overlap}`
        );
        overlap += stagger;

        const line = el.parentElement?.querySelector("line") as SVGLineElement;
        if (line) {
            tl.to(
                line,
                {
                    attr: { x1: x + r, y1: y },
                    duration: 0.25,
                },
                "<"
            )
        }

        const prevLine = getEl(i - 1)?.parentElement?.querySelector("line") as SVGLineElement ??
            newNode.parentElement?.querySelector(".temp-line") as SVGLineElement;
        // const prevLine = getEl(i - 1)?.parentElement?.querySelector("line") as SVGLineElement;
        if (prevLine && i !== targetIdx || targetIdx === 0) {
            tl.to(
                prevLine,
                {
                    attr: { x2: x - r, y2: y },
                    duration: 0.25,
                },
                "<"
            )
        }
    }

    const tempLine = newNode.parentElement?.querySelector(".temp-line") as SVGLineElement;
    if (!tempLine)
        throw new MissingElementError("Temporary line missing");

    let x;
    let nextLine;
    let prevLine;
    const y = gsap.getProperty(getEl(0) as SVGGElement, "y") as number;
    console.log(y);
    if (targetIdx === 0) {
        x = gsap.getProperty(getEl(0), "x") as number - 2 * r;
        nextLine = tempLine;
        prevLine = null;
    } else if (targetIdx === array.length) {
        x = gsap.getProperty(getEl(array.length - 1), "x") as number + 2 * r;
        nextLine = null;
        prevLine = tempLine;
    } else {
        const prev = getEl(targetIdx - 1);
        if (!prev)
            throw new MissingElementError("Pervious not found");
        x = gsap.getProperty(prev, "x") as number + 2 * r;
        nextLine = tempLine;
        prevLine = prev.parentElement?.querySelector("line") as SVGLineElement;
        if (!prevLine)
            throw new MissingElementError("Pervious Line not found");
    }
    console.log(nextLine);
    console.log(prevLine);

    tl.to(nextLine, {
        attr: {
            x2: x + 3 * r,
            y2: y,
        },
        duration: 0.25,
    }, "<")

    tl.to(nextLine, {
        attr: {
            x1: x + r,
            y1: y,
        },
        duration: 0.25,
    },)


    tl.to(prevLine, {
        attr: {
            x2: x - r,
            y2: y,
        },
        duration: 0.25,

    }, "<")

    tl.to(newNode, {
        x: x, y: y, duration: 0.25,
    }, "<")

}

export const deleteNodeListTL = (
    array: DataItem[],
    index: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {

    const toDeleteNode = getEl(index) as SVGGElement;
    if (!toDeleteNode)
        throw new MissingElementError("Target node not found");

    highlightNodeTL(toDeleteNode, "red", tl);
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    tl.to({}, { duration: 0.25 });

    let prevLine, nextLine;
    if (index > 0) {
        prevLine = getEl(index - 1)?.parentElement?.querySelector("line");
        if (!prevLine)
            throw new MissingElementError("Previous line not found");
    }
    if (index < array.length - 1) {
        nextLine = getEl(index)?.parentElement?.querySelector("line");
        if (!nextLine)
            throw new MissingElementError("Next line not found");
    }


    const r = gsap.getProperty(toDeleteNode.querySelector("circle"), "r") as number;
    tl.to(toDeleteNode, {
        y: `+=${4 * r}`
    });
    if (prevLine) {
        tl.to(prevLine, {
            attr: {
                y2: `+=${4 * r}`
            },
        }, "<");
    }
    if (nextLine) {
        tl.to(nextLine, {
            attr: {
                y1: `+=${4 * r}`
            },
        }, "<");
    }

    tl.to({}, { duration: 0.25 });

    if (index > 0 && index < array.length - 1) {
        connectNodesTL(getEl(index - 1), getEl(index + 1), tl, isTLPaused);
        tl.to({}, { duration: 0.25 });
    }

    if (nextLine) {
        const x = () => nextLine.x1.baseVal.value;
        const y = () => nextLine.y1.baseVal.value;
        tl.to(nextLine, {
            attr: {
                x2: x,
                y2: y,
            },
            opacity: 0,
            duration: 0.25,
        });
    }
    if (index === array.length - 1) {
        if (prevLine) {
            const x = () => prevLine.x1.baseVal.value;
            const y = () => prevLine.y1.baseVal.value;
            tl.to(prevLine, {
                attr: {
                    x2: x,
                    y2: y,
                },
                opacity: 0,
                duration: 0.25,
            });

        }
    }

    tl.to(toDeleteNode, {
        opacity: 0,
        duration: 0.25,
    }, "<")

}

export const adjustListDeletionTL = (
    array: DataItem[],
    index: number,
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
) => {

    const stagger = 0.1;
    let overlap = stagger;
    const r = gsap.getProperty(
        getEl(0)?.querySelector("circle") as SVGCircleElement, "r"
    ) as number;

    for (let i = index - 1; i >= 0; i--) {
        const el = getEl(i) as SVGGElement;
        if (!el)
            throw new MissingElementError(`Missing at index ${i}`);
        tl.to(el, {
            x: `+=${2 * r}`,
            duration: 0.25,
        }, i === index - 1 ? "move" : `move+=${overlap}`);
        overlap += stagger;

        const prevLine = getEl(i - 1)?.parentElement?.querySelector("line") as SVGLineElement;
        const nextLine = getEl(i)?.parentElement?.querySelector("line") as SVGLineElement;

        if (prevLine) {
            tl.to(prevLine, {
                attr: {
                    x2: `+=${2 * r}`,
                },
                duration: 0.25,
            }, "<")
        }
        if (nextLine) {
            tl.to(nextLine, {
                attr: {
                    x1: `+=${2 * r}`,
                },
                duration: 0.25,
            }, "<")
        }
    }

    overlap = stagger;

    for (let i = index + 1; i < array.length; i++) {
        const el = getEl(i) as SVGGElement;
        if (!el)
            throw new MissingElementError(`Missing at index ${i}`);
        tl.to(el, {
            x: `-=${2 * r}`,
            duration: 0.25,
        }, i === index + 1 ? "move" : `move+=${overlap}`);
        overlap += stagger;

        const prevLine = i === index + 1
            ? getEl(i - 2)?.parentElement?.querySelector("line") as SVGLineElement
            : getEl(i - 1)?.parentElement?.querySelector("line") as SVGLineElement;
        const nextLine = getEl(i)?.parentElement?.querySelector("line") as SVGLineElement;

        if (prevLine) {
            tl.to(prevLine, {
                attr: {
                    x2: `-=${2 * r}`,
                },
                duration: 0.25,
            }, "<")
        }
        if (nextLine) {
            tl.to(nextLine, {
                attr: {
                    x1: `-=${2 * r}`,
                },
                duration: 0.25,
            }, "<")
        }
    }

    return tl;
}