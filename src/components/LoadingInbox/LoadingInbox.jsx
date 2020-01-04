import React from 'react';
import './LoadingInbox.scss'

const LoadingInbox = ({text}) => {
  return (
    <div className="loading-inbox-wrapper fxd-c">
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
      <h1 className="big-title">{text}</h1>
    </div>
  );
}

export default LoadingInbox;
