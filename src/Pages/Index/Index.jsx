import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring'
import LoadingInbox from '../../components/LoadingInbox/LoadingInbox';
import Axios from 'axios';
import Inbox from '../Inbox/Inbox';
import { inject, observer } from 'mobx-react';
import './Index.scss'

const Index = inject("InboxStore")(observer(({InboxStore}) => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ msgs, setMsgs ] = useState([]);
  const [ msgsRetrieved, setMsgsRetrieved ] = useState(0);
  const [ sortVal, setSortVal ] = useState("");
  const [ unreadMsg, setUnreadMsg ] = useState([]);
  const access_token = window.localStorage.getItem("access_token");
  const [props, set, stop] = useSpring(() => ({
    opacity: 1
  }))

  const [fadeIn, setFadeIn, stopFadeIn] = useSpring(() => ({
    opacity: 0,
    width: '100%',
    position: 'absolute',
    top: '1em',
    left: "50%",
    transform: 'translateX(-50%)',
    padding: '0.3em'

  }))


  useEffect(() => {
    const fn = async () => {
      
      const inb = await getAllMessages();
      const unread = await getUnreadMessages();
      setUnreadMsg([...unread.data.children])
      setMsgs([...InboxStore.getMessages()])
      if (!inb) { 
        setIsLoaded(true)
        setTimeout(() => {
          set({opacity: 0})
          setFadeIn({opacity: 1})
        }, 300);
      }
    }

    fn();
  }, [])

  useEffect(() => {
    if ( sortVal && sortVal.length >= 3) {
      const sort = sortInbox(InboxStore.getMessages(), sortVal);
      setMsgs(sort);
    } else {
      setMsgs(InboxStore.getMessages())
    }
  }, [sortVal]);


  const getAllMessages = async () => {
    let after = ""
    let count = 0;
   
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

  const getUnreadMessages = async () => {
    const _ = await Axios.get('https://oauth.reddit.com/message/unread', {
      headers: {
        "Authorization": `bearer ${access_token}`
      }
    })
    .then(res => res.data);
    return _;
  }

  const sortInbox = (data,  sortVal) => {
    const currentUser = JSON.parse(window.localStorage.getItem('reddit_profile')).name;
    return data.filter(x => {
      if (!x.data.author) return null;
      const isCurrent = x.data.author === currentUser.replace(/\s/g, "") ? true : false;
      const dest = x.data.dest.toLowerCase();
      const author = x.data.author.toLowerCase();
      return isCurrent ? dest.includes(sortVal) : author.includes(sortVal);
    })
  }
  
  return (
    <>
      {!isLoaded &&
        <animated.div style={props}>
          <LoadingInbox
            text="Loading your inbox"
          />
          <h4 className="intro-title retrieved"><span>{msgsRetrieved}</span> messages retrieved</h4>
        </animated.div>
      }
      {isLoaded &&
        <animated.div style={fadeIn}>
          <Inbox
            data={msgs}
            setSortVal={v => setSortVal(v)}
            unread={unreadMsg}
          />
        </animated.div>
      }

    </>
  );
}));


export default Index;
