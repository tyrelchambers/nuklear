import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring'
import LoadingInbox from '../../components/LoadingInbox/LoadingInbox';
import { getInbox } from '../../api/get';
import Axios from 'axios';
import Inbox from '../Inbox/Inbox';
import { inject, observer } from 'mobx-react';

const Index = inject("InboxStore")(observer(({InboxStore}) => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ msgs, setMsgs ] = useState([]);
  const [ msgsRetrieved, setMsgsRetrieved ] = useState(0);
  const access_token = window.localStorage.getItem("access_token");
  const [props, set, stop] = useSpring(() => ({
    opacity: 1
  }))

  const [fadeIn, setFadeIn, stopFadeIn] = useSpring(() => ({
    opacity: 1
  }))
  

  useEffect(() => {
    const fn = async () => {
      
      const inb = await getAllMessages();
      if (!inb) {
        set({opacity: 0})
        setTimeout(() => {
          setIsLoaded(true)
          setFadeIn({opacity: 1})
        }, 2000);
      }
    }

    fn();
  }, [])

  const getAllMessages = async () => {
    let after = ""
    let count = 0;
    const posts = []
    for ( let i = 0; after !== null; i++ ) {
      const _ = await Axios.get(`https://oauth.reddit.com/message/messages?after=${after}&count=100`, {
        headers: {
          "Authorization": `bearer ${access_token}`
        }
      }).then(res => {
        after = res.data.data.after;
        InboxStore.setMessages({
          data: res.data.data.children,
          after: res.data.data.after
        });
        count += res.data.data.children.length
      }).catch(err => err);
      setMsgsRetrieved(count)
    }
  }
  
  return (
    <>
      {!isLoaded &&
        <animated.div style={props}>
          <LoadingInbox
            text="Loading your Inbox"
          />
          <h4 className="intro-title">{msgsRetrieved} messages retrieved</h4>
        </animated.div>
      }

      {isLoaded &&
        <animated.div style={{...fadeIn, width: '100%'}}>
          <Inbox
            messages={msgs}
          />
        </animated.div>
      }
    </>
  );
}));


export default Index;
