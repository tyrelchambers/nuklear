import React from 'react';
import './InboxListItem.scss'

const InboxListItem = ({x, onClick, unread}) => {
  const isUnread = unread.filter(v => {

    if (x.data.replies) {
      const replies = x.data.replies.data.children[x.data.replies.data.children.length - 1].data.id;

      if (v.data.id === replies) {
        return true
      }
    } 

    if (v.data.id === x.data.id) {
      return true
    }

  });
  return (
    <div className="inbox-list-wrapper" onClick={() => onClick(x)}>
      <h5 className="mr-">{x.data.dest}</h5>
      <i className={`fas fa-circle ${isUnread.length > 0 ? "red" : ""}`}></i>
      <p className="inbox-list-light">{x.data.subject}</p>
    </div>
  );
}

export default InboxListItem;
