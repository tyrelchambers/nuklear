import Axios from "axios"
import UserStore from '../stores/UserStore'

export const getCurrentAuthenticatedUser = (token) => {

  return Axios.get('https://oauth.reddit.com/api/v1/me', {
    headers: {
      "Authorization": `bearer ${token}`
    }
  })
  .then(res => {
    return res.data
  })
}
  