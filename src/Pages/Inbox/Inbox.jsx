import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import {useSpring, animated} from 'react-spring'
import TextareaAutosize from 'react-textarea-autosize';
import './Inbox.scss'
import InboxListItem from '../../components/InboxListItem/InboxListItem';
import InboxMessage from '../../components/InboxMessage/InboxMessage';
import Back from '../../components/Back/Back';
import Axios from 'axios';
import stickybits from 'stickybits'
import Settings from '../Settings/Settings';
const Inbox = inject("UserStore", "InboxStore")(observer(({UserStore, InboxStore, setSortVal, data, unread}) => {
  const [ endIndex, setEndIndex ] = useState(40);
  const access_token = window.localStorage.getItem("access_token");
  const [ chatMsg, setChatMsg ] = useState("");
  const [ newMsg, setNewMsg ] = useState();
  const [openOptions, setOpenOptions] = useState(false);
  const [props, set, stop] = useSpring(() => ({
    opacity: 1,
    config: {
      duration: 100
    }
  }))

  const [fadeIn, setFadeIn, _] = useSpring(() => ({
    opacity: 0,
    position: 'relative',
    config: {
      duration: 100
    }
  }))


  useEffect(() => {
    document.addEventListener('scroll', infiniteScroll);
    stickybits('.inbox-header', {useStickyClasses: true});

    return () => {
      document.removeEventListener('scroll', infiniteScroll);
    };
  }, [endIndex])


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
  }


  const backHandler = () => {
    set({opacity: 1})
    setFadeIn({opacity: 0})

    setTimeout(() => {
    InboxStore.setOpenChatWindow(false);

    }, 101);
  }

  const infiniteScroll = (c) => {
    const list = document.querySelector('#inbox-message-list');
    if ( list ) {
      if ( isInViewport(list) ) {
        setEndIndex(endIndex + 40);
      }
    }
  }
  
  const isInViewport = function (elem) {
    const bounding = elem.getBoundingClientRect();
    return (
        bounding.bottom <= ((window.innerHeight + 100) || document.documentElement.clientHeight)
    );
  }; 
  
  const submitHandler = async e => {
    e.preventDefault();

    const thing_id = InboxStore.selectedMessage.name;
    const text = chatMsg;

    if ( !text ) return;

    const body = new FormData();
    body.set('thing_id', thing_id);
    body.set("text", text);
    body.set("return_rtjson", true);

    Axios.post(`https://oauth.reddit.com/api/comment`, body, {
      headers: {
        "Authorization":  `bearer ${access_token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    .then(res => {
      setNewMsg(res.data.jquery[30][3][0][0].data);
      setChatMsg("");
    })
    .catch(console.log);
  }


  const messages = data.slice(0, endIndex).map((x,id) => (
    <InboxListItem x={x} key={id} onClick={selectHandler} unread={unread}/>
  ))

  return (
    <div className="inbox-wrapper container center">
      <header className="inbox-header ">
        <div className="d-f jc-sb ai-c stick-header">
          <div className="d-f ai-c inbox-brand-wrapper">
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

          <div className="d-f ai-c w-100pr">
            <input type="text" placeholder="Search inbox by sender..." className="form-input"  onChange={e => setSortVal(e.target.value.toLowerCase())}/>

            <div className="inbox-header-actions" >
              <i className="fas fa-cog header-settings" onClick={() => {
                setOpenOptions(!openOptions)
                setFadeIn({opacity: 1})
              }}></i>
            </div>
          </div>
        </div>
      </header>

      <div className="inbox-body">
        {(!InboxStore.openChatWindow && !openOptions) && 
          <animated.div style={props} className="inbox-message-list" id="inbox-message-list" >
            <div className="d-f fxd-c" >
              {messages}
            </div>
          </animated.div>
        }

        {(InboxStore.openChatWindow && !openOptions) &&
          <animated.div style={fadeIn}>
            <InboxMessage 
              store={InboxStore}
              newMsg={newMsg}  
            />
            <div className="inbox-message-send-wrapper">
              <div className="inbox-message-send">
                <TextareaAutosize
                  type="text" 
                  placeholder="Send message" 
                  className="inbox-input"
                  maxRows={10} 
                  minRows={3}
                  onChange={e => setChatMsg(e.target.value)}
                  value={chatMsg}
                 />
                <button className="send-btn" onClick={submitHandler}>
                  <i className="fas fa-paper-plane"></i>
                  Send
                </button>
              </div>
            </div>
          </animated.div>
        }


        {openOptions &&
          <animated.div style={fadeIn}>
            <Settings />
          </animated.div>
        }
      </div>
    </div>
  );
}));

export default Inbox;
