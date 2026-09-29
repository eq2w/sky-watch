import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function RefreshIcon({ className, ...props }: IconProps) {
    return (
        <svg
            className={className}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            {...props}
        >
            <path d="M21 12C21 16.9706 16.9706 21 12 21C9.69494 21 7.59227 20.1334 6 18.7083L3 16M3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.86656 18 5.29168L21 8M3 21V16M3 16H8M21 3V8M21 8H16" stroke="CurrentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};
