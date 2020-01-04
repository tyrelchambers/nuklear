import Axios from "axios";

export const renewRefreshToken = async () => {
  const encode = window.btoa(`${process.env.REACT_APP_REDDIT_ID}:${process.env.REACT_APP_REDDIT_SECRET}`);
  const token = window.localStorage.getItem('refresh_token');
  if ( !token ) return null;

  return await Axios.post('https://www.reddit.com/api/v1/access_token', 
    `grant_type=refresh_token&refresh_token=${token}`,
  {
    headers: {
      "Authorization": `Basic ${encode}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(res => res.data)
  .catch(console.log);
}