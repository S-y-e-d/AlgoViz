import type { ViewProps } from "../../App";

export const ArrayView = ({ size, data, nodeRefs }: ViewProps) => {
  // need to filter out NaN used as null for non linear structures
  const dataCopy = data.filter(v => !isNaN(v));
  return (
    <>
      {
        dataCopy.map((value, index) => {
          const x = (1000 - dataCopy.length * size) / 2 + size * index;
          const y = (1000 - size) / 2;

          const fontSize = Math.min(
            size * 0.5,
            (size * 0.8) / String(value).length * 1.5
          );
          return (
            <g key={index} ref={(el) => {
              if (el) 
                nodeRefs.current.set(index, el); 
              else 
                nodeRefs.current.delete(index);
            }}>
              <rect x={x} y={y} width={size} height={size} />
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