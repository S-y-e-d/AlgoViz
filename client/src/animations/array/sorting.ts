import gsap from "gsap";
import type { GetElementByIndex } from "../../App"
export const bubbleSort = async (array: number[], getElementByIndex: GetElementByIndex) => {
    // test code to highlight all
    for (let i = 0; i < array.length; i++) {
        const el = getElementByIndex(i);
        if (!el) continue;

        const rect = el.querySelector("rect");
        if (!rect) continue;

        // highlight
        await new Promise<void>((resolve) => {
            gsap.to(rect, {
                fill: "yellow",
                duration: 0.25,
                onComplete: resolve,
            });
        });

        // wait a bit (so it's visible)
        await new Promise((r) => setTimeout(r, 250));

        // revert (optional)
        await new Promise<void>((resolve) => {
            gsap.to(rect, {
                fill: "",
                duration: 0.25,
                onComplete: resolve,
            });
        });

    }
}