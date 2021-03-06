import React, {useState, useEffect} from 'react';
import './App.scss'
import {Spring, config} from 'react-spring/renderprops'
import {useSpring, animated} from 'react-spring'
import { inject, observer } from 'mobx-react';
import Index from '../Index/Index';
import Authenticate from '../Authenticate/Authenticate';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';

const App = inject("UserStore", "InboxStore")(observer(({UserStore, InboxStore}) => {
  const [ loading, setLoading ] = useState(true)
  const [ profile, setProfile ] = useState();

  useEffect(() => {
    setProfile(UserStore.getRedditProfile())
    setLoading(false)


  }, [])

  setTimeout(() => {
    UserStore.setIsWelcomed(true)
  }, 3000);
  const props = useSpring({
    to: async (next, cancel) => {
      await next({opacity: 1, transform: 'translateY(0px)'})
      setTimeout(async () => {
        await next({opacity: 0, transform: 'translateY(0px)'})
      }, 2000);
    },
    from: {opacity: 0, transform: "translateY(-50px)"},
    config: {
      duration: 500
    }
  })

  if (loading) return null;

  return (
    <div className="app-wrapper d-f ai-c" id="track">
      <div className="container center d-f fxd-c ai-c p-- ">
        {/* Shows when a user hasn't registered */}
        {!profile &&
          <>
            <Spring
              config={config.slow}
              from={{ opacity: 0, transform: 'translateY(-50px)' }}
              to={{ opacity: 1, transform: 'translateY(0px)' }}>
              {props => <h1  className="ta-c big-title" style={props}>Welcome to Nuklear!</h1>}
            </Spring>
            <Spring
              config={{
                ...config.slow,
                delay: 200
              }}
              from={{ opacity: 0, transform: 'translateY(-50px)' }}
              to={{ opacity: 1, transform: 'translateY(0px)' }}>
              {props => <h1  className="ta-c intro-title" style={props}>The perfect tool for a perfect product. Searchable Reddit inbox.</h1>}
            </Spring>

            <Authenticate/>
          </>
        }

        {/* Shows when a user has registered for the first time */}
        {(!UserStore.is_welcomed && UserStore.getRedditProfile()) &&
          <animated.h1 style={props} className="ta-c big-title">Hey there, {profile.name}!</animated.h1>
        }

        {/* Shows when a user has registered and seen the welcome page */}
        {(UserStore.is_welcomed && UserStore.getRedditProfile()) &&
          <>
            <Index />
            {InboxStore.messages.length > 0 &&
              <ScrollToTop />

            }
          </>
        }
      </div>
    </div>
  );
}));

export default App;
