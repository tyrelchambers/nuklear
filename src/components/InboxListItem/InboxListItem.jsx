import React from 'react';
import './InboxListItem.scss'

const InboxListItem = ({x, onClick, unread}) => {
  const isUnread = unread.filter(v => v.data.id === x.data.id);
  return (
    <div className="inbox-list-wrapper" onClick={() => onClick(x)}>
      <h5 className="mr-">{x.data.dest}</h5>
      <i className={`fas fa-circle ${isUnread.length > 0 ? "red" : ""}`}></i>
      <p className="inbox-list-light">{x.data.subject}</p>
    </div>
  );
}

export default InboxListItem;
