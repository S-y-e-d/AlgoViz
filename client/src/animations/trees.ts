import gsap from "gsap"
import type {
    AlgorithmParams,
    ColorType,
    DataItem,
    GetEdgeByIndex,
    GetNodeByIndex
} from "../App";
import { animateArrowTL, displayTempNode, getViewBoxLeftOffset, highlightNodeTL, left, MissingElementError, right } from "./helper";

const preorderRec = (
    array: DataItem[],
    current: number,
    getNode: GetNodeByIndex,
    getEdge: GetEdgeByIndex,
    tl: GSAPTimeline,
    isTLPaused: React.RefObject<boolean>,
    pos: {x: number, y:number},
) => {
    if (current >= array.length)
        return;
    if (isNaN(array[current].val))
        return;

    const node = getNode(current);
    if (!node)
        throw new MissingElementError("Could not find node");

    animateArrowTL(getEdge(current), tl, undefined, false);

    highlightNodeTL(node, "yellow" as ColorType, tl);
    tl.to({}, { duration: 0.25 });

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    if (document.documentElement.classList.contains("light")) {
        tl.call(() => node.classList.toggle("dark"))
    } else {
        tl.call(() => node.classList.toggle("light"))
    }
    
    displayTempNode(node, pos, tl);
    pos.x += 2*pos.y - 20;

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })

    preorderRec(array, left(current), getNode, getEdge, tl, isTLPaused, pos);
    preorderRec(array, right(current), getNode, getEdge, tl, isTLPaused, pos);

    animateArrowTL(getEdge(current), tl, undefined, true);
}

const preorderTL = (
    { array, getNode, getEdge, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {
    const tl = gsap.timeline();

    const canvas = document.querySelector("#canvas") as SVGSVGElement;
    if(!canvas)
        throw new MissingElementError("Canvas not found");

    // finding out the true left edge of the svg canvas
    const left = getViewBoxLeftOffset(canvas);
    const r = gsap.getProperty(getNode(0)?.querySelector("circle") as SVGCircleElement, "r") as number;
    const pos = {x: left+r+10, y:r+10}
    preorderRec(array, 0, getNode, getEdge, tl, isTLPaused, pos);


    return tl;
}

const inorderRec = (
    array: DataItem[],
    current: number,
    getNode: GetNodeByIndex,
    getEdge: GetEdgeByIndex,
    tl: GSAPTimeline,
    isTLPaused: React.RefObject<boolean>,
    pos: {x: number, y:number},
) => {
    if (current >= array.length)
        return;
    if (isNaN(array[current].val))
        return;

    const node = getNode(current);
    if (!node)
        throw new MissingElementError("Could not find node");


    animateArrowTL(getEdge(current), tl, undefined, false);

    highlightNodeTL(node, "yellow" as ColorType, tl);

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    inorderRec(array, left(current), getNode, getEdge, tl, isTLPaused, pos);

    tl.to({}, { duration: 0.25 });
    if (document.documentElement.classList.contains("light")) {
        tl.call(() => node.classList.toggle("dark"))
    } else {
        tl.call(() => node.classList.toggle("light"))
    }

    displayTempNode(node, pos, tl);
    pos.x += 2*pos.y - 20;
     
    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })


    inorderRec(array, right(current), getNode, getEdge, tl, isTLPaused, pos);

    // tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    animateArrowTL(getEdge(current), tl, undefined, true);
}

const inorderTL = (
    { array, getNode, getEdge, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {
    const tl = gsap.timeline();

    const canvas = document.querySelector("#canvas") as SVGSVGElement;
    if(!canvas)
        throw new MissingElementError("Canvas not found");
    const left = getViewBoxLeftOffset(canvas);
    const r = gsap.getProperty(getNode(0)?.querySelector("circle") as SVGCircleElement, "r") as number;
    const pos = {x: left+r+10, y:r+10}
    inorderRec(array, 0, getNode, getEdge, tl, isTLPaused, pos);


    return tl;
}

const postorderRec = (
    array: DataItem[],
    current: number,
    getNode: GetNodeByIndex,
    getEdge: GetEdgeByIndex,
    tl: GSAPTimeline,
    isTLPaused: React.RefObject<boolean>,
    pos: {x: number, y:number},
) => {
    if (current >= array.length)
        return;
    if (isNaN(array[current].val))
        return;

    const node = getNode(current);
    if (!node)
        throw new MissingElementError("Could not find node");


    animateArrowTL(getEdge(current), tl, undefined, false);

    highlightNodeTL(node, "yellow" as ColorType, tl);

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    postorderRec(array, left(current), getNode, getEdge, tl, isTLPaused, pos);
    postorderRec(array, right(current), getNode, getEdge, tl, isTLPaused, pos);

    tl.to({}, { duration: 0.25 });
    if (document.documentElement.classList.contains("light")) {
        tl.call(() => node.classList.toggle("dark"))
    } else {
        tl.call(() => node.classList.toggle("light"))
    }

    displayTempNode(node, pos, tl);
    pos.x += 2*pos.y - 20;

    tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    // tl.call(() => { if (isTLPaused.current === true) tl.pause(); })
    animateArrowTL(getEdge(current), tl, undefined, true);
}

const postorderTL = (
    { array, getNode, getEdge, isTLPaused }: AlgorithmParams,
): GSAPTimeline => {
    const tl = gsap.timeline();

    
    const canvas = document.querySelector("#canvas") as SVGSVGElement;
    if(!canvas)
        throw new MissingElementError("Canvas not found");
    const left = getViewBoxLeftOffset(canvas);
    const r = gsap.getProperty(getNode(0)?.querySelector("circle") as SVGCircleElement, "r") as number;
    const pos = {x: left+r+10, y:r+10}
    postorderRec(array, 0, getNode, getEdge, tl, isTLPaused, pos);


    return tl;
}

export const treeAnimBuilder = {
    preorder: preorderTL,
    inorder: inorderTL,
    postorder: postorderTL,

}