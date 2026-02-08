import React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  repeat?: number;
  speed?: number;
  vertical?: boolean;
}

export const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      reverse = false,
      pauseOnHover = true,
      children,
      repeat = 4,
      speed = 40,
      vertical = false,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <style>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }

          @keyframes scroll-right {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(50%);
            }
          }

          [data-marquee] {
            display: flex;
            gap: 1rem;
            width: 200%;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
          }

          [data-marquee][data-reverse="false"] {
            animation: scroll-left ${speed}s linear infinite;
          }

          [data-marquee][data-reverse="true"] {
            animation: scroll-right ${speed}s linear infinite;
          }

          [data-marquee][data-paused="true"] {
            animation-play-state: paused;
          }
        `}</style>

        <div
          ref={ref}
          {...props}
          className={cn('overflow-hidden', className)}
        >
          <div
            data-marquee
            data-reverse={reverse}
            data-paused={false}
            onMouseEnter={(e) => {
              if (pauseOnHover) {
                const el = e.currentTarget as HTMLDivElement;
                el.setAttribute('data-paused', 'true');
              }
            }}
            onMouseLeave={(e) => {
              if (pauseOnHover) {
                const el = e.currentTarget as HTMLDivElement;
                el.setAttribute('data-paused', 'false');
              }
            }}
          >
            {Array(2)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4 shrink-0">
                  {children}
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
);

Marquee.displayName = 'Marquee';
