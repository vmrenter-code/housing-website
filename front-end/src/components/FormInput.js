import React from "react";
import "./FormInput.css";

export default function FormInput(props) {
    return (
        <div className="input-group">
            <label>{props.label}</label>
            <input
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
            />
        </div>
    );
}