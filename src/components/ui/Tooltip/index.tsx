import { ReactNode, forwardRef, useState } from 'react';

import useWindowEvent from '@/hooks/useWindowEvent';

type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  content: ReactNode;
  mouseEnterDelay?: number;
  classNameContent?: string;
};

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, content, mouseEnterDelay = 300, classNameContent = 'max-w-[500px]' }) => {
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [delayHandler, setDelayHandler] = useState<unknown>(null);

    const handleScroll = () => setIsHovered(false);

    useWindowEvent('scroll', handleScroll, isHovered);

    const handleMouseEnter = () => {
      setDelayHandler(
        setTimeout(() => {
          setIsHovered(true);
        }, mouseEnterDelay)
      );
    };

    const handleMouseLeave = () => {
      clearTimeout(delayHandler as never);
      setIsHovered(false);
    };

    return (
      <div
        className="cursor-pointer"
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <>{children}</>
        {isHovered && (
          <div
            className={`dark:header_cus header_cus_light absolute z-20 transform rounded-lg border bg-paperLight p-2 text-lightPrimary shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-darkGreen dark:text-santaGrey ${classNameContent}`}
          >
            {content}
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
