import type { RefObject } from "react";
import type { DataItem, GetElementByIndex } from "../../App";
import { compareGTTL, createSplitArrayTL, highlightTempRectTL, highlightTL, MissingElementError, moveAndSetText, removeOverlayTL, removeSplitArrayTL, setValueTL, shiftTL, swapTL, type ClonedGroup } from "./helper";
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

    setValueTL(value, index, getEl, tl);
    return tl;

}

export const deletionTL = (
    array: DataItem[],
    index: number,
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>

): GSAPTimeline => {
    if (index >= array.length) {
        throw new Error(`Index ${index} out of bounds`);
    }
    const tl = gsap.timeline();
    for (let i = index + 1; i < array.length; i++) {
        const o = highlightTL(tl, i, getEl, "orange");
        shiftTL(array, i, -1, getEl, tl, isTLPaused);
        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
        removeOverlayTL(tl, o);
    }

    setValueTL(0, array.length - 1, getEl, tl);
    return tl;

}

export const linearSearchTL = (
    array: DataItem[],
    value: number,
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>
) => {

    const tl = gsap.timeline();
    let compHighlight;
    for (let i = 0; i < array.length; i++) {
        const o = highlightTL(tl, i, getEl, "yellow");
        if (array[i].val === value) {
            compHighlight = highlightTL(tl, i, getEl, "green");
            break;
        } else {
            compHighlight = highlightTL(tl, i, getEl, "red");
        }
        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });
        removeOverlayTL(tl, o);
        removeOverlayTL(tl, compHighlight);
    }
    return tl;
}

export const binarySearchTL = (
    array: DataItem[],
    value: number,
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>
) => {

    const tl = gsap.timeline();
    let compHighlight;
    let i = 0;
    let j = array.length - 1;
    while (i <= j) {
        const mid = Math.floor((i + j) / 2);

        const o1 = highlightTL(tl, i, getEl, "yellow");
        const o2 = highlightTL(tl, j, getEl, "orange", "<");
        const o3 = highlightTL(tl, mid, getEl, "blue", "<");

        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });

        if (array[mid].val === value) {
            compHighlight = highlightTL(tl, mid, getEl, "green");
            break;
        } else {
            compHighlight = highlightTL(tl, mid, getEl, "red");
        }

        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });

        removeOverlayTL(tl, o1);
        removeOverlayTL(tl, o2, "<");
        removeOverlayTL(tl, o3, "<");
        removeOverlayTL(tl, compHighlight, "<");
        if (array[mid].val < value) {
            i = mid + 1;
        } else {
            j = mid - 1;
        }
    }
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

export const insertionSortTL = (
    array: DataItem[],
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>
): GSAPTimeline => {
    const tl = gsap.timeline();

    for (let i = 1; i < array.length; i++) {
        let j = i;

        while (j > 0) {
            const o1 = highlightTL(tl, j, getEl, "yellow");
            const o2 = highlightTL(tl, j - 1, getEl, "orange", "<");

            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current) tl.pause(); });

            const isGT = compareGTTL(tl, j - 1, j, array, getEl, isTLPaused);

            if (!isGT) {
                removeOverlayTL(tl, o1);
                removeOverlayTL(tl, o2, "<");
                break;
            }

            swapTL(array, j - 1, j, getEl, tl, isTLPaused);

            removeOverlayTL(tl, o1);
            removeOverlayTL(tl, o2, "<");

            j--;
        }
    }

    return tl;
};

// fix this, AI did bad job
export const selectionSortTL = (
    array: DataItem[],
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>
): GSAPTimeline => {
    const tl = gsap.timeline();

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        const o1 = highlightTL(tl, i, getEl, "yellow");
        let minHighlight = highlightTL(tl, minIndex, getEl, "blue");
        for (let j = i + 1; j < array.length; j++) {
            const o2 = highlightTL(tl, j, getEl, "orange");

            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current) tl.pause(); });

            const isGT = array[minIndex].val > array[j].val;

            if (isGT) {
                minIndex = j;
                removeOverlayTL(tl, minHighlight);
                minHighlight = highlightTL(tl, minIndex, getEl, "blue");
            }

            removeOverlayTL(tl, o2);
            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current) tl.pause(); });

        }
        removeOverlayTL(tl, o1, "<");
        removeOverlayTL(tl, minHighlight, "<");

        if (minIndex !== i) {
            swapTL(array, i, minIndex, getEl, tl, isTLPaused);
        }
    }

    return tl;
};

const mergeSplitArray = (
    array: DataItem[],
    left: number,
    mid: number,
    right: number,
    cloneArray: ClonedGroup[],
    getEl: GetElementByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {
    const leftArray = structuredClone(array.slice(left, mid))
    const rightArray = structuredClone(array.slice(mid, right))

    let i = left;
    let j = mid;
    let k = left;

    while (i < mid && j < right) {

        const trueText = getEl(k)?.querySelector("text");
        if (!trueText)
            throw new MissingElementError(`Mssing text element at ${k}`);

        const obj1 = cloneArray[i];
        const obj2 = cloneArray[j];
        let movedObj;
        let targetVal;
        const ogColor = highlightTempRectTL(obj1.rect, "yellow", tl);
        highlightTempRectTL(obj2.rect, "orange", tl, "<");


        if (leftArray[i - left].val <= rightArray[j - mid].val) {
            movedObj = obj1;
            targetVal = leftArray[i - left].val;
            i += 1;
        } else {
            movedObj = obj2;
            targetVal = rightArray[j - mid].val;
            j += 1;
        }
        const tempColor = highlightTempRectTL(movedObj.rect, "green", tl);
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
        highlightTempRectTL(movedObj.rect, tempColor, tl);
        moveAndSetText(array, k, targetVal, movedObj.text, trueText, tl, isTLPaused);
        highlightTempRectTL(movedObj.rect, ogColor, tl);
        k += 1;
    }

    while (i < mid) {

        const trueText = getEl(k)?.querySelector("text");
        const clonedText = cloneArray[i].text;
        const targetVal = leftArray[i - left].val;
        if (!trueText)
            throw new MissingElementError(`Mssing text element at ${k}`);

        const ogColor = highlightTempRectTL(cloneArray[i].rect, "yellow", tl);

        moveAndSetText(array, k, targetVal, clonedText, trueText, tl, isTLPaused);

        highlightTempRectTL(cloneArray[i].rect, ogColor, tl);
        k += 1;
        i += 1;
    }

    while (j < right) {
        const trueText = getEl(k)?.querySelector("text");
        const clonedText = cloneArray[j].text;
        const targetVal = rightArray[j - mid].val;
        if (!trueText)
            throw new MissingElementError(`Mssing text element at ${k}`);

        const ogColor = highlightTempRectTL(cloneArray[j].rect, "orange", tl);

        moveAndSetText(array, k, targetVal, clonedText, trueText, tl, isTLPaused);

        highlightTempRectTL(cloneArray[j].rect, ogColor, tl);
        k += 1;
        j += 1;
    }
}

export const mergeSortTL = (
    array: DataItem[],
    getEl: GetElementByIndex,
    isTLPaused: RefObject<boolean>
): GSAPTimeline => {
    const tl = gsap.timeline();

    const n = array.length;

// const tempArray = createSplitArrayTL(2, array.length, getEl, tl, isTLPaused);
    for (let size = 1; size < n; size *= 2) {
        const tempArray = createSplitArrayTL(array, size,  getEl, tl, isTLPaused);
        for (let left = 0; left < n; left += 2 * size) {
            const mid = Math.min(left + size, n);
            const right = Math.min(left + 2 * size, n);
            mergeSplitArray(array, left, mid, right, tempArray, getEl, tl, isTLPaused);
        }
        tl.to({}, {duration: 0.25});
        removeSplitArrayTL(tempArray, tl);
    }

    return tl;
}

export const mergeSortCleaner = () => {

}