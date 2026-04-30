import type { ViewProps } from "../../App";

const left = (current: number) => {
    return current * 2 + 1;
}
const right = (current: number) => {
    return current * 2 + 2;
}
const parent = (current: number) => {
    if (current === 0) return 0;
    return Math.floor((current - 1) / 2)
}

const getSubTreeWidth = (current: number, data: number[], dataWidth: number[]): number => {
    if (current >= data.length || data[current] === -1) {
        return 0;
    }
    const current_width = getSubTreeWidth(left(current), data, dataWidth) + getSubTreeWidth(right(current), data, dataWidth) + 1;
    // current_width = Math.max(1, current_width);
    dataWidth[current] = current_width;
    return current_width;

}


function computeXCoordinates(arr: number[], size: number): number[] {
    const n = arr.length;
    const x: number[] = new Array(n).fill(-1);
    let nextX = 0;

    const diameter = size;
    const gap = size;
    const spacing = diameter + gap;

    function dfs(i: number | null): number {
        if (i === null || i >= n || isNaN(arr[i])) return -1;

        const l = left(i);
        const r = right(i);

        const hasLeft = l < n && !isNaN(arr[l]);
        const hasRight = r < n && !isNaN(arr[r]);

        if (!hasLeft && !hasRight) {
            const pos = nextX * spacing;
            x[i] = pos;
            nextX++;
            return pos;
        }

        const leftX = hasLeft ? dfs(l) : -1;
        const rightX = hasRight ? dfs(r) : -1;

        let pos: number;

        if (hasLeft && hasRight) {
            pos = (leftX + rightX) / 2;
        } else if (hasLeft) {
            pos = leftX;
        } else {
            pos = rightX;
        }

        x[i] = pos;
        return pos;
    }

    dfs(0);
    return x;
}

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

export const TreeView = ({ size, data }: ViewProps) => {
    const dataWidth: number[] = new Array(data.length).fill(0);
    const dataValues = data.map(item => item.val);
    getSubTreeWidth(0, dataValues, dataWidth);
    const xPositions = computeXCoordinates(dataValues, size);
    const startX = (1000 - (Math.max(...xPositions) - Math.min(...xPositions))) / 2;
    const startY = (1000 - (2 * Math.floor(Math.log2(data.length)) - 1) * size) / 2;

    return (
        <>
            {
                data.map((item, index) => {
                    const x = startX + xPositions[index];
                    const y = startY + 2 * size * Math.floor(Math.log2(index + 1));
                    const fontSize = Math.min(
                        size * 0.5,
                        (size * 0.8) / String(item.val).length * 1.5
                    );
                    if (isNaN(item.val)) {
                        return;
                    }
                    const parent2 = parent(index);
                    const px = startX + xPositions[parent2];
                    const py = startY + 2 * size * Math.floor(Math.log2(parent2 + 1));
                    const { x1, y1, x2, y2 } = edgeLine(x, y, px, py, size / 2);
                    console.log(data)
                    return (
                        <g key={item.id}>
                            <circle r={size / 2} cx={x} cy={y} />
                            <text
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={fontSize}
                            >
                                {item.val}
                            </text>
                            <line x1={x1} y1={y1} x2={x2} y2={y2} />
                        </g>
                    );
                })
            }
        </>
    )
}