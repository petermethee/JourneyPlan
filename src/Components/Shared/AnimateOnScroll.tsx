import { useEffect, useRef, useState } from "react";

type Props = {
  children: React.ReactNode;
  visibleClass: string;
  hiddenClass: string;
  duration?: string;
  reappear?: boolean;
  threshold?: number;
  margin?: string;
  root?: Element | Document;
};

type Options = IntersectionObserverInit & {
  reappear?: boolean;
};

const useElementOnScreen = (
  options: Options
): [React.RefObject<HTMLDivElement>, boolean] => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const makeAppear = (entries: any) => {
    const [entry] = entries;
    if (entry.isIntersecting) setIsVisible(true);
  };

  const makeAppearRepeating = (entries: any) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  const callBack = options.reappear ? makeAppearRepeating : makeAppear;

  useEffect(() => {
    const containerRefCurrent = containerRef.current;
    const observer = new IntersectionObserver(callBack, options);
    if (containerRefCurrent) observer.observe(containerRefCurrent);

    return () => {
      if (containerRefCurrent) {
        observer.unobserve(containerRefCurrent);
      }
    };
  }, [containerRef, options, callBack]);

  return [containerRef, isVisible];
};

export default function AnimateOnScroll({
  children,
  reappear,
  threshold = 0.5,
  visibleClass,
  hiddenClass,
  duration = "1s",
  margin,
  root,
}: Props) {
  const [containerRef, isVisible] = useElementOnScreen({
    threshold: threshold,
    reappear: reappear,
    rootMargin: margin,
    root,
  });

  return (
    <>
      <div
        ref={containerRef}
        className={isVisible ? visibleClass : hiddenClass}
        style={{ transitionDuration: duration }}
      >
        {children}
      </div>
    </>
  );
}
