import React from 'react';
import { inject, observer } from 'mobx-react';
import {useSpring, animated} from 'react-spring'

import './Inbox.scss'
import InboxListItem from '../../components/InboxListItem/InboxListItem';
import InboxMessage from '../../components/InboxMessage/InboxMessage';

const Inbox = inject("UserStore", "InboxStore")(observer(({UserStore, InboxStore}) => {
  const [props, set, stop] = useSpring(() => ({
    opacity: 1,
    config: {
      duration: 200
    }
  }))

  const [fadeIn, setFadeIn, _] = useSpring(() => ({
    opacity: 0,
    config: {
      duration: 200
    }
  }))

  const selectHandler = (msg) => {
    set({opacity: 0})

    setTimeout(() => {
      InboxStore.setOpenChatWindow(true)
      setFadeIn({opacity: 1})
    }, 300);
    return InboxStore.setSelectedMessage(msg);
  }

  const messages = InboxStore.messages.map((x,id) => (
    <InboxListItem x={x} key={id} onClick={selectHandler}/>
  ))

  return (
    <div className="inbox-wrapper container center">
      <header className="inbox-header ">
        <div className="d-f jc-sb ai-c">
          <h3 className="inbox-header-brand">
            <span>Hey, </span>
            {UserStore.redditProfile.name}
          </h3>

          <input type="text" placeholder="Search inbox by sender..." className="form-input"/>

          <div className="inbox-header-actions">
            <i className="fas fa-cog"></i>
          </div>
        </div>
      </header>

      <div className="inbox-body">
        {!InboxStore.openChatWindow && 
          <animated.div style={props} className="inbox-message-list">
            {messages}
          </animated.div>
        }

        {InboxStore.openChatWindow &&
          <animated.div style={fadeIn}>
            <InboxMessage store={InboxStore}/>
            <div className="inbox-message-send">
              <input type="text" placeholder="Send message" className="inbox-input"/>
              <button className="send-btn" >
                <i className="fas fa-paper-plane"></i>
                Send
              </button>
            </div>
          </animated.div>
        }
      </div>
    </div>
  );
}));

export default Inbox;
