import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function ArrowIcon({ className, ...props }: IconProps) {
    return (
        <svg
            className={className}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            {...props}
        >
            <path d="M12 5V19M12 5L6 11M12 5L18 11" stroke="CurrentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
};
