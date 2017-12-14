/*
 *
 * Enroll
 *
 */

import React from 'react';
import Helmet from 'react-helmet';
import {StripeProvider, Elements, injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, PaymentRequestButtonElement} from 'react-stripe-elements';

import Navbar from 'components/Navbar';
import Payment from 'components/Payment';
import Footer from 'components/Footer';

import './style.css';
import './styleM.css';

export default class Enroll extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      course:"",
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
    fetch("http://houseofhackers.me:81/showCourse/"+id+"/", {
      method:'GET'
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(json) {
      this.setState({
        course:json.course,
      })
    }.bind(this))
  }

  renderPrice = () => {
    if(this.state.course.coursePrice === 0)
    {
      return(
        <div className="lmsEnrollCoursePrice">
          FREE
        </div>
      )
    }
    else {
      return (
        <div className="lmsEnrollCoursePrice">
          ${this.state.course.coursePrice}
        </div>
      )
    }
  }

  renderTotal = () => {
    if(this.state.course.coursePrice === 0)
    {
      return(
        <div className="lmsEnrollTotalPrice">
          FREE
        </div>
      )
    }
    else {
      return (
        <div className="lmsEnrollTotalPrice">
          ${this.state.course.coursePrice}
        </div>
      )
    }
  }

  render() {
    return (
      <StripeProvider apiKey="pk_test_Xl0AkJX5jhmxX712FNAYwWNg">
        <div className="container">
          <Helmet title="Enroll" meta={[ { name: 'description', content: 'Description of Enroll' }]}/>

          <header>
            <Navbar app={this.state.app}/>
          </header>

          <main className="lmsEnrollMain">
            <div className="lmsEnrollContainer">
              <div className="lmsEnrollContent">
                <div className="lmsEnrollSummary">
                <div className="lmsEnrollSummaryHeader">Order Summary</div>
                  <div className="lmsEnrollSummaryMain">
                    <div className="lmsEnrollCourse">
                      <div className="lmsEnrollCourseImageContainer">
                        <img src={'http://houseofhackers.me/media/' + this.state.course.courseImage} className="lmsEnrollCourseImage"/>
                      </div>
                      <div className="lmsEnrollCourseName">{this.state.course.courseName}</div>
                      {this.renderPrice()}
                    </div>
                    <div className="lmsEnrollCourseCode"></div>
                    <div className="lmsEnrollSummaryFinal">
                      <div className="lmsEnrollSummaryTotalHeader"></div>
                      <div className="lmsEnrollSummaryTotalMain">
                        <div className="lmsEnrollTotalText">Total</div>
                        {this.renderTotal()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lmsEnrollPayment">
                <div className="lmsEnrollSummaryHeader">Pay with Card</div>
                <Elements>
                  <Payment courseID={this.props.match.params.id} app={this.state.app}/>
                </Elements>
                </div>
              </div>
            </div>
          </main>

          <Footer/>
        </div>
      </StripeProvider>
    );
  }
}

Enroll.contextTypes = {
  router: React.PropTypes.object
};
