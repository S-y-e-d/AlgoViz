import type { ViewProps } from "../../App";

export const ListView = ({ size, data, nodeRefs }: ViewProps) => {
    const dataCopy = data.filter(item => !isNaN(item.val));

    const setNodeRef = (index: number, el: SVGGElement | null) => {
        const existing = nodeRefs.current.get(index);
        let edge = null;
        if(existing) 
            edge = existing.edge;

        if (el) {
            nodeRefs.current.set(index, {node: el, edge: edge });
        } else {
            if(existing)
                existing.node = null;
            if (!existing?.edge) nodeRefs.current.delete(index);
        }
    }

    const setEdgeRef = (index: number, el: SVGLineElement | null) => {
        const existing = nodeRefs.current.get(index);
        let node = null;
        if (existing)
            node = existing.node;
        

        if (el) {
            nodeRefs.current.set(index, {node: node, edge: el});
        } else {
            if(existing)
                existing.edge = null;
            if (!existing?.node) nodeRefs.current.delete(index);
        }
    }
    return (
        <>
            {
                dataCopy.map((item, index) => {
                    const structureSize = (2 * dataCopy.length - 1) * size;
                    const structureStart = (1000 - structureSize) / 2;
                    const x = structureStart + 2 * size * index + size / 2;
                    const y = (1000) / 2;

                    const fontSize = Math.min(
                        size * 0.5,
                        (size * 0.8) / String(item.val).length * 1.5
                    );
                    return (
                        <g key={item.id}>
                            <g
                                ref={(e) => setNodeRef(index, e)}
                                transform={`translate(${x}, ${y})`}
                            >
                                <circle
                                    r={size / 2}
                                // transform={`translate(${x}, ${y})`}
                                />
                                <text
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fontSize={fontSize}
                                >
                                    {item.val}
                                </text>
                            </g>
                            {index < dataCopy.length - 1 &&
                                <line
                                    ref={(e) => setEdgeRef(index, e)}
                                    x1={x + size / 2}
                                    y1={y}
                                    x2={x + 3 * size / 2}
                                    y2={y}
                                    markerEnd="url(#arrow)"
                                />}
                        </g>
                    );
                })
            }
        </>
    )
}