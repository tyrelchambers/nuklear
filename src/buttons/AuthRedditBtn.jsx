import React from 'react';
import './btns.scss'

const AuthRedditBtn = ({onClick, text, classNames = ""}) => {
  return (
    <button className={`btn btn-auth ${classNames}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default AuthRedditBtn;
