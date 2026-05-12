import React from 'react';
import './Universitychip.css';

export default function UniversityChip({ name, onClick }) {
  return (
    <button className="uni-chip" onClick={() => onClick && onClick(name)}>
      {name}
    </button>
  );
}