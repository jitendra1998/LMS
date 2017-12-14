/*
 *
 * Lessons
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/FlatButton';
import { Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';

import BackIcon from 'react-icons/lib/fa/arrow-circle-left';
import PreviousIcon from 'react-icons/lib/fa/arrow-left';
import NextIcon from 'react-icons/lib/fa/arrow-right';
import YoutubeIcon from 'react-icons/lib/fa/youtube-play';
import TextIcon from 'react-icons/lib/fa/file-text-o';
import ExamIcon from 'react-icons/lib/fa/question';
import FileIcon from 'react-icons/lib/fa/file-archive-o';

import './style.css';
import './styleM.css';

export default class Lessons extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      token:localStorage.getItem("token"),
      course:"",
      lessons:[],
      activeLesson:0,
      activeLecture:0,
      activeView:"",
      enrolled:0,
      app:this.props.app
    }
  }

  componentWillMount() {
    this.getCourse(this.props.match.params.id);
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
    fetch("http://houseofhackers.me:81/showCourse/"+id+"/", {
      method:'GET',
      headers:{'Authorization': 'JWT ' + this.state.app.state.token}
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
        let lectures = json.lectures;
        let questions = json.questions;
        let answers = json.answers;
        let files = json.files;

        for(let i = 0; i < lessons.length; i++) {
          lessons[i].lectures = [];
          lessons[i].pendingDelete = false;

          for(let j = 0; j < lectures.length; j++) {
            lectures[j].lectureFiles = [];
            lectures[j].lectureQuestions = [];
            lectures[j].pendingDelete = false;
            lectures[j].userAnswers = [];
            console.log(lectures[j]);

            for(let k = 0; k < files.length; k++) {
              if(lectures[j].id === files[k].lectureID) {
                lectures[j].lectureFiles.push(files[k]);
              }
            }

            for(let l = 0; l < questions.length; l++) {
              questions[l].questionAnswers = [];

              for(let m = 0; m < answers.length; m++) {
                if(questions[l].id === answers[m].questionID) {
                  questions[l].questionAnswers.push(answers[m]);
                }
              }

              if(lectures[j].id === questions[l].lectureID) {
                lectures[j].lectureQuestions.push(questions[l]);
              }
            }

            if(lessons[i].id === lectures[j].lessonID) {
              lessons[i].lectures.push(lectures[j]);
            }
          }
        }
        this.setState({
          course:json.course,
          lessons:lessons,
          enrolled:json.enrolled
        }, function() {
          this.forceUpdate();
          if(this.props.match.params.lid) {
            for(let i = 0; i < this.state.lessons.length; i++) {
              for(let j = 0; j < this.state.lessons[i].lectures.length; j++) {
                if(this.state.lessons[i].lectures[j].id == this.props.match.params.lid) {
                  this.setState({
                    activeLesson:i,
                    activeLecture:j,
                    activeView:this.state.lessons[i].lectures[j]
                  })
                }
              }
            }
          }
          else {
            this.setState({
              activeLesson:0,
              activeLecture:0,
              activeView:this.state.lessons[0].lectures[0]
            })
          }
        });
      }
    }.bind(this))
  }

  changeLecture = (i, j, lecture) => {
    this.setState({
      activeLesson:i,
      activeLecture:j,
      activeView:lecture
    })
  }

  completeLecture = () => {
    let _this = this;
    let lessons = this.state.lessons;
    let data = new FormData();
    data.append('courseID', this.props.match.params.id);
    data.append('lectureID', this.state.activeView.id);
    data.append('answers', this.state.lessons[this.state.activeLesson].lectures[this.state.activeLecture].userAnswers);

    fetch("http://houseofhackers.me:81/completeLecture/", {
      method:'POST',
      body:data,
      headers:{'Authorization': 'JWT '+this.state.token}
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
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].complete = 1;
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].grade = json.grade;
        _this.setState({
          lessons:lessons
        }, function() {
          let activeView = this.state.activeView;
          let activeLecture = this.state.activeLecture;
          if(this.state.activeLecture  < lessons[this.state.activeLesson].lectures.length - 1) {
            activeView = this.state.lessons[this.state.activeLesson].lectures[this.state.activeLecture + 1];
            activeLecture = activeLecture + 1;
          }
          this.setState({
            activeLecture:activeLecture,
            activeView:activeView
          }, function() {
            this.forceUpdate();
          })
        })
      }
    }.bind(this))
  }

  previousLecture = () => {
    let lessons = this.state.lessons;
    let activeView = this.state.activeView;
    let activeLecture = this.state.activeLecture;
    if(this.state.activeLecture !== 0) {
      activeView = this.state.lessons[this.state.activeLesson].lectures[this.state.activeLecture - 1];
      activeLecture = activeLecture - 1;
    }
    this.setState({
      activeLecture:activeLecture,
      activeView:activeView
    })
  }

  handleAnswer = (questionID, event) => {
    let lessons = this.state.lessons;
    let answer = {"questionID":questionID, "answerID":event.target.value};
    let answerCheck = 0;
    for(let i = 0; i < lessons[this.state.activeLesson].lectures[this.state.activeLecture].userAnswers.length; i++) {
      if(lessons[this.state.activeLesson].lectures[this.state.activeLecture].userAnswers[i].questionID === questionID) {
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].userAnswers[i].answerID = event.target.value;
        answerCheck = 1;
      }
    }
    if(answerCheck === 0) {
      lessons[this.state.activeLesson].lectures[this.state.activeLecture].userAnswers.push(answer);
    }

    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })

  }

  renderLectureMenu = (lecture, i, j) => {
    let activeStyle = {};
    let complete = <div className="lmsLessonBlockCircle"></div>;
    let grade = "";

    if(this.state.activeView.id === lecture.id)
    {
      activeStyle.backgroundColor = 'rgba(0, 171, 108, 0.2)'
    }

    if(lecture.complete === 1) {
      complete = <div className="lmsLessonBlockCircleActive"></div>;
    }

    if(lecture.lectureType === "Exam" && lecture.complete === 1) {
      grade = <span style={{color:"#02BB75", fontSize:"0.9em"}}>{lecture.grade}%</span>;
    }

    return(
      <div className="lmsLessonBlockItem" key={j} onClick={() => this.changeLecture(i, j, lecture)} style={activeStyle}>
        <div className="lmsLessonBlockStatus">
          {complete}
        </div>
        <div className="lmsLessonBlockTitle">
          {/*<span style={{marginRight:'10px', color:'#555555'}}>{this.renderIcon(lecture.lectureType)}</span>*/}
          {lecture.lectureName}
          {grade}
        </div>
      </div>
    )
  }

  renderEnroll = () => {
    if(this.state.token) {
      return (
        <div className="lmsLessonMainEnroll">
          Lecture Contents Locked
          <Link to={'/enroll/'+this.props.match.params.id}><FlatButton label="Enroll Now" labelStyle={{color:'#FFFFFF'}}  style={{ height:'50px', marginLeft:'10px', marginRight:'10px', marginTop:'10px'}} backgroundColor="#6fc13e" hoverColor="#4cc498"/></Link>
        </div>
      )
    }
    else {
      return(
        <div className="lmsLessonMainEnroll">
          Lecture Contents Locked
          <Link to={'/signUp'}><FlatButton label="Enroll Now" labelStyle={{color:'#FFFFFF'}}  style={{ height:'50px', marginLeft:'10px', marginRight:'10px', marginTop:'10px'}} backgroundColor="#6fc13e" hoverColor="#4cc498"/></Link>
        </div>
      )
    }
  }

  renderAnswers = (question, i) => {
    if(question.questionType === 'multiple')
    {
      return(
        <div style={{marginLeft:'70px', width:'85%'}}>
          {question.questionAnswers.map((answer, j) => (
            <div key={j}>
              <input type="radio" name={'question-'+ i} value={answer.id} onChange={(event) => this.handleAnswer(question.id, event)}/>
              <span style={{marginLeft:'10px', width:'90%'}}>{answer.answerContent}</span>
            </div>
          ))}
        </div>
      )
    }
    else if(question.questionType === 'open')
    {
      return(
        <div style={{marginLeft:'55px', width:'85%'}}>
          <TextField placeholder="Your Answer" fullWidth={true} multiLine={true} rowsMax={3} name={'question-'+ i}/>
        </div>
      )
    }
  }

  renderCourseMain = () => {
    if(this.state.enrolled === 0)
    {
      return(
        <div className="lmsLessonMainContent">
          {this.renderEnroll()}
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "Text")
    {
      return(
        <div className="lmsLessonMainContent">
          <div dangerouslySetInnerHTML={{ __html: this.state.activeView.lectureContent }} />
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "Video")
    {
      return(
        <div className="lmsLessonMainContent">
          <iframe width="100%" height="800px" src={'https://www.youtube.com/embed/' + this.state.activeView.lectureVideo} frameborder="0"/>
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "File")
    {
      return(
        <div className="lmsLessonMainContent">
          {this.state.activeView.lectureFiles.map((file, index) => (
            <a href={'http://127.0.0.1/media/' + file.fileData} key={index} style={{textDecoration:'none'}} target="_blank"><div className="lmsNewFileBlock" ><span></span> {file.fileData} <span></span></div></a>
          ))}
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "Exam")
    {
      return(
        <div className="lmsLessonMainContent">
          {this.state.activeView.lectureQuestions.map((question, i) => (
            <div className="lmsNewLectureQuestionBlock" key={i} style={{borderBottom:'1px solid #EEEEEE', paddingTop:'15px', paddingBottom:'15px'}}>
              <div className="lmsNewLectureQuestionContent">
                <span className="lmsNewLectureQuestionNum">{i + 1}</span>
                <div>{question.questionContent}</div>
              </div>
              <span style={{display:'flex', flexDirection:'row'}}>
                {this.renderAnswers(question, i)}
              </span>
            </div>
          ))}
          <FlatButton onClick={this.completeLecture} label="Submit Exam" backgroundColor="#6fc13e" hoverColor="#4cc498" labelStyle={{color:'#FFFFFF'}} style={{marginTop:"15px"}}/>
        </div>
      )
    }
  }

  renderIcon = (type) => {
    if(type === "Video") { return(<YoutubeIcon/>) }
    else if(type === "Exam") { return(<ExamIcon/>) }
    else if(type === "Text") { return(<TextIcon/>) }
    else if(type === "File") { return(<FileIcon/>) }
  }

  render() {
    return (
      <div className="container">
        <Helmet title="Lessons" meta={[ { name: 'description', content: 'Description of Lessons' }]}/>

        <header>

        </header>

        <main className="lmsLessonMain">
          <div className="lmsLessonColumnOne">
            <div className="lmsLessonColumnOneHeader">
              <BackIcon color="#FFFFFF" style={{padding:'5px'}} size={30} onClick={this.context.router.history.goBack}/>
            </div>
            <div className="lmsLessonColumnOneContent">
              <div className="lmsLessonColumnOneTitle">{this.state.course.courseName}</div>
              <div className="lmsLessonList">
                {this.state.lessons.map((lesson, i) => (
                  <div className="lmsLessonBlock" key={i}>
                    <div className="lmsLessonBlockHeader">{lesson.lessonName}</div>
                    {lesson.lectures.map((lecture, j) => (
                      this.renderLectureMenu(lecture, i, j)
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lmsLessonColumnTwo">
            <div className="lmsLessonColumnTwoHeader">
              <div className="lmsLessonPreviousButton">
                <FlatButton label="Previous Lesson" onClick={this.previousLecture} icon={<PreviousIcon color="#FFFFFF"/>} fullWidth={true} style={{borderRadius:'none', height:'50px'}} labelStyle={{color:"#FFFFFF"}} hoverColor="#4cc498"/>
              </div>
              <div className="lmsLessonNextButton">
                <FlatButton label="Complete and Continue" onClick={this.completeLecture} icon={<NextIcon color="#FFFFFF"/>} labelPosition="before" fullWidth={true} style={{borderRadius:'none', height:'50px'}} labelStyle={{color:"#FFFFFF"}} backgroundColor="#6fc13e" hoverColor="#4cc498"/>
              </div>
            </div>
            <div className="lmsLessonColumnTwoContent">
              <div className="lmsLessonColumnTwoHeading">{this.state.activeView.lectureName}</div>
              {this.renderCourseMain()}
            </div>
          </div>

        </main>

        <footer>

        </footer>
      </div>
    );
  }
}

Lessons.contextTypes = {
  router: React.PropTypes.object
};
