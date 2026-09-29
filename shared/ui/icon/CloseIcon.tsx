import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function CloseIcon({ className, ...props }: IconProps) {
    return (
        <svg
            className={className}
            width='24'
            height='24'
            viewBox='0 0 24 24'
            {...props}
        >
            <g id="Menu / Close_LG">
                <path id="Vector" d="M21 21L12 12M12 12L3 3M12 12L21.0001 3M12 12L3 21.0001" stroke="CurrentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </g>
        </svg>
    )
};
