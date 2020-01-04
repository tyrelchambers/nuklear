import Axios from "axios";

export const getInbox = async (access_token) => {
  return await Axios.get(`https://oauth.reddit.com/message/messages`, {
    headers: {
      "Authorization": `bearer ${access_token}`
    }
  })
  .then(res => res.data)
  .catch(console.log);
}