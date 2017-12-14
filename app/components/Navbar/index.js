/**
*
* Navbar
*
*/

import React from 'react';
import { Link } from 'react-router-dom';

import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';

import './style.css';
import './styleM.css';

import Bars from 'react-icons/lib/fa/bars';

export default class Navbar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      menuOpen:false,
      userMenu:false,
      token:localStorage.getItem('token'),
      user:JSON.parse(localStorage.getItem('user')),
      snack: false,
      msg: "",
      app:this.props.app,
    }
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  handleRequestClose = () => { this.setState({ snack: false, msg: "" }); };
  showSnack = (msg) => { this.setState({ snack: true, msg: msg }); };

  handleSignOut = () => {
    this.handleUserMenu();
    this.props.app.signOut(1)
  }

  handleMenu = () => {
    this.setState({
      menuOpen:!this.state.menuOpen
    })
  }

  handleUserMenu = () => {
    this.setState({
      userMenu:!this.state.userMenu
    })
  }

  renderUser = () => {
    let avatar = "";
    if(this.state.app.state.user) {
      avatar = this.state.app.state.user.avatar;
    }

    if(this.state.app.state.token && this.state.app.state.user) {
      return(
        <div className="navButton" onClick={this.handleUserMenu}><img src={avatar} className="userAvatarNavbar"/> {this.state.app.state.user.name}</div>
      )
    }
    else {
      return(
        <div className="userContainer">
          <div className="navButton" onClick={this.props.app.handleAuth}>Sign In / Sign Up</div>
        </div>
      )
    }
  }

  renderUserMenu = () => {
    if(this.state.userMenu === true)
    {
      return(
        <div className="userMenuNavBar">
          <div className="userMenuButton" onClick={() => this.handleSignOut()}>Sign Out</div>
        </div>
      )
    }
  }

  renderMenu = () => {
    if(this.state.menuOpen === true) {
      return(
        <nav className="navMobile">
          <Link to="/" className="navButton">Home</Link>
          <Link to="/browse" className="navButton">Browse</Link>
          <Link to="/dashboard" className="navButton">My Courses</Link>
          {this.renderUser()}
        </nav>
      )
    }
  }

  renderMyCourse = () => {
    if(this.state.app.state.token) {
      return(
        <Link to="/dashboard" className="navButton">My Courses</Link>
      )
    } else {
      return(
        <div onClick={this.props.app.handleAuth} className="navButton">My Courses</div>
      )
    }
  }

  render() {
    return (
      <div className="headerComponent">
        <div className="navbarContainer">
          <div className="navBar">
            <Link className="siteName" to={'/'} style={{textDecoration:'none'}}>
              LMS
            </Link>

            <nav className="nav">
              <Link to="/" className="navButton">Home</Link>
              <Link to="/browse" className="navButton">Browse</Link>
              {this.renderMyCourse()}
              {this.renderUser()}
            </nav>

            <Bars className="menuIcon" onClick={this.handleMenu}/>

          </div>
          {this.renderUserMenu()}
        </div>
        {this.renderMenu()}

        <Snackbar
          open={this.state.snack}
          message={this.state.msg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />

      </div>
    );
  }
}

Navbar.contextTypes = {
  router: React.PropTypes.object
};
