import React from 'react';
import './ScrollToTop.scss'
const ScrollToTop = () => {
  return (
    <div className="scroll-to-top-wrapper" onClick={() => window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })}>
      <i className="fas fa-arrow-alt-circle-up"></i>
    </div>
  );
}

export default ScrollToTop;
