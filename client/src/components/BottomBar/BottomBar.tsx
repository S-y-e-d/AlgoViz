import { useEffect, useRef } from "react"
import gsap from "gsap";
import SeekIcon from "../../assets/seek-icon.svg?react"
import { Button } from "../Button/Button";

type BottomBarProps = {
  toggleTLPause: () => void,
}



export function BottomBar({ toggleTLPause }: BottomBarProps) {



  const leftRef = useRef<SVGPathElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const leftTarget = "M 0,0 L 0,0 L 0,34 L 0,34 Z";
  // const leftTarget = "M 0,0 L 30,17 L 30,17 L 0,34 Z";
  const rightTarget = "M 0,0 L 30,17 L 30,17 L 0,34 Z";
  const tlRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.to(leftRef.current, {
      attr: { d: leftTarget },
      duration: 0.3,
      ease: "power2.inOut"
    });

    tl.to(rightRef.current, {
      attr: { d: rightTarget },
      duration: 0.3,
      ease: "power2.inOut"
    }, "<");

    tlRef.current = tl;
    tl.play();
  }, []);

  const handlePlayClick = () => {

    const tl = tlRef.current;
    if (!tl) return;
    toggleTLPause();
    if (tl.reversed()) {
      tl.play();
    } else {
      tl.reverse();
    }
  }

  return (

    <div id="bottom-bar" className="bar">
      <Button className="bottom-bar-button" icon={<SeekIcon className="control-button" style={{ transformOrigin: '50% 50%', transform: 'scaleX(-1)' }} />}/>
        

        <Button className="bottom-bar-button" icon= {
        <svg className="control-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 34" fill="currentColor">
          <g id="layer1">
            <path ref={leftRef} d="M 0,0 L 10,0 L 10,34 L 0,34 Z" />
            <path ref={rightRef} d="M 20,0 L 30,0 L 30,34 L 20,34 Z" />
          </g>
        </svg>
        }
        onClick={handlePlayClick}
        />


      <Button className="bottom-bar-button" icon={<SeekIcon className="control-button"/> }/>

    </div>
  )
}
