import type { ViewProps } from "../../App";

export const ArrayView = ({ size, data }: ViewProps) => {
    return (
        <>
            {
                data.map((value, index) => {
                    const x = (1000 - data.length*size)/2+ size * index;
                    const y = (1000 - size) / 2;

                    const fontSize = Math.min(
                        size * 0.5,
                        (size * 0.8) / String(value).length * 1.5
                    );
                    return (
                        <g key={index}>
                            <rect x={x} y={y} width={size} height={size}/>
                            <text
                                x={x + size / 2}
                                y={y + size / 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={fontSize}
                            >
                                {value}
                            </text>
                        </g>
                    );
                })
            }
        </>
    )
}