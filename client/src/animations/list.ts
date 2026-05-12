import gsap from "gsap";
import {
    connectNodesTL,
    createNewListNode,
    highlightNextTL,
    highlightNodeTL,
    MissingElementError,
    moveNodeTL,
    adjustListInsertionTL,
    deleteNodeListTL,
    adjustListDeletionTL,
    verifyParam
} from "./helper";
import type { AlgorithmParams, ColorType } from "../App";

const insertListTL = (
    { array, value, index, getNode, getEdge, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {

    value = verifyParam(value);
    index = verifyParam(index);

    if (index > array.length || index < 0)
        throw new Error("Index out of bounds");

    const tl = gsap.timeline();

    const head = getNode(0);
    if (!head)
        throw new MissingElementError("Empty list");

    const originalColor = gsap.getProperty(head.querySelector("circle"), "stroke") as ColorType;

    highlightNodeTL(head, "yellow", tl);
    const temp = createNewListNode(value, getNode, tl, isTLPaused);

    // travel to the target
    for (let i = 0; i < index - 1; i++) {

        const next = getNode(i + 1);
        const x = gsap.getProperty(next, "x") as number;
        tl.addLabel("moveStep");
        highlightNextTL(getNode(i), getEdge(i), next, originalColor, "yellow", tl, isTLPaused, "moveStep");
        moveNodeTL(temp, { x }, tl, "moveStep");
        tl.to({}, { duration: 0.25 });
    }

    // connect node pointers
    const prev = getNode(index - 1);
    const next = getNode(index);
    if (next)
        connectNodesTL(temp, next, tl, isTLPaused);
    // combine the two things, so we can connect both nodes
    tl.to({}, { duration: 0.25 });

    if (prev)
        connectNodesTL(prev, temp, tl, isTLPaused);
    highlightNodeTL(getNode(index - 1) as SVGGElement, originalColor, tl);

    adjustListInsertionTL(array, index, temp, getNode, getEdge, tl);

    return tl;
}

const deletionListTL = (
    { array, index, getNode, getEdge, isTLPaused }: AlgorithmParams
): GSAPTimeline => {

    index = verifyParam(index);
    if (index > array.length || index < 0)
        throw new Error("Index out of bounds");

    const tl = gsap.timeline();

    const head = getNode(0) as SVGGElement;
    if (!head)
        throw new MissingElementError("Empty list");

    const originalColor = gsap.getProperty(head.querySelector("circle"), "stroke") as ColorType;

    highlightNodeTL(head, "yellow", tl);
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

    // traverse
    for (let i = 0; i < index - 1; i++) {

        const next = getNode(i + 1);
        tl.addLabel("moveStep");
        highlightNextTL(getNode(i), getEdge(i), next, originalColor, "yellow", tl, isTLPaused, "moveStep");
        tl.to({}, { duration: 0.25 });
    }

    deleteNodeListTL(array, index, getNode, getEdge, tl, isTLPaused);
    tl.to({}, { duration: 0.25 });

    adjustListDeletionTL(array, index, getNode, getEdge, tl);

    return tl;
}
export const listAnimBuilder = {
    insertion: insertListTL,
    deletion: deletionListTL,
}