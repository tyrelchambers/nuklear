import React from 'react';
import './Back.scss'

const Back = ({backHandler}) => {
  return (
    <button className="d-f ai-c back-btn" onClick={backHandler}>
      <i className="fas fa-long-arrow-alt-left mr--"></i>
      <h4>Back</h4>
    </button>
  );
}

export default Back;
