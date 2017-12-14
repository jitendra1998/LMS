/*
 *
 * About
 *
 */

import React from 'react';
import Helmet from 'react-helmet';

import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

import './style.css';
import './styleM.css';

export default class About extends React.PureComponent {
  render() {
    return (
      <div className="container">
        <Helmet title="About" meta={[ { name: 'description', content: 'Description of About' }]}/>
        <Navbar/>
        <main className="lmsAboutMain">
          <div className="lmsAboutblocksContainer">
            <div className="lmsAboutblockRow">
              <div className="lmsAboutblockTextLeft">
                <div className="lmsAboutblockConstraint">
                  <div className="lmsAboutmainTitle">Learning Platform</div>
                  <div className="lmsAboutmainSubtitle">With the increasing number of educational outlets available to us, it becomes difficult to find the right one. LMS provides an open platform in which everybody from all around the world can be educated in pivotal subject matter. Everything from Health to Technology, the LMS creates a safe and efficient learning environment for both the students and teachers to share their knowledge and gain experience. Finish a course and hold your head up high with your new certification. </div>
                </div>
              </div>
              <div className="lmsAboutblockImageMobile"></div>
            </div>
            <div className="lmsAboutblockRow">
              <div className="lmsAboutblockImageWeb"></div>
              <div className="lmsAboutblockTextRight">
                <div className="lmsAboutblockConstraint">
                  <div className="lmsAboutmainTitle">Step-By-Step Instruction</div>
                  <div className="lmsAboutmainSubtitle">Large educational platforms tend to overcomplicate the learning process. LMS goes back to the basics and gives you the freedom to learn at your own pace with the necessary tools for success. Each course is broken down into lessons and each lesson contains various lectures to create a wholesome learning experience. Students can keep track of their progress and Instructors have the ability to provide videos, feedback, and examinations for the students. </div>
                </div>
              </div>
            </div>
            <div className="lmsAboutblockRow">
            <div className="lmsAboutblockTextLeft">
              <div className="lmsAboutblockConstraint">
                <div className="lmsAboutmainTitle">Community Discussion</div>
                <div className="lmsAboutmainSubtitle">One of the biggest culture shocks with online education is the lack of peer to peer communication. With the LMS, this is remedied through community discussion boards included with each course. Students from both past and present can engage with each other for aid, advice, and future opportunities. Being able to rely on your fellow classmate is one of the most important aspects of any educational institution and LMS did not want to take that away from you. </div>
              </div>
            </div>
              <div className="lmsAboutblockImageDesign"></div>
            </div>
          </div>
        </main>
        <Footer/>
      </div>
    );
  }
}

About.contextTypes = {
  router: React.PropTypes.object
};
