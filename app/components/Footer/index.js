/**
*
* Footer
*
*/

import React from 'react';

import './style.css';
import './styleM.css';

export default class Footer extends React.PureComponent {
  render() {
    return (
      <div className="footerComponent">
        <span></span>
        <span className="footerCopyright">LMS - Copyright 2017 | All Rights Reserved</span>
        <span></span>
      </div>
    );
  }
}

Footer.contextTypes = {
  router: React.PropTypes.object
};
