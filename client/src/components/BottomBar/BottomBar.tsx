import { useEffect, useRef, type RefObject } from "react"
import gsap from "gsap";
import SeekIcon from "../../assets/seek-icon.svg?react"
import { Button } from "../Button/Button";
import type { DataItem } from "../../App";
import { bubbleSortTL } from "../../animations/array/sorting";

type BottomBarProps = {
  data: DataItem[];
  nodeRefs: RefObject<Map<number, SVGGElement>>;
  isTLPaused: RefObject<boolean>;
  setTLPaused: (b: boolean) => void;
  refreshData: () => void;
}



export function BottomBar({ data, nodeRefs, isTLPaused, setTLPaused, refreshData }: BottomBarProps) {

  // function to set the timeline
  const tlRef = useRef<GSAPTimeline | null>(null);

  const leftRef = useRef<SVGPathElement>(null);
  const rightRef = useRef<SVGPathElement>(null);
  const leftTarget = "M 0,0 L 0,0 L 0,34 L 0,34 Z";
  const rightTarget = "M 0,0 L 30,17 L 30,17 L 0,34 Z";
  const tlPlayAnimateRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    // create the animation for the play button
    const tlPlayAnimate = gsap.timeline({ paused: true });

    tlPlayAnimate.to(leftRef.current, {
      attr: { d: leftTarget },
      duration: 0.3,
      ease: "power2.inOut"
    });

    tlPlayAnimate.to(rightRef.current, {
      attr: { d: rightTarget },
      duration: 0.3,
      ease: "power2.inOut"
    }, "<");

    tlPlayAnimateRef.current = tlPlayAnimate;
    tlPlayAnimate.play();



  }, []);

  useEffect(() => {
    tlRef.current?.pause(0);
    tlRef.current = null;
  }, [data])

  const setAlgorhtm = () => {
    // create the animation for the algorithm
    const tl = (bubbleSortTL(
      [...data.filter(v => !isNaN(v.val))],
      (i) => nodeRefs.current.get(i) ?? null,
      isTLPaused,
    ));
    tlRef.current = tl;

  }

  const playButtonToggle = () => {
    const playTL = tlPlayAnimateRef.current;
    if (playTL === null) return;
    if (playTL.progress() == 0) {
      playTL.play();
    } else {
      playTL.reverse();
    }

  }

  const handlePlayClick = () => {

    playButtonToggle();

    if (tlRef.current === null) {
      setAlgorhtm();
    }

    if (isTLPaused.current === true) {
      if (tlRef.current != null) {
        setTLPaused(false);
        tlRef.current.play();
      }
    } else {
      if (tlRef.current != null) {
        setTLPaused(true);
      }
    }
  }

  const handleNextClick = () => {
    tlPlayAnimateRef.current?.play();
    setTLPaused(true);
    if (tlRef.current === null) {
      setAlgorhtm();
    }
    if (tlRef.current !== null) {
      tlRef.current.play();
    } else {
      console.error("could not set algorithm");
    }
  }

  const handleResetClick = () => {

    tlPlayAnimateRef.current?.play();

    setTLPaused(true);
    refreshData();
  }

  return (

    <div id="bottom-bar" className="bar">
      <Button
        className="bottom-bar-button"
        icon={
          <SeekIcon
            className="control-button"
            style={{ transformOrigin: '50% 50%', transform: 'scaleX(-1)' }}
          />}
        onClick={handleResetClick}
      />


      <Button className="bottom-bar-button" icon={
        <svg className="control-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 34" fill="currentColor">
          <g id="layer1">
            <path ref={leftRef} d="M 0,0 L 10,0 L 10,34 L 0,34 Z" />
            <path ref={rightRef} d="M 20,0 L 30,0 L 30,34 L 20,34 Z" />
          </g>
        </svg>
      }
        onClick={handlePlayClick}
      />


      <Button className="bottom-bar-button" icon={<SeekIcon className="control-button" />} onClick={handleNextClick} />

    </div>
  )
}
