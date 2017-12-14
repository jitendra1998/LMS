/*
 *
 * App
 *
 */

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { Switch, Route, Redirect } from 'react-router-dom';

import Home from 'containers/Home';
import Browse from 'containers/Browse';
import Detail from 'containers/Detail';
import Lessons from 'containers/Lessons';
import Dashboard from 'containers/Dashboard';
import Single from 'containers/Single';
import New from 'containers/New';
import SignIn from 'containers/SignIn';
import SignUp from 'containers/SignUp';
import Enroll from 'containers/Enroll';
import About from 'containers/About';
import NotFound from 'containers/NotFound';

import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import { Tabs, Tab } from 'material-ui/Tabs';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';

import './style.css';
import './styleM.css';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      token:localStorage.getItem('token'),
      user:JSON.parse(localStorage.getItem('user')),
      snack: false,
      msg: "",
      email:"",
      username:"",
      password:"",
      authOpen:false
    };
  }

  static propTypes = { children: React.PropTypes.node,};
  static childContextTypes = { muiTheme: React.PropTypes.object };
  getChildContext() {
    var theme = getMuiTheme();
    theme.textField.focusColor = "#6fc13e";
    theme.inkBar.backgroundColor = "#38ae47";
    theme.tabs.backgroundColor = "#6fc13e";
    return { muiTheme: theme }
  };

  handleRequestClose = () => { this.setState({ snack: false, msg: "" }); };
  showSnack = (msg) => { this.setState({ snack: true, msg: msg }); };

  handleUsername = (event) => {this.setState({username:event.target.value})}
  handleEmail = (event) => {this.setState({email:event.target.value})}
  handlePassword = (event) => {this.setState({password:event.target.value})}
  handleAuth = () => { this.setState({authOpen:!this.state.authOpen}) }

  signIn = () => {
    let _this = this;
    let data = new FormData();
    data.append('username', this.state.username);
    data.append('password', this.state.password);

    fetch('http://houseofhackers.me:81/signIn/', {
      method:'POST',
      body:data
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error)
      {
        _this.showSnack(json.error);
      }
      else if(json.token)
      {
        localStorage.setItem('token', json.token);
        this.setState({
          token:json.token
        })
        fetch('http://houseofhackers.me:81/getUser/', {
          method:'GET',
          headers: {'Authorization' : 'JWT ' + json.token}
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(json) {
          localStorage.setItem('user', JSON.stringify(json.user));
          _this.setState({
            user:json.user
          })
          _this.showSnack("Welcome " + json.user.name);
          _this.handleAuth();
        })
      }
    }.bind(this));
  };

  signUp = () => {
    let _this = this;
    let data = new FormData();
    data.append('email', this.state.email);
    data.append('username', this.state.username);
    data.append('password', this.state.password);

    fetch('http://houseofhackers.me:81/signUp/', {
      method:'POST',
      body:data
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error)
      {
        _this.showSnack(json.error);
      }
      else if(json.success)
      {
        _this.signIn();
      }
    }.bind(this));
  };

  signOut = (redirect = 0) => {
    let _this = this;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.showSnack("Good-bye!");
    this.setState({
      token:"",
      user:"",
    }, function() {
      if(redirect === 1) {
        setTimeout(function(){_this.context.router.history.push('/')}, 2000);
      }
    })
  };



  render() {
    return (
      <div>
        <MuiThemeProvider>
          <Switch>
            <Route exact path='/' render={() => <Home app={this}/> }/>
            <Route path='/browse' render={() => <Browse app={this}/>}/>
            <Route path='/course/:id' render={(props) => <Detail {...props} app={this}/>}/>
            <Route path='/lesson/:id/:lid' render={(props) => <Lessons {...props}  app={this}/>}/>
            <Route path='/lesson/:id' render={(props) => <Lessons {...props}  app={this}/>}/>
            <Route path='/dashboard' render={(props) => <Dashboard {...props} app={this}/>}/>
            <Route path='/detail/:id' render={(props) => <Single {...props}  app={this}/>}/>
            <Route path='/update/:id' render={(props) => <New {...props}  app={this}/>}/>
            <Route path='/enroll/:id' render={(props) => <Enroll {...props}  app={this}/>}/>
            <Route path='/about' render={() => <About app={this}/>}/>
            <Route path='/signup' render={() => <SignUp app={this}/>}/>
            <Route path='/signIn' render={() => <SignIn app={this}/>}/>
            <Route path='*' render={() => <NotFound/>}/>
          </Switch>
        </MuiThemeProvider>

        <Dialog onRequestClose={this.handleAuth} open={this.state.authOpen} bodyStyle={{padding:"0"}}>
          <Tabs value={this.state.activeTab} onChange={this.handleTab}>
            <Tab label="Sign In" >
              <div className="lmsAuthBlock">
                <div className="lmsAuthHeader">Sign In to LMS</div>
                <TextField floatingLabelText="E-mail"  fullWidth={true} onChange={this.handleUsername} value={this.state.username} />
                <TextField floatingLabelText="Password"  fullWidth={true} onChange={this.handlePassword} value={this.state.password} type="password"/>
                <FlatButton style={{marginTop:'15px', color:"#FFFFFF", background:"#6fc13e", width:"100%"}} onClick={this.signIn}>Sign In</FlatButton>
              </div>
            </Tab>
            <Tab label="Sign Up" >
              <div className="lmsAuthBlock">
                <div className="lmsAuthHeader">Sign Up to LMS</div>
                <TextField floatingLabelText="Full Name"  fullWidth={true} onChange={this.handleUsername} value={this.state.username}/>
                <TextField floatingLabelText="E-Mail" fullWidth={true} onChange={this.handleEmail} value={this.state.email}/>
                <TextField floatingLabelText="Password"  fullWidth={true} onChange={this.handlePassword} value={this.state.password} type="password"/>
                <FlatButton style={{marginTop:'15px', color:"#FFFFFF", background:"#6fc13e", width:"100%"}} onClick={this.signUp}>Sign Up</FlatButton>
              </div>
            </Tab>
          </Tabs>
        </Dialog>
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

App.contextTypes = {
  router: React.PropTypes.object
};
