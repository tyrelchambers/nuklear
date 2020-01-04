import React, {useState, useEffect} from 'react';
import {useSpring, animated} from 'react-spring'
import LoadingInbox from '../../components/LoadingInbox/LoadingInbox';
import { getInbox } from '../../api/get';
import Axios from 'axios';

const Index = () => {
  const [ isLoaded, setIsLoaded ] = useState(false)
  const [ msgs, setMsgs ] = useState();
  const access_token = window.localStorage.getItem("access_token");

  useEffect(() => {
    const fn = async () => {
      
      const inb = await getAllMessages();
      console.log(inb)
    }

    fn();
  }, [])

  const getAllMessages = () => {
    let after = ""
    let link = 'https://oauth.reddit.com/message/messages';
  
    for ( let i = 0; (i < 10 && after !== null); i++ ) {
      Axios.get(`${link}&after=${after}&count=100`).then(res => {
        after = res.data.data.after;
        setMsgs([...msgs, ...res.data.data.children])
      }, 
      {
        headers: {
          "Authorization": `bearer ${access_token}`
        }
      }).catch(err => err);
    }
  }
  
  return (
    <div>
      {!isLoaded &&
        <LoadingInbox
          text="Loading your Inbox"
        />
      }
    </div>
  );
}


export default Index;
