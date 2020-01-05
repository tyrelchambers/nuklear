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
  const [ sortVal, setSortVal ] = useState("");

  const access_token = window.localStorage.getItem("access_token");
  const [props, set, stop] = useSpring(() => ({
    opacity: 1
  }))

  const [fadeIn, setFadeIn, stopFadeIn] = useSpring(() => ({
    opacity: 0,
    width: '100%'
  }))


  useEffect(() => {
    const fn = async () => {
      
      const inb = await getAllMessages();
      setMsgs([...InboxStore.getMessages()])
      if (!inb) {
        set({opacity: 0})
        setIsLoaded(true)
        setTimeout(() => {
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
            text="Loading your Inbox"
          />
          <h4 className="intro-title">{msgsRetrieved} messages retrieved</h4>
        </animated.div>
      }

      {isLoaded &&
        <animated.div style={fadeIn}>
          <Inbox
            data={msgs}
            setSortVal={v => setSortVal(v)}
          />
        </animated.div>
      }
    </>
  );
}));


export default Index;
