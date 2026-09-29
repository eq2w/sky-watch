import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function SpeedIcon({ className, ...props }: IconProps) {
    return (
        <svg
            className={className}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
            <path d="m12 14 4-4" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </svg>
    )
};
