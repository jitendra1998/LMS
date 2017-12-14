/*
 *
 * New
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {EditorState, ContentState, convertFromHTML, convertToRaw} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import Snackbar from 'material-ui/Snackbar';
import LinearProgress from 'material-ui/LinearProgress';

import AddIcon from 'react-icons/lib/fa/plus-square-o';
import BackIcon from 'react-icons/lib/fa/arrow-circle-left';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import './style.css';
import './styleM.css';

export default class New extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      snack: false,
      msg: "",
      categories:[],
      lessons:[],
      activeLesson:-1,
      activeLecture:0,
      activeView:"",
      courseName:"",
      courseSummary:"",
      courseInformation:EditorState.createEmpty(),
      courseInstructorName:"",
      courseInstructorInfo:"",
      courseInstructorAvatar:"",
      courseInstructorAvatarPreview:"",
      courseImage:"",
      courseImagePreview:"",
      coursePrice:"",
      courseStatus:"",
      isSaving:false,
      app:this.props.app
    }
  }

  handleRequestClose = () => { this.setState({ snack: false, msg: "" }); };
  showSnack = (msg) => { this.setState({ snack: true, msg: msg }); };

  componentWillMount() {
    this.getCategories();
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
    fetch("http://houseofhackers.me:81/editCourse/"+id+"/", {
      method:'GET',
      headers:{'Authorization': 'JWT '+this.state.app.state.token}
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

            for(let k = 0; k < files.length; k++) {
              files[k].isLoading = false;
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

            if(lessons[i].id == lectures[j].lessonID) {
              lessons[i].lectures.push(lectures[j]);
            }
          }
        }
        this.setState({
          courseName:json.course.courseName,
          courseSummary:json.course.courseSummary,
          courseCategory:json.course.courseCategory,
          courseInformation: EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(json.course.courseInformation))),
          courseInstructorName:json.course.courseInstructorName,
          courseInstructorInfo:json.course.courseInstructorInfo,
          courseInstructorAvatarPreview:'http://houseofhackers.me:81/media/' + json.course.courseInstructorAvatar,
          courseImagePreview:'http://houseofhackers.me:81/media/' + json.course.courseImage,
          coursePrice:json.course.coursePrice,
          courseStatus:json.course.courseStatus,
          lessons:lessons
        }, function() {
          console.log(this.state.lessons)
        })
      }
    }.bind(this))
  }

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

  handleCourseName = (event) => {this.setState({courseName:event.target.value})};
  handleCourseSummary = (event) => {this.setState({courseSummary:event.target.value})};
  handleCoursePrice = (event) => {this.setState({coursePrice:event.target.value})};
  handleCourseCategory = (event, index, value) => { this.setState({ courseCategory:value })}
  handleCourseInformation = (editorState) => {this.setState({courseInformation: editorState, editorState: editorState})};
  handleCourseInstructorName = (event) => {this.setState({courseInstructorName:event.target.value})};
  handleCourseInstructorInfo = (event) => {this.setState({courseInstructorInfo:event.target.value})};

  handleLectureName = (i, j, event) => {
    let lessons = this.state.lessons;
    let activeView = this.state.activeView;

    lessons[i].lectures[j].lectureName = event.target.value;

    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })
  }

  handleLectureContent = (editorState) => {
    let activeView = this.state.activeView;
    let lessons = this.state.lessons;
    activeView.lectureContent = editorState;
    lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureContent = editorState;

    this.setState({
      activeView:activeView,
      lessons:lessons,
      editorState: editorState
    })
  };

  handleLectureType = (event, index, value) => {
    let activeView = this.state.activeView;
    let lessons = this.state.lessons;
    activeView.lectureType = value;
    lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureType = value;

    this.setState({
      activeView:activeView,
      lessons:lessons,
    }, function() {
      this.forceUpdate();
      this.updateLecture(this.state.activeLesson, this.state.activeLecture);
    })
  }

  handleLectureVideo = (event, index, value) => {
    let activeView = this.state.activeView;
    let lessons = this.state.lessons;
    activeView.lectureVideo = event.target.value;
    lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureVideo = event.target.value;

    this.setState({
      activeView:activeView,
      lessons:lessons,
    }, function() {
      this.forceUpdate();
      this.updateLecture(this.state.activeLesson, this.state.activeLecture);
    })
  }

  handleCourseImage = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        courseImage: file,
        courseImagePreview: reader.result
      }, function() {
        this.updateCourseImage();
      });
    }

    reader.readAsDataURL(file);
  };

  handleCourseInstructorAvatar = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        courseInstructorAvatar: file,
        courseInstructorAvatarPreview: reader.result
      }, function() {
        this.updateCourseInstructorAvatar();
      });
    }

    reader.readAsDataURL(file);
  };

  handleLessonName = (index, event) => {
    let lessons = this.state.lessons;
    lessons[index].lessonName = event.target.value
    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })
  }

  handleLectureFile = (event) => {
    event.preventDefault();
    let reader = new FileReader();
    let files = event.target.files;

    let lessons = this.state.lessons;

    if(files.length > 5) {
      this.showSnack('Please Select 5 or Less Files');
    }
    else {
      for(let i = 0; i < files.length; i++) {
        if(lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureFiles.length >= 5) {
          this.showSnack('Please Select 5 or Less Files');
        }
        else {
          let fileData = {"isLoading":true, "fileData":files[i], "id":0};
          lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureFiles.push(fileData);

          reader.onloadend = () => {
            this.setState({
              lessons:lessons
            }, function() {
              this.storeFile(fileData, lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureFiles.length - 1);
              this.forceUpdate();
            });
          }

          reader.readAsDataURL(files[i]);
        }
      }
    }
  }

  createLecture = (index) => {
    let lessons = this.state.lessons;
    let lecture = {"id":0, "lectureName":"Lecture Title", "lectureContent":"", "lectureType":"Text", "lectureFiles":[], "lectureQuestions":[], "pendingDelete":false};

    lessons[index].lectures.push(lecture);

    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })
  }

  storeQuestion = (type) => {
    let _this = this;
    let data = new FormData();
    let lessons = this.state.lessons;
    if(lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions.length < 50) {

      data.append('lectureID', lessons[this.state.activeLesson].lectures[this.state.activeLecture].id);
      data.append('questionContent', "");
      data.append('questionType', type);

      fetch("http://houseofhackers.me:81/storeQuestion/", {
        method:'POST',
        body:data,
        headers:{'Authorization':'JWT ' + this.state.app.state.token}
      })
      .then(function(response) {
        return response.json()
      })
      .then(function(json) {
        if(json.detail) {
          _this.props.app.signOut();
          _this.props.app.handleAuth();
        }
        else if(json.success) {
          let question = {"id":json.success, "questionContent":"", "questionAnswers":[], "questionType":type};
          lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions.push(question);
          this.setState({
            lessons:lessons
          }, function() {
            this.forceUpdate();
          })
          _this.showSnack("Question Added.")
        }
      }.bind(this))
    } else {
      this.showSnack("No More Than 50 Questions per Exam.")
    }
  }

  updateQuestion = (i, event) => {

    let _this = this;
    let data = new FormData();
    let lessons = this.state.lessons;
    let id = lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].id

    data.append('questionContent', event.target.value);

    fetch("http://houseofhackers.me:81/updateQuestion/"+id+"/", {
      method:'PUT',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else if(json.question) {
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionContent = json.question.questionContent;

        this.setState({
          lessons:lessons
        }, function() {
          this.forceUpdate();
        })
      }
    }.bind(this))
  }

  storeAnswer = (i) => {

    let _this = this;
    let data = new FormData();
    let lessons = this.state.lessons;
    let questionID = lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].id;
    if(lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers.length < 6) {

      data.append('questionID', questionID);
      data.append('answerContent', "");
      data.append('isCorrect', false);

      fetch("http://houseofhackers.me:81/storeAnswer/", {
        method:'POST',
        body:data,
        headers:{'Authorization':'JWT ' + this.state.app.state.token}
      })
      .then(function(response) {
        return response.json()
      })
      .then(function(json) {
        if(json.detail) {
          _this.props.app.signOut();
          _this.props.app.handleAuth();
        }
        else if(json.success) {
          let answer = {"id":json.success, "answerContent":"", "isCorrect":false};
          lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers.push(answer);
          this.setState({
            lessons:lessons
          }, function() {
            this.forceUpdate();
          })
        }
      }.bind(this))
    } else {
      this.showSnack("Only 6 Maximum Answers")
    }
  }

  updateAnswer = (i, j, event) => {
    let _this = this;
    let data = new FormData();
    let lessons = this.state.lessons;
    let id = lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers[j].id;

    data.append('answerContent', event.target.value);

    fetch("http://houseofhackers.me:81/updateAnswer/" + id + "/", {
      method:'PUT',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else if(json.answer) {
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers[j].answerContent = json.answer.answerContent;
        this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate();
        })
      }
    }.bind(this))
  }

  setCorrect = (i, j, event) => {

  }

  updateCorrect = (i, j) => {
    let lessons = this.state.lessons;

    for(let x = 0; x < lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers.length; x++) {
      if(lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers[x].isCorrect === true) {
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers[x].isCorrect = false;
      }
    }

    lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers[j].isCorrect = true;

    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })

  }

  updateCourse = (courseStatus) => {
    if(courseStatus === 'Published') {
      this.setState({
        isSaving:true
      })
    }

    let _this = this;
    let data = new FormData();

    let coursePrice = this.state.coursePrice;
    if(coursePrice === null || coursePrice === undefined || coursePrice === "") {
      coursePrice = 0;
    }

    let courseCategory = this.state.courseCategory;
    if(courseCategory === undefined) {
      courseCategory = 0;
    }

    data.append('courseName', this.state.courseName);
    data.append('courseSummary', this.state.courseSummary);
    data.append('courseCategory', courseCategory);
    data.append('courseInformation', draftToHtml(convertToRaw(this.state.courseInformation.getCurrentContent())));
    data.append('courseInstructorName', this.state.courseInstructorName);
    data.append('courseInstructorInfo', this.state.courseInstructorInfo);
    data.append('coursePrice', coursePrice);
    data.append('courseStatus', courseStatus);

    fetch("http://houseofhackers.me:81/updateCourse/"+this.props.match.params.id+"/", {
      method:'PUT',
      body:data,
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
        _this.setState({
          isSaving:false
        })
      }
    }.bind(this))
  };

  updateCourseImage = () => {
    this.setState({
      isSaving:true
    })

    let _this = this;
    let data = new FormData();

    data.append('courseImage', this.state.courseImage);

    fetch("http://houseofhackers.me:81/updateCourseImage/"+this.props.match.params.id+"/", {
      method:'PUT',
      body:data,
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
        _this.setState({
          isSaving:false
        })
      }
    }.bind(this))
  };

  updateCourseInstructorAvatar = () => {
    this.setState({
      isSaving:true
    })

    let _this = this;
    let data = new FormData();

    data.append('courseInstructorAvatar', this.state.courseInstructorAvatar);

    fetch("http://houseofhackers.me:81/updateCourseInstructorAvatar/"+this.props.match.params.id+"/", {
      method:'PUT',
      body:data,
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
        _this.setState({
          isSaving:false
        })
      }
    }.bind(this))
  };

  storeLesson = () => {
    let _this = this;
    let data = new FormData();
    let lessons = this.state.lessons;

    data.append('courseID', this.props.match.params.id);
    data.append('lessonName', "Lesson Title");

    fetch("http://houseofhackers.me:81/storeLesson/", {
      method:'POST',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else if(json.success) {
        let newLesson = {"id":json.success, "lessonName":"Lesson Title", "lectures":[], "pendingDelete":false};
        lessons.push(newLesson);
        this.setState({
          lessons:lessons
        }, function() {
          this.forceUpdate();
        })
        _this.showSnack("Lesson Added.")
      }
    }.bind(this))
  }

  updateLesson = (id, lessonName) => {
    let _this = this;
    let data = new FormData();

    data.append('lessonName', lessonName);

    fetch("http://houseofhackers.me:81/updateLesson/"+id+"/", {
      method:'PUT',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else {
        _this.showSnack('Lesson Updated');
      }
    }.bind(this))
  }

  updateLecture = (i, j) => {
    let _this = this;
    let lessons = this.state.lessons;
    let id = lessons[i].lectures[j].id;

    let data = new FormData();
      data.append('lectureName', lessons[i].lectures[j].lectureName);
      data.append('lectureContent', draftToHtml(convertToRaw(lessons[i].lectures[j].lectureContent.getCurrentContent())));
      data.append('lectureType', lessons[i].lectures[j].lectureType);
      data.append('lectureVideo', lessons[i].lectures[j].lectureVideo);

    fetch("http://houseofhackers.me:81/updateLecture/"+id+"/", {
      method:'PUT',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
    }.bind(this))
  }

  storeLecture = (i) => {
    let _this = this;
    let data = new FormData();
    let lessons = this.state.lessons;

    data.append('lessonID', lessons[i].id);
    data.append('lectureName', "Lecture Title");
    data.append('lectureContent', draftToHtml(convertToRaw(EditorState.createEmpty().getCurrentContent())));
    data.append('lectureType', "Text");
    data.append('lectureVideo', "");

    fetch("http://houseofhackers.me:81/storeLecture/", {
      method:'POST',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json()
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else if(json.success) {
        let lecture = {"id":json.success, "lectureName":"Lecture Title", "lectureContent":EditorState.createEmpty(), "lectureType":"Text", "lectureVideo":"", "lectureFiles":[], "lectureQuestions":[], "pendingDelete":false};
        lessons[i].lectures.push(lecture);
        this.setState({
          lessons:lessons
        }, function() {
          this.forceUpdate();
        })
        _this.showSnack("Lecture Added.")
      }
    }.bind(this))
  }

  storeFile = (file, index) => {
    let _this = this;
    let lessons = this.state.lessons;

    let data = new FormData();
    data.append('lectureID', this.state.activeView.id);
    data.append('fileContent', file.fileData);

    fetch("http://houseofhackers.me:81/storeFiles/", {
      method:'POST',
      body:data,
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.error) {
        _this.showSnack(json.error);
      }
      else if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      }
      else if(json.success){
        lessons[_this.state.activeLesson].lectures[_this.state.activeLecture].lectureFiles[index].isLoading = false;
        lessons[_this.state.activeLesson].lectures[_this.state.activeLecture].lectureFiles[index].id = json.success;
        _this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate()
        })
      }
    }.bind(this))
  }

  deleteLesson = (id, i) => {
    let _this = this;
    let lessons = this.state.lessons;

    fetch("http://houseofhackers.me:81/deleteLesson/" + id + "/", {
      method:'DELETE',
      headers:{'Authorization':'JWT ' + this.state.app.state.token}
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      if(json.detail) {
        _this.props.app.signOut();
        _this.props.app.handleAuth();
      } else {
        lessons.splice(i, 1);
        this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate();
        });
      }
    }.bind(this))
  }

  deleteLecture = (id, i, j) => {
    let _this = this;
    let lessons = this.state.lessons;

    fetch("http://houseofhackers.me:81/deleteLecture/" + id + "/", {
      method:'DELETE',
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
        lessons[i].lectures.splice(j, 1);
        this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate();
        });
      }
    }.bind(this))
  }

  deleteQuestion = (id, i) => {
    let _this = this;
    let lessons = this.state.lessons;

    fetch("http://houseofhackers.me:81/deleteQuestion/"+id+"/", {
      method:'DELETE',
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
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions.splice(i, 1);
        this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate();
        })
      }
    }.bind(this))
  }

  deleteAnswer = (id, i, j) => {
    let _this = this;
    let lessons = this.state.lessons;

    fetch("http://houseofhackers.me:81/deleteAnswer/"+id+"/", {
      method:'DELETE',
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
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureQuestions[i].questionAnswers.splice(j, 1);
        this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate();
        })
      }
    }.bind(this))
  }

  deleteFile = (id, i) => {
    let _this = this;
    let lessons = this.state.lessons;

    fetch("http://houseofhackers.me:81/deleteFile/"+id+"/", {
      method:'DELETE',
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
        lessons[this.state.activeLesson].lectures[this.state.activeLecture].lectureFiles.splice(i, 1);
        this.setState({
          lessons:lessons
        }, function() {
          _this.forceUpdate();
        })
      }
    }.bind(this))
  }

  confirmLessonDelete = (i) => {
    let lessons = this.state.lessons;
    lessons[i].pendingDelete = !lessons[i].pendingDelete;

    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })
  }

  confirmLectureDelete = (i, j) => {
    let lessons = this.state.lessons;
    lessons[i].lectures[j].pendingDelete = !lessons[i].lectures[j].pendingDelete;

    this.setState({
      lessons:lessons
    }, function() {
      this.forceUpdate();
    })
  }

  changeMenu = (i, j = -1) => {
    let _this = this;
    let lessons = this.state.lessons;
    if(j !== -1) {
      if(typeof lessons[i].lectures[j].lectureContent === 'object') {
        lessons[i].lectures[j].lectureContent = draftToHtml(convertToRaw(lessons[i].lectures[j].lectureContent.getCurrentContent()));
      }
    }
    this.setState({
      activeLesson:i,
      activeLecture:j,
      lessons:lessons
    }, function() {
      if(j !== -1) {
        lessons[i].lectures[j].lectureContent = EditorState.createWithContent(ContentState.createFromBlockArray(convertFromHTML(lessons[i].lectures[j].lectureContent)));
        let activeView = lessons[i].lectures[j];
        _this.setState({
          lessons:lessons,
          activeView:activeView
        })
      } else {
        this.updateCourse(this.state.courseStatus);
      }
    })
  }

  renderMenu = (i, j, lecture) => {
    if(i === this.state.activeLesson)
    {
      if(j === this.state.activeLecture)
      {
        return(
          <div className="lmsNewBlockItemContainer" key={j}>
            <div className="lmsNewBlockItem" onClick={() => this.changeMenu(i, j)} style={{borderLeft:'5px solid  #6fc13e'}}>
              <input className="lmsNewBlockItemInput" value={lecture.lectureName} onChange={(event) => this.handleLectureName(i, j, event)} onBlur={() => this.updateLecture(i, j)} />
              <div className="lmsNewLessonCloseIcon"><CloseIcon style={{width:'20px', height:'20px', color:'#888888', cursor:'pointer'}} onClick={() => this.confirmLectureDelete(i, j)}/></div>
            </div>
            {this.renderLectureDelete(lecture.id, i, j)}
          </div>
        )
      }
      else {
        return(
          <div className="lmsNewBlockItemContainer" key={j}>
            <div className="lmsNewBlockItem" onClick={() => this.changeMenu(i, j)}>
              <input className="lmsNewBlockItemInput" value={lecture.lecturName} onChange={(event) => this.handleLectureName(i, j, event)} onBlur={() => this.updateLecture(i, j)}/>
              <div className="lmsNewLessonCloseIcon"><CloseIcon style={{width:'20px', height:'20px', color:'#888888', cursor:'pointer'}} onClick={() => this.confirmLectureDelete(i, j)}/></div>
            </div>
            {this.renderLectureDelete(lecture.id, i, j)}
          </div>
        )
      }
    }
    else {
      return(
        <div className="lmsNewBlockItemContainer" key={j}>
          <div className="lmsNewBlockItem" onClick={() => this.changeMenu(i, j)}>
            <input className="lmsNewBlockItemInput" value={lecture.lectureName} onChange={(event) => this.handleLectureName(i, j, event)} onBlur={() => this.updateLecture(i, j)}/>
            <div className="lmsNewLessonCloseIcon"><CloseIcon style={{width:'20px', height:'20px', color:'#888888', cursor:'pointer'}} onClick={() => this.confirmLectureDelete(i, j)}/></div>
          </div>
          {this.renderLectureDelete(lecture.id, i, j)}
        </div>
      )
    }
  }

  renderDiscussionMenu = () => {
    if(this.state.activeLesson === -1)
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}} onClick={() => this.changeMenu(-1, -1)}>
            <div className="lmsLessonBlockTitle">Course Description</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeMenu(-2, -1)}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
        </div>
      )
    }
    else if(this.state.activeLesson === -2)
    {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" onClick={() => this.changeMenu(-1, -1)}>
            <div className="lmsLessonBlockTitle">Course Description</div>
          </div>
          <div className="lmsLessonBlockItem" style={{borderLeft:'5px solid #6fc13e'}} onClick={() => this.changeMenu(-2, -1)}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
        </div>
      )
    }
    else {
      return(
        <div className="lmsLessonBlock">
          <div className="lmsLessonBlockItem" onClick={() => this.changeMenu(-1, -1)}>
            <div className="lmsLessonBlockTitle">Course Description</div>
          </div>
          <div className="lmsLessonBlockItem" onClick={() => this.changeMenu(-2, -1)}>
            <div className="lmsLessonBlockTitle">Instructor</div>
          </div>
        </div>
      )
    }
  }

  renderPromoImageText = () => {
    if(this.state.courseImagePreview === "" || this.state.courseImagePreview === undefined || this.state.courseImagePreview === null) {
      return(
        <span style={{display:'flex', flexDirection:'column', textAlign:'center'}}>
          Promo Image
          <span style={{fontSize:'0.9rem', marginTop:'5px'}}>For Best Size Use: 1920 x 1080</span>
        </span>
      )
    }
  }

  renderAvatarImageText = () => {
    if(this.state.courseInstructorAvatarPreview === "" || this.state.courseInstructorAvatarPreview === undefined || this.state.courseInstructorAvatarPreview === null) {
      return(
        <span style={{display:'flex', flexDirection:'column', textAlign:'center'}}>
          Instructor Image
          <span style={{fontSize:'0.9rem', marginTop:'5px'}}>Best: 512 x 512</span>
        </span>
      )
    }
  }

  renderFileUpload = () => {
    if(this.state.activeView.lectureFiles.length < 5) {
      return(
        <div>
          <label htmlFor="course-file" className="lmsNewFileAdd">
            Upload New File
          </label>
          <input type="file" onChange={this.handleLectureFile} id="course-file" style={{display:'none'}}/>
        </div>
      )
    }
  }

  renderFile = (file, index) => {
    if(file.isLoading === true) {
      return(
        <div key={index}>
          <div className="lmsNewFileBlock" ><span></span>{file.fileData.name} <CloseIcon size={35} style={{color:'#777777', padding:'5px', cursor:'pointer'}} onClick={() => this.deleteFile(file.id, index)}/></div>
          <LinearProgress mode='indeterminate' />
        </div>
      )
    }
    else {
      return(
        <div key={index}>
          <div className="lmsNewFileBlock"><span></span>{file.fileData.name} <CloseIcon size={35} style={{color:'#777777', padding:'5px', cursor:'pointer'}} onClick={() => this.deleteFile(file.id, index)}/></div>
        </div>
      )
    }
  }

  renderNewQuestion = (question, i) => {

    if(question.questionType === 'multiple') {
      return(
        <div className="lmsNewLectureQuestionBlock" key={i}>
          <div className="lmsNewLectureQuestionContent">
            <span className="lmsNewLectureQuestionNum">{i + 1}</span>
            <TextField floatingLabelText="Question Content" fullWidth={true} onChange={(event) => this.updateQuestion(i, event)} multiLine={true} rowsMax={3}>{question.content}</TextField>
            <CloseIcon style={{width:'25px', height:'25px', color:'#888888', cursor:'pointer'}} onClick={() => this.deleteQuestion(question.id, i)}/>
          </div>
          <span style={{display:'flex', flexDirection:'row'}}>
            <FlatButton label="Add Answer" labelStyle={{color:"#FFFFFF"}} style={{marginLeft:'5px', width:'15%'}} backgroundColor="#6fc13e" hoverColor="#4cc498" onClick={() => this.storeAnswer(i)} />
            <div style={{marginLeft:'30px', width:'85%'}}>
              {question.questionAnswers.map((answer, j) => (
                this.renderNewAnswer(answer, i, j)
              ))}
            </div>
          </span>
        </div>
      )
    }
    else if (question.questionType === 'open') {
      return(
        <div className="lmsNewLectureQuestionBlock" key={i}>
          <div className="lmsNewLectureQuestionContent">
            <span className="lmsNewLectureQuestionNum">{i + 1}</span>
            <TextField floatingLabelText="Question Content" fullWidth={true} onChange={(event) => this.updateQuestion(i, event)} multiLine={true} rowsMax={3}>{question.content}</TextField>
            <CloseIcon style={{width:'25px', height:'25px', color:'#888888', cursor:'pointer'}} onClick={() => this.deleteQuestion(question.id, i)}/>
          </div>
        </div>
      )
    }
  }

  renderNewAnswer = (answer, i, j) => {
    let letter = "A";

    if(j === 0) { letter = "A" }
    else if(j === 1) { letter = "B" }
    else if(j === 2) { letter = "C" }
    else if(j === 3) { letter = "D" }
    else if(j === 4) { letter = "E" }
    else if(j === 5) { letter = "F" }

    return(
      <div style={{marginBottom:'10px', width:'100%', display:'flex', flexDirection:'row', alignItems:'center'}} key={j}>
        <span className="lmsNewLectureQuestionNum">{letter}</span>
        <input type="radio" onChange={() => this.updateCorrect(i, j)} name={'question-'+ i}/>
        <TextField value={answer.answerContent} onChange={(event) => this.updateAnswer(i, j, event)} style={{border:'none', outline:'none', marginLeft:'10px', width:'90%'}} placeholder="Type an Answer..." name={"answerContent-"+j}/>
        <CloseIcon style={{width:'25px', height:'25px', color:'#888888', cursor:'pointer'}} onClick={() => this.deleteAnswer(answer.id, i, j)}/>
      </div>
    )
  }

  renderLessonDelete = (id, i) => {
    let lessons = this.state.lessons;
    if(lessons[i].pendingDelete === true) {
      return(
        <div className="lmsNewDeleteBlock">
          <FlatButton label="Cancel" onClick={() => this.confirmLessonDelete(i)} backgroundColor="#FAFAFA" hoverColor="#EEEEEE" style={{width:'50%', borderRadius:'none'}}/>
          <FlatButton label="Confirm" backgroundColor="#6fc13e" hoverColor="#4cc498" onClick={() => this.deleteLesson(id, i)} style={{color:'#FFFFFF', width:'50%', borderRadius:'none'}}/>
        </div>
      )
    }
  }

  renderLectureDelete = (id, i, j) => {
    let lessons = this.state.lessons;
    if(lessons[i].lectures[j].pendingDelete === true) {
      return(
        <div className="lmsNewDeleteBlock">
          <FlatButton label="Cancel" onClick={() => this.confirmLectureDelete(i, j)} backgroundColor="#FAFAFA" hoverColor="#EEEEEE" style={{width:'50%', borderRadius:'none'}}/>
          <FlatButton label="Confirm" backgroundColor="#6fc13e" hoverColor="#4cc498" onClick={() => this.deleteLecture(id, i, j)} style={{color:'#FFFFFF', width:'50%', borderRadius:'none'}}/>
        </div>
      )
    }
  }

  renderSaving = () => {
    if(this.state.isSaving === true) {
      return(
        <LinearProgress mode='indeterminate' style={{position:'fixed', top:'0'}}/>
      )
    }
  }

  renderLectureContent = () => {
    if(this.state.activeView.lectureType === "Text")
    {
      return(
        <div className="lmsLessonMainContent">
          <Editor
            editorState={this.state.activeView.lectureContent}
            toolbarClassName="home-toolbar"
            wrapperClassName="home-wrapper"
            editorClassName="rdw-editor-main"
            onEditorStateChange={this.handleLectureContent}
            placeholder="Type the Course Information Here..."
            onBlur={() => this.updateLecture(this.state.activeLesson, this.state.activeLecture)}
          />
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "Video")
    {
      return(
        <div className="lmsLessonMainContent">
          <div className="lmsNewVideoBlock">
            <input className="lmsNewVideoBlockInput" placeholder="Paste Link to Video" value={this.state.activeView.lectureVideo} onChange={this.handleLectureVideo}/>
            <span style={{fontSize:'0.9rem', marginTop:'5px'}}>Currently Supported: Youtube, Vimeo, and Embed</span>
          </div>
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "File")
    {
      return(
        <div className="lmsLessonMainContent">
          <span style={{fontSize:'0.9rem', marginTop:'5px', color:'#AAAAAA', fontFamily:'Lato'}}>Maximum 5 Files per Lecture</span>
          <div className="lmsNewFileList">
            {this.state.activeView.lectureFiles.map((file, index) => (
              this.renderFile(file, index)
            ))}
            {this.renderFileUpload()}
          </div>
        </div>
      )
    }
    else if(this.state.activeView.lectureType === "Exam")
    {
      return(
        <div className="lmsLessonMainContent">
          <div className="lmsNewQuestionButton">
            <FlatButton label="Add Multiple Choice" labelStyle={{color:"#FFFFFF"}} style={{marginRight:'10px'}} backgroundColor="#6fc13e" hoverColor="#4cc498"  onClick={() => this.storeQuestion('multiple')}/>
          </div>
          <div className="lmsNewLectureQuestionList">
            {this.state.activeView.lectureQuestions.map((question, i) => (
              this.renderNewQuestion(question, i)
            ))}
          </div>
        </div>
      )
    }
  }

  renderCourseImage = () => {
    if(this.state.courseImage === "")
    {
      return(
        <img src={'http://houseofhackers.me/media/' + this.state.courseImagePreview} className="lmsNewCourseImagePreview"/>
      )
    }
    else {
      return(
        <img src={this.state.courseImagePreview} className="lmsNewCourseImagePreview"/>
      )
    }
  }

  renderCourseContent = () => {
    if(this.state.activeLesson === -1)
    {
      return(
        <div className="lmsLessonColumnTwoContent">
          <div className="lmsLessonColumnTwoHeading">Course Description</div>
          <div className="lmsLessonMainContent">
            <div className="lmsLessonMainInline">
              <TextField className="lmsLessonCourseSummary" floatingLabelText="Course Summary" onChange={this.handleCourseSummary}value={this.state.courseSummary} fullWidth={true} multiLine={true} rowsMax={2}/>
              <SelectField floatingLabelText="Category" value={this.state.courseCategory} onChange={this.handleCourseCategory} fullWidth={true} style={{marginLeft:'10px'}}>
                {this.state.categories.map((category, index) => (
                  <MenuItem value={category.id} primaryText={category.categoryName} key={index}/>
                ))}
              </SelectField>
              <div style={{display:'flex', flexDirection:'row', width:'100%', alignItems:'flex-end', marginLeft:'5px'}}>
                <span style={{color:'#999999', marginBottom:'10px', fontSize:'1.4em', marginRight:'5px'}}>$</span>
                <TextField className="lmsLessonCourseSummary" floatingLabelText="Course Price" onChange={this.handleCoursePrice}value={this.state.coursePrice} fullWidth={true}/>
              </div>
            </div>
            <div className="lmsLessonMainImageRow">
              <label htmlFor="course-image" className="lmsLessonMainImageBlock">
                {this.renderPromoImageText()}
                {this.renderCourseImage()}
              </label>
              <input type="file" onChange={this.handleCourseImage} id="course-image" style={{display:'none'}}/>
              <div className="lmsLessonMainImageBlock">
                <input className="lmsNewVideoBlockInput" placeholder="Paste Link to Promo Video (Optional)" value={this.state.courseVideo} onChange={this.handleCourseVideo}/>
              </div>
            </div>
            <Editor
              editorState={this.state.courseInformation}
              toolbarClassName="home-toolbar"
              wrapperClassName="home-wrapper"
              editorClassName="rdw-editor-main"
              onEditorStateChange={this.handleCourseInformation}
              placeholder="Type the Course Information Here..."
            />
          </div>
        </div>
      )
    }
    else if(this.state.activeLesson === -2)
    {
      return(
        <div className="lmsLessonColumnTwoContent">
          <div className="lmsLessonColumnTwoHeading">Course Instructor</div>
          <div className="lmsLessonMainContent">
          <div className="lmsDetailAuthor">
            <div className="lmsDetailAuthorContainer">
              <div className="lmsDetailAuthorAvatar">
                <label htmlFor="course-avatar" className="lmsLessonMainAvatarBlock">
                  {this.renderAvatarImageText()}
                  <img src={this.state.courseInstructorAvatarPreview} className="lmsNewCourseImagePreview"/>
                </label>
                <input type="file" onChange={this.handleCourseInstructorAvatar} id="course-avatar" style={{display:'none'}}/>
              </div>
              <div className="lmsDetailAuthorInfo">
                <input className="lmsNewInstructorName" placeholder="Instructor Name" onChange={this.handleCourseInstructorName} value={this.state.courseInstructorName}/>
                <div>
                  <textarea className="lmsNewAuthorContent" placeholder="Instructor Description..." value={this.state.courseInstructorInfo} onChange={this.handleCourseInstructorInfo}></textarea>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )
    }
    else
    {
      return(
        <div className="lmsLessonColumnTwoContent">
          <div className="lmsNewLectureHeading">
            <div className="lmsLessonColumnTwoHeading">{this.state.activeView.lectureName}</div>
            <SelectField floatingLabelText="Lecture Type" value={this.state.activeView.lectureType} onChange={this.handleLectureType}>
              <MenuItem value="Text" primaryText="Text"/>
              <MenuItem value="Video" primaryText="Video"/>
              <MenuItem value="File" primaryText="File"/>
              <MenuItem value="Exam" primaryText="Exam"/>
            </SelectField>
          </div>
          {this.renderLectureContent()}
        </div>
      )
    }
  }

  render() {
    return (
      <div className="container">
        <Helmet title="New" meta={[ { name: 'description', content: 'Description of New' }]}/>

        <header>
          {this.renderSaving()}
        </header>

        <main className="lmsLessonMain">
          <div className="lmsLessonColumnOne">
            <div className="lmsLessonColumnOneHeader">
              <Link to="/dashboard"><BackIcon color="#FFFFFF" style={{padding:'5px'}} size={30}/></Link>
            </div>
            <div className="lmsLessonColumnOneContent">
              <textarea className="lmsNewCourseNameInput" placeholder="Your Course Name" onChange={this.handleCourseName} value={this.state.courseName}></textarea>
              <div className="lmsLessonList">
                {this.renderDiscussionMenu()}
                <div className="lmsNewLessonAddButton" onClick={this.storeLesson}>
                  <AddIcon color="#555555" size={25}/>
                  <div className="lmsNewLessonAddButtonTitle">Add Lesson</div>
                </div>
                {this.state.lessons.map((lesson, i) => (
                  <div className="lmsLessonBlock" key={i}>
                    <div className="lmsNewLessonBlockHeader">
                      <input className="lmsNewLessonBlockHeaderInput" value={lesson.lessonName} onChange={(event) => this.handleLessonName(i, event)} onBlur={(event) => this.updateLesson(lesson.id, event.target.value)}/>
                      <div className="lmsNewLessonCloseIcon"><CloseIcon style={{width:'20px', height:'20px', color:'#888888', cursor:'pointer'}} onClick={() => this.confirmLessonDelete(i)}/></div>
                    </div>
                    {this.renderLessonDelete(lesson.id, i)}
                    {lesson.lectures.map((lecture, j) => (
                      this.renderMenu(i, j, lecture)
                    ))}
                    <div className="lmsNewLessonAddButton" onClick={() => this.storeLecture(i)}>
                      <AddIcon color="#555555" size={25}/>
                      <div className="lmsNewLessonAddButtonTitle">Add Lecture</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lmsLessonColumnTwo">
            <div className="lmsNewColumnTwoHeader">
              <FlatButton label="Save" labelStyle={{color:"#FFFFFF"}} style={{marginRight:'10px'}} hoverColor="#4cc498" onClick={() => this.updateCourse('Draft')}/>
              <FlatButton label="Publish" labelStyle={{color:"#FFFFFF"}} style={{marginRight:'10px'}} backgroundColor="#6fc13e" hoverColor="#4cc498" onClick={() => this.updateCourse('Published')}/>
            </div>
            {this.renderCourseContent()}
          </div>

        </main>

        <footer>

        </footer>
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

New.contextTypes = {
  router: React.PropTypes.object
};
