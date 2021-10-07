import React from "react";
import './style.scss';

const DefaultWrapper = ({ children }: any) => {
    return (
        <div className="default-wrapper center-items">
            {children}
        </div>
    );
}

export default DefaultWrapper;
