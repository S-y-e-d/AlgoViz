import type { RefObject } from "react";
import type {
    AlgorithmParams,
    DataItem,
    GetNodeByIndex,
} from "../App";
import {
    compareGTTL,
    createSplitArrayTL,
    highlightTempRectTL,
    highlightArrayTL,
    MissingElementError,
    moveAndSetText,
    removeOverlayTL,
    removeSplitArrayTL,
    setValueTL,
    shiftTL,
    swapTL,
    type ClonedGroup
} from "./helper";
import gsap from "gsap";

const verifyParam = (param: number | undefined) => {
    if (param === undefined)
        throw new Error("Missing parameter");
    return param;
}

export const insertionArrayTL = (
    { array, value, index, getNode, isTLPaused }: AlgorithmParams,

): GSAPTimeline => {
    index = verifyParam(index);
    value = verifyParam(index);
    if (index >= array.length) {
        throw new Error(`Index ${index} out of bounds`);
    }
    const tl = gsap.timeline();
    for (let i = array.length - 2; i >= index; i--) {
        const o = highlightArrayTL(getNode(i), "yellow", tl);
        shiftTL(array, i, 1, getNode, tl, isTLPaused);
        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });
        removeOverlayTL(o, tl);
    }

    setValueTL(value, index, getNode, tl);
    return tl;

}

export const deletionArrayTL = (
    { array, index, getNode, isTLPaused }: AlgorithmParams,

): GSAPTimeline => {
    index = verifyParam(index);
    if (index >= array.length) {
        throw new Error(`Index ${index} out of bounds`);
    }
    const tl = gsap.timeline();
    for (let i = index + 1; i < array.length; i++) {
        const o = highlightArrayTL(getNode(i), "orange", tl);
        shiftTL(array, i, -1, getNode, tl, isTLPaused);
        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
        removeOverlayTL(o, tl);
    }

    setValueTL(0, array.length - 1, getNode, tl);
    return tl;

}

export const linearSearchTL = (
    { array, value, getNode, isTLPaused }: AlgorithmParams,
) => {
    value = verifyParam(value);
    const tl = gsap.timeline();
    let compHighlight;
    for (let i = 0; i < array.length; i++) {
        const o = highlightArrayTL(getNode(i), "yellow", tl);
        if (array[i].val === value) {
            compHighlight = highlightArrayTL(getNode(i), "green", tl);
            break;
        } else {
            compHighlight = highlightArrayTL(getNode(i), "red", tl);
        }
        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });
        removeOverlayTL(o, tl);
        removeOverlayTL(compHighlight, tl);
    }
    return tl;
}

export const binarySearchTL = (
    { array, value, getNode, isTLPaused }: AlgorithmParams,
) => {

    value = verifyParam(value);
    const tl = gsap.timeline();
    let compHighlight;
    let i = 0;
    let j = array.length - 1;
    while (i <= j) {
        const mid = Math.floor((i + j) / 2);

        const o1 = highlightArrayTL(getNode(i), "yellow", tl);
        const o2 = highlightArrayTL(getNode(j), "orange", tl, "<");
        const o3 = highlightArrayTL(getNode(mid), "blue", tl, "<");

        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });

        let found = false;
        if (array[mid].val === value) {
            compHighlight = highlightArrayTL(getNode(mid), "green", tl);
            found = true;
        } else {
            compHighlight = highlightArrayTL(getNode(mid), "red", tl);
        }

        tl.to({}, { duration: 0.25 });
        tl.call(() => { if (isTLPaused.current === true) tl.pause(); });

        removeOverlayTL(o1, tl);
        removeOverlayTL(o2, tl, "<");
        removeOverlayTL(o3, tl, "<");
        if (found) break;
        removeOverlayTL(compHighlight, tl, "<");
        if (array[mid].val < value) {
            i = mid + 1;
        } else {
            j = mid - 1;
        }
    }
    return tl;
}

export const bubbleSortTL = (
    { array, getNode, isTLPaused }: AlgorithmParams,

): GSAPTimeline => {
    const tl = gsap.timeline();
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {

            // add < at the end to synchronize with the previous 
            const o1 = highlightArrayTL(getNode(j), "yellow", tl);
            const o2 = highlightArrayTL(getNode(j + 1), "orange", tl, "<");

            // wait
            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

            const isGT = compareGTTL(j, j + 1, array, getNode, tl, isTLPaused);
            if (isGT) {
                swapTL(array, j, j + 1, getNode, tl, isTLPaused);
            }

            removeOverlayTL(o1, tl);
            removeOverlayTL(o2, tl, "<");
        }
    }

    return tl;
};

export const insertionSortTL = (
    { array, getNode, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {
    const tl = gsap.timeline();

    for (let i = 1; i < array.length; i++) {
        let j = i;

        while (j > 0) {
            const o1 = highlightArrayTL(getNode(j), "yellow", tl);
            const o2 = highlightArrayTL(getNode(j - 1), "orange", tl, "<");

            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current) tl.pause(); });

            const isGT = compareGTTL(j - 1, j, array, getNode, tl, isTLPaused);

            if (!isGT) {
                removeOverlayTL(o1, tl);
                removeOverlayTL(o2, tl, "<");
                break;
            }

            swapTL(array, j - 1, j, getNode, tl, isTLPaused);

            removeOverlayTL(o1, tl);
            removeOverlayTL(o2, tl, "<");

            j--;
        }
    }

    return tl;
};

// fix this, AI did bad job
export const selectionSortTL = (
    { array, getNode, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {
    const tl = gsap.timeline();

    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        const o1 = highlightArrayTL(getNode(i), "yellow", tl);
        let minHighlight = highlightArrayTL(getNode(minIndex), "blue", tl);
        for (let j = i + 1; j < array.length; j++) {
            const o2 = highlightArrayTL(getNode(j), "orange", tl);

            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current) tl.pause(); });

            const isGT = array[minIndex].val > array[j].val;

            if (isGT) {
                minIndex = j;
                removeOverlayTL(minHighlight, tl);
                minHighlight = highlightArrayTL(getNode(minIndex), "blue", tl);
            }

            removeOverlayTL(o2, tl);
            tl.to({}, { duration: 0.25 });
            tl.call(() => { if (isTLPaused.current) tl.pause(); });

        }
        removeOverlayTL(o1, tl, "<");
        removeOverlayTL(minHighlight, tl, "<");

        if (minIndex !== i) {
            swapTL(array, i, minIndex, getNode, tl, isTLPaused);
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
    getNode: GetNodeByIndex,
    tl: GSAPTimeline,
    isTLPaused: RefObject<boolean>,
) => {
    const leftArray = structuredClone(array.slice(left, mid))
    const rightArray = structuredClone(array.slice(mid, right))

    let i = left;
    let j = mid;
    let k = left;

    while (i < mid && j < right) {

        const trueText = getNode(k)?.querySelector("text");
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
        tl.to({}, { duration: 0.25 });
        moveAndSetText(array, k, targetVal, movedObj.text, trueText, tl, isTLPaused);
        highlightTempRectTL(movedObj.rect, ogColor, tl);
        k += 1;
    }

    while (i < mid) {

        const trueText = getNode(k)?.querySelector("text");
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
        const trueText = getNode(k)?.querySelector("text");
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
    { array, getNode, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {
    const tl = gsap.timeline();

    const n = array.length;

    // const tempArray = createSplitArrayTL(2, array.length, getNode, tl, isTLPaused);
    for (let size = 1; size < n; size *= 2) {
        const tempArray = createSplitArrayTL(array, size, getNode, tl, isTLPaused);
        for (let left = 0; left < n; left += 2 * size) {
            const mid = Math.min(left + size, n);
            const right = Math.min(left + 2 * size, n);
            mergeSplitArray(array, left, mid, right, tempArray, getNode, tl, isTLPaused);
        }
        tl.to({}, { duration: 0.25 });
        removeSplitArrayTL(tempArray, tl);
    }

    return tl;
}

export const arrayAnimBuilder = {
    insertion: insertionArrayTL,
    deletion: deletionArrayTL,
    linearSearch: linearSearchTL,
    binarySearch: binarySearchTL,
    bubbleSort: bubbleSortTL,
    selectionSort: selectionSortTL,
    insertionSort: insertionSortTL,
    mergeSort: mergeSortTL,
};