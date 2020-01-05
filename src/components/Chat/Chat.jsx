import React, {useState, useEffect} from 'react';
import dateFns from 'date-fns'
import moment from 'moment';
import './Chat.scss'

const Chat = ({data, newMsg}) => {
  const [ chatLogs, setChatLogs] = useState([]);
  
  useEffect(() => {
    setChatLogs([...data]);
  }, [data]);

  useEffect(() => {
    if ( newMsg ) {
      setChatLogs([...chatLogs, newMsg])
    }
  }, [newMsg]);

  const currentUser = JSON.parse(window.localStorage.getItem('reddit_profile')).name;
  const chats = chatLogs.sort((a, b) => {
    return a.created - b.created;
  }).map((x, id) => {
    const isCurrent = x.author === currentUser.replace(/\s/g, "") ? true : false;
    return(
      <div key={id} className={`chat ${isCurrent ? "chat-right-wrapper" : ""}`}>
        <h4 className={`chat-author ${isCurrent ? "chat-right" : ""}`}>{isCurrent ? "You" : x.author}</h4>
        <div className={`chat-body-wrapper  ${isCurrent ? "right" : ""}`}>
          <p className={`chat-body ${isCurrent ? "chat-body-light" : "chat-body-dark"}`}>
            {x.body}
          </p>

          
        </div>
        <div className={`d-f ai-c chat-footer ${isCurrent ? "right" : ""}`}>
          <p className={`chat-date ${isCurrent ? "chat-right" : ""}`}>{dateFns.format(moment.unix(x.created_utc)._d, "MMM DD, YYYY h:mm:ss aa")}</p>
          
        </div>
      </div>
    )
  })

  return (
    <div className="chat-bubble">
      {console.log(chatLogs)}
      <div>
        {chats}
      </div>
    </div>
  );
}

export default Chat;
