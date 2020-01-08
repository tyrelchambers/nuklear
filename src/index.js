import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import App from './Pages/App/App';
import UserStore from './stores/UserStore'
import { renewRefreshToken } from './helpers/renewRefreshTokens';
import { getCurrentAuthenticatedUser } from './helpers/getCurrentRedditProfile';
import InboxStore from './stores/InboxStore'
const stores = {
  UserStore,
  InboxStore
}

const Initial = () => {
  const [ loading, setLoading ] = useState(true)

  useEffect(() => {
    const fn = async () => {
      const tokens = await renewRefreshToken()
      const isWelcomed = window.localStorage.getItem('is_welcomed');

      if (tokens) {
        const user = await getCurrentAuthenticatedUser(tokens.access_token)
        window.localStorage.setItem('reddit_profile', JSON.stringify(user))
        if ( tokens.access_token ) {
          window.localStorage.setItem("access_token", tokens.access_token);
        }
        
        if ( tokens.refresh_token ) {
          window.localStorage.setItem("refresh_token", tokens.refresh_token);
        }
        UserStore.setRedditProfile(user)
      }

      if (isWelcomed) {
        UserStore.setIsWelcomed(true)
      }
      
      setLoading(false)

    }

    fn()
  }, [])

  if ( loading ) return null;

  return (
    <Provider {...stores}>
      <Router>
        <Switch>
          <Route exact path="/" component={App} />
        </Switch>
      </Router>
    </Provider>
  )
}
ReactDOM.render(
  <Initial />
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
