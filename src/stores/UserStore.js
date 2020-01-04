import { observable, action,decorate, toJS } from 'mobx';
import Axios from 'axios';
import { toast } from 'react-toastify';


class UserStore {
  redditProfile = {}
  is_welcomed = false

  setRedditProfile(profile) {
    this.redditProfile = profile;
  }

  setIsWelcomed(bool) {
    this.is_welcomed = bool;
  }

  getRedditProfile() {
    return isEmpty(this.redditProfile) ? null : toJS(this.redditProfile);
  }

  getAccessToken = async (token) => {
    if (!token) return null;
    const encode = window.btoa(`${process.env.REACT_APP_REDDIT_ID}:${process.env.REACT_APP_REDDIT_SECRET}`);
    const redditTokens = await Axios.post('https://www.reddit.com/api/v1/access_token', 
      `grant_type=authorization_code&code=${token}&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT}`

    ,
    {
      headers: {
        "Authorization": `Basic ${encode}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(res => {
      if (res.data.error) {
        return toast.error("Please re-authenticate");
      } 
      return res.data;
    })
    .catch(console.log);

    return redditTokens;
  }
}

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

decorate(UserStore, {
  redditProfile: observable,
  setRedditProfile: action,
  is_welcomed: observable,
  setIsWelcomed: action
});

export default new UserStore();