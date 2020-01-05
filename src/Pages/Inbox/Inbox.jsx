import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import {useSpring, animated} from 'react-spring'
import TextareaAutosize from 'react-textarea-autosize';
import './Inbox.scss'
import InboxListItem from '../../components/InboxListItem/InboxListItem';
import InboxMessage from '../../components/InboxMessage/InboxMessage';
import Back from '../../components/Back/Back';

const Inbox = inject("UserStore", "InboxStore")(observer(({UserStore, InboxStore, setSortVal, data}) => {
  const [props, set, stop] = useSpring(() => ({
    opacity: 1,
    config: {
      duration: 100
    }
  }))

  const [fadeIn, setFadeIn, _] = useSpring(() => ({
    opacity: 0,
    config: {
      duration: 100
    }
  }))

  const selectHandler = (msg) => {
    InboxStore.setOpenChatWindow(true)
    set({opacity: 0})

    setTimeout(() => {
      setFadeIn({opacity: 1})
    }, 101);
    return InboxStore.setSelectedMessage(msg);
  }

  const messages = data.map((x,id) => (
    <InboxListItem x={x} key={id} onClick={selectHandler}/>
  ))

  const backHandler = () => {
    set({opacity: 1})
    setFadeIn({opacity: 0})

    setTimeout(() => {
    InboxStore.setOpenChatWindow(false);

    }, 101);
  }



  return (
    <div className="inbox-wrapper container center">
      <header className="inbox-header ">
        <div className="d-f jc-sb ai-c">
          <div className="d-f ai-c">
            {InboxStore.openChatWindow &&
              <animated.div style={fadeIn}>
                <Back
                  backHandler={backHandler}
                />
              </animated.div>
            }
            <h3 className="inbox-header-brand">
              <span>Hey, </span>
              {UserStore.redditProfile.name}
            </h3>
          </div>

          <input type="text" placeholder="Search inbox by sender..." className="form-input"  onChange={e => setSortVal(e.target.value.toLowerCase())}/>

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
