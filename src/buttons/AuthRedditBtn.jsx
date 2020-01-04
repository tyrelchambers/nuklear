import React from 'react';
import './btns.scss'
import {Spring, config} from 'react-spring/renderprops'

const AuthRedditBtn = ({onClick, text, classNames = ""}) => {
  return (
    
    <Spring
      config={{
        ...config.slow,
        delay: 300
      }}
      from={{ opacity: 0, transform: 'translateY(-50px)' }}
      to={{ opacity: 1, transform: 'translateY(0px)' }}>
      {props => (
        <button className={`btn btn-auth ${classNames}`} style={props} onClick={onClick}>
          {text}
        </button>
      )}
    </Spring>
  );
}

export default AuthRedditBtn;
