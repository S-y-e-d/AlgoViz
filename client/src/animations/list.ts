import gsap from "gsap";
import { connectNodesTL, createNewListNode, highlightNextTL, highlightNodeTL, MissingElementError, moveNodeTL, readjustListPositions as adjustListInsertionTL, deleteNodeListTL, adjustListDeletionTL } from "./helper";
import type { AlgorithmParams, ColorType } from "../App";

const verifyParam = (param: number | undefined) => {
    if (param === undefined)
        throw new Error("Missing parameter");
    return param;
}

const insertListTL = (
    { array, value, index, getEl, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {

    value = verifyParam(value);
    index = verifyParam(index);

    if (index > array.length || index < 0)
        throw new Error("Index out of bounds");

    const tl = gsap.timeline();

    const head = getEl(0);
    if (!head)
        throw new MissingElementError("Empty list");

    const originalColor = gsap.getProperty(head.querySelector("circle"), "stroke") as ColorType;

    highlightNodeTL(head, "yellow", tl);
    const temp = createNewListNode(value, getEl, tl, isTLPaused);

    // travel to the target
    for (let i = 0; i < index - 1; i++) {

        const next = getEl(i + 1);
        const x = gsap.getProperty(next, "x") as number;
        tl.addLabel("moveStep");
        highlightNextTL(getEl(i), next, originalColor, "yellow", tl, isTLPaused, "moveStep");
        moveNodeTL(temp, { x }, tl, "moveStep");
        tl.to({}, { duration: 0.25 });
    }

    // connect node pointers
    const prev = getEl(index - 1);
    const next = getEl(index);
    if (next)
        connectNodesTL(temp, next, tl, isTLPaused);
    // combine the two things, so we can connect both nodes
    tl.to({}, { duration: 0.25 });

    if (prev)
        connectNodesTL(prev, temp, tl, isTLPaused);
    highlightNodeTL(getEl(index - 1) as SVGGElement, originalColor, tl);

    adjustListInsertionTL(array, index, temp, getEl, tl);

    return tl;
}

const deletionListTL = (
    { array, index, getEl, isTLPaused }: AlgorithmParams
): GSAPTimeline => {

    index = verifyParam(index);
    if (index > array.length || index < 0)
        throw new Error("Index out of bounds");

    const tl = gsap.timeline();

    const head = getEl(0) as SVGGElement;
    if (!head)
        throw new MissingElementError("Empty list");

    const originalColor = gsap.getProperty(head.querySelector("circle"), "stroke") as ColorType;

    highlightNodeTL(head, "yellow", tl);
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

    // traverse
    for (let i = 0; i < index - 1; i++) {

        const next = getEl(i + 1);
        tl.addLabel("moveStep");
        highlightNextTL(getEl(i), next, originalColor, "yellow", tl, isTLPaused, "moveStep");
        tl.to({}, { duration: 0.25 });
    }

    deleteNodeListTL(array, index, getEl, tl, isTLPaused);
    tl.to({}, { duration: 0.25 });

    adjustListDeletionTL(array, index, getEl, tl);

    return tl;
}
export const listAnimBuilder = {
    insertion: insertListTL,
    deletion: deletionListTL,
    linearSearch: () => null,
    binarySearch: () => null,
    bubbleSort: () => null,
    selectionSort: () => null,
    insertionSort: () => null,
    mergeSort: () => null,
}