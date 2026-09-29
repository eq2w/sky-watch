import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function MountainIcon({ className, ...props }: IconProps) {
    return (
        <svg
            className={className}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            {...props}
        >
            <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
        </svg>
    )
};

