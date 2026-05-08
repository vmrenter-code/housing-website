import React from "react";
import "./FormDivider.css"

export default function FormDivider(props) {
    return (
        <div className="divider">
            <span>-- {props.text} --</span>
        </div>
    );
}