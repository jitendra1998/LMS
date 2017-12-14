/*
 *
 * Single
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import LinearProgress from 'material-ui/LinearProgress';

import BackIcon from 'react-icons/lib/fa/arrow-circle-left';

import YoutubeIcon from 'react-icons/lib/fa/youtube-play';
import TextIcon from 'react-icons/lib/fa/file-text-o';
import ExamIcon from 'react-icons/lib/fa/question';
import FileIcon from 'react-icons/lib/fa/file-archive-o';

import './style.css';
import './styleM.css';

export default class Single extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeView:"Curriculum",
      course:"",
      lessons:[],
      students:[],
      app:this.props.app
    }
  }

  componentWillMount() {
    this.getCourse(this.props.match.params.id)
  }

  componentWillReceiveProps(app) {
    this.setState({
      app:app.app
    }, function() {
      this.forceUpdate();
    })
  }

  getCourse = (id) => {
    let _this = this;

    fetch("http://houseofhackers.me:81/showCourse/"+id + "/", {
      method:'GET',
      headers: { 'Authorization': 'JWT ' + this.state.app.state.token }
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
        let lessons = json.lessons;

        for(let i = 0; i < lessons.length; i++) {
          lessons[i].lectures = [];

          for(let j = 0; j < json.lectures.length; j++) {
            if(lessons[i].id == json.lectures[j].lessonID) {
              lessons[i].lectures.push(json.lectures[j]);
            }
          }
        }
        this.setState({
          course:json.course,
          lessons:lessons,
          students:json.students
        })
      }
    }.bind(this))
  }

  changeView = (view) => {
    this.setState({
      activeView:view
    })
  }

  renderMenu = () => {
    if(this.state.activeView === "Curriculum")
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}} onClick={() => this.changeView("Curriculum")}>
            <div className="lmsLessonBlockTitle">Curriculum</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Information")}>
            <div className="lmsLessonBlockTitle">Information</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Instructor")}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Students")}>
            <div className="lmsLessonBlockTitle">Students</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Discussion")}>
            <div className="lmsLessonBlockTitle">Discussion</div>
          </div>
        </div>
      )
    }
    else if(this.state.activeView === "Information")
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Curriculum")}>
            <div className="lmsLessonBlockTitle">Curriculum</div>
          </div>
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}} onClick={() => this.changeView("Information")}>
            <div className="lmsLessonBlockTitle">Information</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Instructor")}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Students")}>
            <div className="lmsLessonBlockTitle">Students</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Discussion")}>
            <div className="lmsLessonBlockTitle">Discussion</div>
          </div>
        </div>
      )
    }
    else if(this.state.activeView === "Instructor")
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Curriculum")}>
            <div className="lmsLessonBlockTitle">Curriculum</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Information")}>
            <div className="lmsLessonBlockTitle">Information</div>
          </div>
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}} onClick={() => this.changeView("Instructor")}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Students")}>
            <div className="lmsLessonBlockTitle">Students</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Discussion")}>
            <div className="lmsLessonBlockTitle">Discussion</div>
          </div>
        </div>
      )
    }
    else if(this.state.activeView === "Students")
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Curriculum")}>
            <div className="lmsLessonBlockTitle">Curriculum</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Information")}>
            <div className="lmsLessonBlockTitle">Information</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Instructor")}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}}  onClick={() => this.changeView("Students")}>
            <div className="lmsLessonBlockTitle">Students</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Discussion")}>
            <div className="lmsLessonBlockTitle">Discussion</div>
          </div>
        </div>
      )
    }
    else if(this.state.activeView === "Discussion")
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Curriculum")}>
            <div className="lmsLessonBlockTitle">Curriculum</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Information")}>
            <div className="lmsLessonBlockTitle">Information</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Instructor")}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeView("Students")}>
            <div className="lmsLessonBlockTitle">Students</div>
          </div>
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}} onClick={() => this.changeView("Discussion")}>
            <div className="lmsLessonBlockTitle">Discussion</div>
          </div>
        </div>
      )
    }
  }

  renderCurrentStudent = (student, index) => {
    if(student.status === 'Current') {
      return(
        <div className="lmsDetailStudentBlock" key={index}>
          <div className="lmsDetailStudentBlockLeft">
            <img  className="lmsDetailStudentAvatar" src={'http://houseofhackers.me/media/' + student.profile.avatar_thumbnail}/>
            <div className="lmsDetailStudentName">{student.profile.name}</div>
          </div>
          <div className="lmsDetailStudentBlockRight">
            <div className="lmsDetailStudentProgressValue">{student.complete}</div>
            <LinearProgress mode="determinate" value={student.percent} />
          </div>
        </div>
      )
    }
  }

  renderGraduateStudent = (student, index) => {
    if(student.status === 'Graduate') {
      return(
        <div className="lmsDetailStudentBlock" key={index}>
          <div className="lmsDetailStudentBlockLeft">
            <img  className="lmsDetailStudentAvatar" src={'http://houseofhackers.me/media/' + student.profile.avatar_thumbnail}/>
            <div className="lmsDetailStudentName">{student.profile.name}</div>
          </div>
          <div className="lmsDetailStudentBlockRight">
            <div className="lmsDetailStudentProgressValue">{student.complete}</div>
            <LinearProgress mode="determinate" value={student.percent} />
          </div>
        </div>
      )
    }
  }

  renderLectureStatus = (status) => {
    if(status === 1) {
      return(
        <div className="lmsSingleBlockCircleComplete"></div>
      )
    }
    else {
      return(
        <div className="lmsSingleBlockCircle"></div>
      )
    }
  }

  renderIcon = (type) => {
    if(type === "Video") { return(<YoutubeIcon/>) }
    else if(type === "Exam") { return(<ExamIcon/>) }
    else if(type === "Text") { return(<TextIcon/>) }
    else if(type === "File") { return(<FileIcon/>) }
  }

  renderView = () => {
    if(this.state.activeView === "Curriculum")
    {
      return(
        <div className="lmsSingleCourses">
          <div className="lmsDetailCoursesContainer">
            <div className="lmsDetailCoursesHeader">Class Curriculum</div>
            {this.state.lessons.map((lesson, i) => (
              <div className="lmsDetailCoursesBlock" key={i}>
                <div className="lmsDetailCoursesBlockHeader">{lesson.lessonName}</div>
                <div className="lmsDetailCoursesBlockList">
                  {lesson.lectures.map((lecture, j) => (
                    <div className="lmsDetailCoursesBlockItem" key={j}>
                      <div className="lmsDetailCoursesBlockInfo">
                        {this.renderLectureStatus(lecture.status)}
                        <div className="lmsDetailCoursesBlockIcon">
                          {this.renderIcon(lecture.lectureType)}
                        </div>
                        <div className="lmsDetailCoursesBlockTitle">
                          {lecture.lectureName}
                        </div>
                      </div>
                      <div className="lmsDetailCoursesBlockButton">
                        <Link to={'/lesson/'+this.props.match.params.id+'/'+lecture.id}><FlatButton label="Start" backgroundColor="#6fc13e" labelStyle={{color:'#FFFFFF'}}  /></Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    else if(this.state.activeView === "Instructor")
    {
      return(
        <div className="lmsDetailAuthor">
          <div className="lmsDetailAuthorContainer">
            <div className="lmsDetailAuthorAvatar">
              <img className="lmsDetailAuthorAvatarImg" src={'http://houseofhackers.me/media/' + this.state.course.courseInstructorAvatar}/>
            </div>
            <div className="lmsDetailAuthorInfo">
              <div className="lmsDetailAuthorName">{this.state.course.courseInstructorName}</div>
              <div className="lmsDetailAuthorContent">
                {this.state.course.courseInstructorInfo}
              </div>
            </div>
          </div>
        </div>
      )
    }
    else if(this.state.activeView === "Information")
    {
      return(
        <div className="lmsDetailContent">
          <div dangerouslySetInnerHTML={{ __html: this.state.course.courseInformation }} />
        </div>
      )
    }
    else if(this.state.activeView === 'Students')
    {
      return(
        <div className="lmsDetailStudents">
          <div className="lmsDetailCoursesHeader">Students</div>
          <div className="lmsDetailStudentsContainer">
            <div className="lmsDetailStudentList">
              <div className="lmsDetailStudentHeader">Current</div>
              {this.state.students.map((student, index) => (
                this.renderCurrentStudent(student, index)
              ))}
            </div>
            <div className="lmsDetailStudentList">
              <div className="lmsDetailStudentHeader">Graduated</div>
              {this.state.students.map((student, index) => (
                this.renderGraduateStudent(student, index)
              ))}
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Lesson" meta={[ { name: 'description', content: 'Description of Lessons' }]}/>

        <header>

        </header>

        <main className="lmsLessonMain">
          <div className="lmsLessonColumnOne">
            <div className="lmsLessonColumnOneHeader">
              <Link to="/dashboard"><BackIcon color="#FFFFFF" style={{padding:'5px'}} size={30}/></Link>
            </div>
            <div className="lmsLessonColumnOneContent">
              <div className="lmsSingleLessonImageContainer">
                <img className="lmsSingleLessonImage" src={'http://houseofhackers.me/media/' + this.state.course.courseImage} />
              </div>
              <div className="lmsLessonColumnOneTitle">{this.state.course.courseName}</div>
              <div className="lmsLessonList">
                {this.renderMenu()}
              </div>
            </div>
          </div>
          <div className="lmsLessonColumnTwo">
            <div className="lmsLessonColumnTwoHeader">

            </div>
            <div className="lmsLessonColumnTwoContent">
              {this.renderView()}
            </div>
          </div>

        </main>

        <footer>

        </footer>
      </div>
    );
  }
}

Single.contextTypes = {
  router: React.PropTypes.object
};
