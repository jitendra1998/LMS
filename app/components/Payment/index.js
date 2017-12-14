/**
*
* Payment
*
*/

import React from 'react';
import {StripeProvider, injectStripe, CardNumberElement, CardExpiryElement, CardCVCElement, PostalCodeElement, PaymentRequestButtonElement} from 'react-stripe-elements';

import Snackbar from 'material-ui/Snackbar';

import './style.css';
import './styleM.css';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      snack: false,
      msg: "",
      app:this.props.app
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

  handleEnroll = (ev) => {

    ev.preventDefault();

    let _this = this;
    this.props.stripe.createToken({name: this.state.app.state.user.name}).then(({token}) => {
      console.log(token);
      let data = new FormData();
      data.append('stripeToken', token.id);
      fetch("http://houseofhackers.me:81/enrollCourse/" + this.props.courseID + "/", {
        method:'POST',
        body:data,
        headers: { 'Authorization': 'JWT ' + this.state.app.state.token}
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
        else if(json.success) {
          _this.showSnack(json.success);
        }
      })
    });

  }

  render() {

    const createOptions = (fontSize) => {
      return {
        style: {
          base: {
            fontSize,
            color: '#424770',
            letterSpacing: '0.025em',
            fontFamily: 'Source Code Pro, Menlo, monospace',
            '::placeholder': {
              color: '#aab7c4',
            },
          },
          invalid: {
            color: '#9e2146',
          },
        },
      };
    };

    return (
      <form onSubmit={this.handleEnroll}>
        <label className="lmsEnrollPayLabel">
          Card number
          <CardNumberElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label className="lmsEnrollPayLabel">
          Expiration date
          <CardExpiryElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label className="lmsEnrollPayLabel">
          CVC
          <CardCVCElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <label className="lmsEnrollPayLabel">
          Postal code
          <PostalCodeElement
            {...createOptions(this.props.fontSize)}
          />
        </label>
        <button className="lmsEnrollPayButton">Pay</button>
        <Snackbar
          open={this.state.snack}
          message={this.state.msg}
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </form>
    );
  }
}

export default injectStripe(Payment);
