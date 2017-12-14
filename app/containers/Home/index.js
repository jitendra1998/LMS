/*
 *
 * Home
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

import './style.css';
import './styleM.css';

export default class Home extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      courses:[],
      app:this.props.app
    }
  }

  componentWillMount() {
    this.getCourses()
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  getCourses = () => {

    fetch("http://houseofhackers.me:81/getCourses/0/6/1/", {
      method:'GET',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        courses: json.courses,
      })
    }.bind(this))
  };

  render() {
    return (
      <div className="container">
        <Helmet title="Home" meta={[ { name: 'description', content: 'Description of Home' }]}/>
        <Navbar app={this.state.app}/>
        <header className="lmsHomeHeader">
          <div className="lmsHomeHeaderHeading">
            Let The Learning Begin
          </div>
          <div className="lmsHomeHeaderText">
            Welcome to the resource & learning destination for all students! Powering courses across different skills and goals.
          </div>
          <Link to='/signUp' style={{marginTop:'15px', width:'20%', maxWidth:'200px'}}><RaisedButton label="Join Now" backgroundColor="#6fc13e" labelStyle={{color:'#FFFFFF', fontWeight:'Bold'}} style={{width:'100%'}}/></Link>
        </header>

        <main className="lmsHomeMain">
          <div className="lmsHomeMainContainer">
            <div className="lmsHomeMainHeading">Latest Courses</div>
            <div className="lmsHomeMainList">
              {this.state.courses.map((course, index) => (
                <Link className="lmsHomeMainBlock" key={index} to={'/course/'+course.id}>
                  <Card style={{height:'385px'}}>
                    <CardMedia style={{width:'100%', height:'240px', overflow:'hidden', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                      <img src={'http://houseofhackers.me/media/' + course.courseImage} />
                    </CardMedia>
                    <CardTitle title={course.courseName} subtitle={course.courseSummary} />
                  </Card>
                </Link>
              ))}
            </div>
            <Link to='/browse' style={{marginTop:'15px', width:'20%', maxWidth:'200px'}}><RaisedButton label="View All Courses" backgroundColor="#6fc13e" labelStyle={{color:'#FFFFFF', fontWeight:'Bold'}} style={{width:'100%'}}/></Link>
          </div>
          <div className="lmsHomeCallToAction">
            Get smart about your future. Join our learning community today!
          </div>
          <div className="lmsHomeBuzz">
            <div className="lmsHomeBuzzBlock">
              <div className="lmsHomeBuzzHeader">Chill Out and Learn</div>
              <div className="lmsHomeBuzzContent">
                Take courses during your lunch break, post workout, from home, whenever, wherever. Courses are conveniently available 24/7/365. #ClassOnTheCouch
              </div>
            </div>
            <div className="lmsHomeBuzzBlock">
              <div className="lmsHomeBuzzHeader">Fuel Your Future</div>
              <div className="lmsHomeBuzzContent">
                From coding to design to business, all of today’s in-demand skills are here. With more courses added daily, your resume will never look better.
              </div>
            </div>
            <div className="lmsHomeBuzzBlock">
              <div className="lmsHomeBuzzHeader">Stay Sharp</div>
              <div className="lmsHomeBuzzContent">
                All courses include LIFETIME access so you can always drop back in for a refresher.
              </div>
            </div>
            <div className="lmsHomeBuzzBlock">
              <div className="lmsHomeBuzzHeader">Don&#39;t Worry, Be Happy</div>
              <div className="lmsHomeBuzzContent">
                We're committed to providing the best online learning experience on the Web! If you experience an issue, contact us within 7 days and we'll be happy to help.
              </div>
            </div>
          </div>
          <div className="lmsJoinCallToAction">
            Still Have More Questions? Feel Free to Contact Us!
          </div>
        </main>

        <Footer/>
      </div>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object
};
