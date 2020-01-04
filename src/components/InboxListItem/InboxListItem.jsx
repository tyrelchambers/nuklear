import React from 'react';
import './InboxListItem.scss'

const InboxListItem = ({x, onClick}) => {
  return (
    <div className="inbox-list-wrapper" onClick={() => onClick(x)}>
      <h5>{x.data.dest}</h5>
    </div>
  );
}

export default InboxListItem;
