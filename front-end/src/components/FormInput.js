import React from "react";
import "./FormInput.css";

export default function FormInput(props) {
    const inputId = props.id || props.name;

    return (
        <div className="input-group">
            <label htmlFor={inputId}>
                {props.label}
                {props.required && <span aria-hidden="true"> *</span>}
            </label>
            <input
                id={inputId}
                type={props.type}
                name={props.name}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.onChange}
                required={props.required}
                aria-required={props.required}
            />
        </div>
    );
}