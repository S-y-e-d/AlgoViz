import type { ViewProps } from "../../App";

export const ListView = ({ size, data }: ViewProps) => {
    const dataCopy = data.filter(v => !isNaN(v));
    return (
        <>
            {
                dataCopy.map((value, index) => {
                    const structureSize = (2*dataCopy.length-1) * size ;
                    const structureStart = (1000-structureSize)/2;
                    const x = structureStart+ 2*size * index + size/2;
                    const y = (1000) / 2;

                    const fontSize = Math.min(
                        size * 0.5,
                        (size * 0.8) / String(value).length * 1.5
                    );
                    return (
                        <g key={index}>
                            <circle r={size/2} cx={x} cy={y}/>
                            <text
                                x={x }
                                y={y }
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={fontSize}
                            >
                                {value}
                            </text>
                            {index < dataCopy.length - 1 && <line x1={x+size/2}
                            y1={y}
                            x2={x+3*size/2}
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