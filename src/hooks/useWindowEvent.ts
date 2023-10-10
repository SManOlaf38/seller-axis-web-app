import { useEffect } from 'react';

const useWindowEvent = <K extends string>(
  type: K,
  listener: K extends keyof WindowEventMap
    ? (this: Window, event: WindowEventMap[K]) => void
    : (this: Window, event: CustomEvent) => void,
  options?: boolean | AddEventListenerOptions
) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addEventListener(type, listener, options);
      return () => (window as any).removeEventListener(type, listener, options);
    }
  }, []);
};

export default useWindowEvent;
