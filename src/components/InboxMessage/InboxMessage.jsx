import React from 'react';
import './InboxMessage.scss'

const InboxMessage = ({store}) => {
  return (
    <div>
      <h1>{store.selectedMessage.data.dest}</h1>
    </div>
  );
}

export default InboxMessage;
