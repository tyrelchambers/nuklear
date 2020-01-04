import React, { useState, useEffect } from 'react';
import './InboxMessage.scss'
import Chat from '../Chat/Chat';
import { isEmpty } from '../../helpers/isEmpty';
import moment from 'moment';
import dateFns from 'date-fns'
const InboxMessage = ({store}) => {
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

  msgArr.push(data)

  const sendHandler = (e) => {
    e.preventDefault();
  }


  return (
    <div className="inbox-message-wrapper">
      <div className="d-f jc-c fxd-c inbox-header-wrapper">
        <div className="d-f ai-c jc-sb">
          <h3 className="inbox-from">From: {destIsMe(data.dest) ? data.author : data.dest}{}</h3>
          <p className="inbox-created">{dateFns.format(moment.unix(data.created)._d, "MMM DD, YYYY h:mm:ss aa")}</p>
        </div>
        <h2 className="inbox-subject">{data.subject}</h2>
      </div>

      <div className="inbox-message-body">
        <Chat
          data={msgArr}
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
