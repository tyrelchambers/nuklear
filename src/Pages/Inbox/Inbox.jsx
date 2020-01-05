import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import {useSpring, animated} from 'react-spring'
import TextareaAutosize from 'react-textarea-autosize';
import './Inbox.scss'
import InboxListItem from '../../components/InboxListItem/InboxListItem';
import InboxMessage from '../../components/InboxMessage/InboxMessage';
import Back from '../../components/Back/Back';
import Axios from 'axios';

const Inbox = inject("UserStore", "InboxStore")(observer(({UserStore, InboxStore, setSortVal, data, unread}) => {
  const [ endIndex, setEndIndex ] = useState(40);
  const access_token = window.localStorage.getItem("access_token");

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
    setMsgAsRead(msg.data.name)
    if (msg.data.replies) {
      msg.data.replies.data.children.map(x => setMsgAsRead(x.data.name))
    }
    InboxStore.setOpenChatWindow(true)
    set({opacity: 0})

    setTimeout(() => {
      setFadeIn({opacity: 1})
    }, 101);
    return InboxStore.setSelectedMessage(msg);
  }

  const setMsgAsRead = async (id) => {
    const body = new FormData();
    body.set('id', id)
    const _ = await Axios.post('https://oauth.reddit.com/api/read_message', body, 
    {
      headers: {
        "Authorization": `bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded"

      }
    })
    .then(res => res.data);
    console.log(_)
  }


  const backHandler = () => {
    set({opacity: 1})
    setFadeIn({opacity: 0})

    setTimeout(() => {
    InboxStore.setOpenChatWindow(false);

    }, 101);
  }

  useEffect(() => {
    const toScroll = document.querySelector('#inbox-message-list');
    toScroll.addEventListener('scroll', infiniteScroll);
    
    return () => {
      toScroll.removeEventListener('scroll', infiniteScroll);
    };
  }, [endIndex])

  const infiniteScroll = (c) => {
    const list = document.querySelector('#track');
    if ( isInViewport(list) ) {
      setEndIndex(endIndex + 40);
    }
  }
  
  const isInViewport = function (elem) {
    const bounding = elem.getBoundingClientRect();
    return (
        bounding.bottom <= ((window.innerHeight + 200) || document.documentElement.clientHeight)
    );
  };


  const messages = data.slice(0, endIndex).map((x,id) => (
    <InboxListItem x={x} key={id} onClick={selectHandler} unread={unread}/>
  ))

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
          <animated.div style={props} className="inbox-message-list" id="inbox-message-list">
            <div className="d-f fxd-c" id="track">
              {messages}
            </div>
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
