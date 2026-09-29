import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function ClockIcon({ className, ...props }: IconProps) {
    return (
        <svg
            className={className}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
           <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
    )
};

