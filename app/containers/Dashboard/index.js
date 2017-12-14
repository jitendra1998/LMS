/*
 *
 * Dashboard
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import Snackbar from 'material-ui/Snackbar';

import PreviousIcon from 'react-icons/lib/fa/arrow-left';
import NextIcon from 'react-icons/lib/fa/arrow-right';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

import './style.css';
import './styleM.css';

export default class Dashboard extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      category:0,
      courses:[],
      categories:[],
      count:9,
      page:1,
      nextPage:0,
      previousPage:0,
      deleteDialog:false,
      snack: false,
      msg: "",
      app:this.props.app
    }
  }

  componentWillMount() {
    this.getCourses(0);
    this.getCategories();
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

  handleCategory = (event, index, value) => {
    this.setState({
      page:1,
      category:value
    }, function() {
      this.getCourses(value);
    })
  }

  handleDelete = (course = 0, index = 0) => {
    this.setState({
      deleteDialog: !this.state.deleteDialog,
      activeCourse:course.id,
      activeIndex:index
    });
  };

  getCourses = (category = 0) => {
    let _this = this;

    fetch('http://houseofhackers.me:81/myCourses/'+category+'/'+this.state.count+'/'+this.state.page+'/', {
      method:'GET',
      headers: {
        'Authorization': 'JWT ' + this.state.app.state.token
      }
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error) {

      }
      else if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else {
        this.setState({
          nextPage:json.nextPageNum,
          previousPage:json.previousPageNum,
          courses: json.courses,
          isLoading:false
        })
      }
    }.bind(this))
  };

  getNextCourses = (category) => {
    this.setState({
      page:this.state.nextPage
    }, function() {
      this.getCourses(category);
    })
  };

  getPreviousCourses = (category) => {
    this.setState({
      page:this.state.previousPage
    }, function() {
      this.getCourses(category);
    })
  };



  getCategories = () => {
    fetch("http://houseofhackers.me:81/getCategories/", {
      method:'GET'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        categories:json.categories
      })
    }.bind(this))
  }

  createCourse = () => {
    let _this = this;

    fetch('http://houseofhackers.me:81/storeCourse/', {
      method:'POST',
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else {
        _this.context.router.history.push('/update/'+json.course)
      }
    }.bind(this))
  }

  deleteCourse = () => {
    let _this = this;
    let course = this.state.course;

    fetch("http://127.0.0.1/deleteCourse/"+this.state.activeCourse+"/", {
      method:'POST',
      headers:{'Authorization':'JWT '+ this.state.app.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else if(json.success) {
        _this.showSnack("Course Removed.");
        course.splice(this.state.activeIndex, 1);

        _this.setState({
          course:course
        })
      }
    }.bind(this))
  }

  renderPageButtons = () => {
    let previousDisabled = false;
    let nextDisabled = false;
    let previousColor = "#6fc13e";
    let nextColor = "#6fc13e";

    if(this.state.previousPage === 0) {
      previousDisabled = true;
      previousColor = "#DDDDDD";
    }

    if(this.state.nextPage === 0) {
      nextDisabled = true;
      nextColor = "#DDDDDD";
    }

    return(
      <div className="lmsBrowseButtons">
        <FlatButton label="Previous" backgroundColor={previousColor} icon={<PreviousIcon color="#FFFFFF"/>} labelStyle={{color:'#FFFFFF'}}  style={{ width:'200px', height:'40px', marginLeft:'10px', marginRight:'10px'}} onClick={() => this.getPreviousCourses(this.state.category)} disabled={previousDisabled}/>
        <FlatButton label="Next" backgroundColor={nextColor} icon={<NextIcon color="#FFFFFF"/>} labelPosition="before" labelStyle={{color:'#FFFFFF'}}  style={{ width:'200px', height:'40px', marginLeft:'10px', marginRight:'10px'}} onClick={() => this.getNextCourses(this.state.category)} disabled={nextDisabled}/>
      </div>

    )
  }

  renderNewCourse = () => {
    if(this.state.app.state.user.roleID === 1 || this.state.app.state.user.roleID === 3) {
      return(
        <div className="lmsHomeMainBlock" onClick={this.createCourse}>
          <Card style={{height:'435px'}}>
            <CardMedia style={{width:'100%', height:'380px', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
              <img src="https://cdn3.iconfinder.com/data/icons/simple-toolbar/512/add_plus_new_user_green_page_file_up_text-512.png" style={{width:'100%', height:'auto'}}/>
            </CardMedia>
            <CardTitle title="Create a Course" />
          </Card>
        </div>
      )
    }
    else {
      return(<div style={{display:'none'}}></div>)
    }
  }

  renderProgress = (course) => {
    if(this.state.app.state.user) {
      if(this.state.app.state.user.roleID !== 3) {
        return(
          <CardText>
            <span className="lmsProgressHeader">Completed: {course.complete}</span>
            <LinearProgress mode="determinate" value={course.percent} />
          </CardText>
        )
      }
    } else {
      return(
        <CardText></CardText>
      )
    }
  }

  renderActions = (course, index) => {
    if(this.state.app.state.user) {
      if(this.state.app.state.user.userID === course.userID) {
        return(
          <CardActions>
            <Link to={'/update/'+course.id}><FlatButton label="Edit" /></Link>
            <FlatButton label="Delete" onClick={() => this.handleDelete(course, index)}/>
          </CardActions>
        )
      }
    } else {
      return(
        <CardActions>
          <Link to={'/single/'+course.id}><FlatButton label="View Course" /></Link>
        </CardActions>
      )
    }
  }

  render() {

    const actions = [
      <FlatButton
        label="Cancel"
        onClick={this.handleDelete}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.deleteCourse}
      />,
    ];

    return (
      <div className="container">
        <Helmet title="Dashboard" meta={[ { name: 'description', content: 'Description of Dashboard' }]}/>

        <header>
          <Navbar app={this.state.app}/>
        </header>

        <main className="lmsHomeMain" style={{marginTop:'50px'}}>
          <div className="lmsHomeMainContainer">
            <div className="lmsHomeMainList">
              {this.renderNewCourse()}
              {this.state.courses.map((course, index) => (
                <div className="lmsHomeMainBlock" key={index}>
                  <Link to={'/detail/'+course.id} style={{textDecoration:'none'}}>
                    <Card style={{height:'385px'}}>
                      <CardMedia style={{width:'100%', height:'240px', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                        <img src={'http://houseofhackers.me/media/'+course.courseImage} style={{width:'100%', height:'auto'}}/>
                      </CardMedia>
                      <CardTitle title={course.courseName} subtitle={course.courseSummary} />
                      {this.renderProgress(course)}
                    </Card>
                  </Link>
                  <Card>
                    {this.renderActions(course, index)}
                  </Card>
                </div>
              ))}
            </div>
            {this.renderPageButtons()}
          </div>
        </main>
        <Footer/>

        <Dialog
          title="Delete Course"
          actions={actions}
          modal={false}
          open={this.state.deleteDialog}
          onRequestClose={this.handleDelete}
        >
          Are you sure you want to delete this Course?
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

Dashboard.contextTypes = {
  router: React.PropTypes.object
};
