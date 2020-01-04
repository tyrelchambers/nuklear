import React from 'react';
import { inject, observer } from 'mobx-react';
import {useSpring, animated} from 'react-spring'
import TextareaAutosize from 'react-textarea-autosize';
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


  function autoGrow (oField) {
    if ( oField.scrollHeight >= 300 ) {
      oField.style.maxHeight = "300px";
      return false;
    }
    if (oField.scrollHeight > oField.clientHeight) {
      oField.style.height = oField.scrollHeight + "px";
    }
  }

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
            <div className="inbox-message-send-wrapper">
              <div className="inbox-message-send">
                <TextareaAutosize
                  type="text" 
                  placeholder="Send message" 
                  className="inbox-input"
                  maxRows={10} 
                  minRows={3}
                  onChange={e => {
                    autoGrow(e.target);
                  }}
                 />
                <button className="send-btn" >
                  <i className="fas fa-paper-plane"></i>
                  Send
                </button>
              </div>
            </div>
          </animated.div>
        }
      </div>
    </div>
  );
}));

export default Inbox;
