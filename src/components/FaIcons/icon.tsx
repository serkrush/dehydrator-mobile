import React, { ReactNode } from 'react';

interface IIconProps {
    path: string;
    width?: string;
    height?: string;
    children?: ReactNode;
    className?: string;
    alt?: string;
}

function Icon(props: IIconProps) {
    return (
        <img
            src={props.path}
            width={props.width}
            height={props.height}
            alt={props.alt}
            className={props.className}
        >
            {props.children}
        </img>
    );
}
export default Icon;
