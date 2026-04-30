import type { RefObject } from "react";
import type { DataItem, GetElementByIndex } from "../../App";
import { compareGTTL, highlightTL, removeOverlayTL, setValueTL, shiftTL, swapTL } from "./helper";
import gsap from "gsap";

export const insertionTL = (
    array: DataItem[],
    value: number,
    index: number,
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>

): GSAPTimeline => {
    if (index >= array.length) {
        throw new Error(`Index ${index} out of bounds`);
    }
    const tl = gsap.timeline();
    for (let i = array.length - 2; i >= index; i--) {
        const o = highlightTL(tl, i, getEl, "yellow");
        shiftTL(array, i, 1, getEl, tl, isTLPaused);
        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });
        removeOverlayTL(tl, o);
    }

    setValueTL(array, value, index, getEl, tl);
    return tl;

}

export const bubbleSortTL = (
    array: DataItem[],
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>
): GSAPTimeline => {
    const tl = gsap.timeline();
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {

            // add < at the end to synchronize with the previous 
            const o1 = highlightTL(tl, j, getEl, "yellow");
            const o2 = highlightTL(tl, j + 1, getEl, "orange", "<");

            // wait
            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

            const isGT = compareGTTL(tl, j, j + 1, array, getEl, isTLPaused);
            if (isGT) {
                swapTL(array, j, j + 1, getEl, tl, isTLPaused);
            }

            removeOverlayTL(tl, o1);
            removeOverlayTL(tl, o2, "<");
        }
    }

    return tl;
};
