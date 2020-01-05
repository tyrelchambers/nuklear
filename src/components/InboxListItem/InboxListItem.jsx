import React from 'react';
import './InboxListItem.scss'

const InboxListItem = ({x, onClick}) => {
  return (
    <div className="inbox-list-wrapper" onClick={() => onClick(x)}>
      <h5 className="mr-">{x.data.dest}</h5>
      <i className="fas fa-circle"></i>
      <p className="inbox-list-light">{x.data.subject}</p>
    </div>
  );
}

export default InboxListItem;
