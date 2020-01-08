import React, {useEffect} from 'react';
import AuthRedditBtn from '../../buttons/AuthRedditBtn';
import { inject, observer } from 'mobx-react';

const Authenticate = inject("UserStore")(observer(({UserStore}) => {
  useEffect(() => {
    getParams();
  }, [])

  const getParams = () => {
    const params = (new URL(window.location)).searchParams;
    const approvalStatus = params.get("code") ? params.get("code") : false;

    if ( approvalStatus !== false ) {
      UserStore.getAccessToken(approvalStatus).then(res => {
        if (res.access_token) {
          window.localStorage.setItem("access_token", res.access_token)
          window.localStorage.setItem("refresh_token", res.refresh_token)
        }
        params.delete("code")
        params.delete("state")
        window.location.search = ""
      }).catch(console.log);
 
    } 
  }

  const askForRedditApproval = () => {
    const link = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REACT_APP_REDDIT_ID}&response_type=code&state=redditinbox&redirect_uri=${process.env.REACT_APP_REDDIT_REDIRECT}&duration=permanent&scope=privatemessages identity`;
    window.location.href = link;
  }


  return (
    <div className="d-f jc-c">
      <AuthRedditBtn
        text="Authenticate with Reddit"
        onClick={askForRedditApproval}
      />
    </div>
  );
}));

export default Authenticate;
