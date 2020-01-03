import React from 'react';
import './App.scss'
import AuthRedditBtn from '../../buttons/AuthRedditBtn';

const App = () => {
  return (
    <div className="app-wrapper d-f ai-c">
      <div className="container center">
        <h1 className="ta-c big-title">Welcome to Reddify!</h1>
        <p className="intro-title">The perfect tool for a perfect product. Searchable Reddit inbox.</p>
        <div className="d-f jc-c">
          <AuthRedditBtn
            text="Authenticate with Reddit"
            classNames="animatedOpen"
          />
       </div>
      </div>
    </div>
  );
}

export default App;
