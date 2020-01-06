import React, { useState, useEffect } from 'react';
import './InboxMessage.scss'
import Chat from '../Chat/Chat';
import { isEmpty } from '../../helpers/isEmpty';
const InboxMessage = ({store, newMsg}) => {
  const [ data, setData ] = useState([])
  const [ loading, setLoading ] = useState(true)
  const msgArr = [];

  useEffect(() => {
    const msg = store.getSelectedMessage();
    setData(msg)
    setLoading(false)
  }, [store.selectedMessage]);
  
  if(loading) return null;

  if ( !isEmpty(data.replies) ) {
    data.replies.data.children.map(x => {
      msgArr.push(x.data);
    });
  }

  if (newMsg) {
    msgArr.push(newMsg)
  }
  msgArr.push(data)

  return (
    <div className="inbox-message-wrapper">
      <div className="d-f jc-c fxd-c inbox-header-wrapper">
        <div className="d-f ai-c jc-sb">
          <h3 className="inbox-from">From: {destIsMe(data) ? data.author : data.dest}{}</h3>
        </div>
        <h2 className="inbox-subject">{data.subject}</h2>
      </div>
      <div className="inbox-message-body">
        <Chat
          data={msgArr}
          newMsg={newMsg}
        />
      </div>
    </div>
  );
}

const destIsMe = (data) => {
  const currentUser = JSON.parse(window.localStorage.getItem('reddit_profile')).name;
  return (data.dest === currentUser.replace(/\s/g, ""));
}

export default InboxMessage;
