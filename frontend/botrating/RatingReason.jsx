import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import { Link } from 'react-router-dom'
import TopHeader from '../misc/TopHeader'
import classNames from 'classnames'
import Spinner from '../misc/SpinnerComponent'
import ButtonWide from '../misc/ButtonWide'
import SubmittedFeedback from './SubmittedFeedback'
import Rating from './Rating'
import ErrorComponent from '../misc/ErrorComponent'
// var Loader = require('halogenium/DotLoader')

class RatingReason extends React.Component {
  constructor(props) {
    super(props)
    this.state= {
      query:this.props.query,
      FeedbackRating : {
        value: this.props.match.params.FeedbackRating,
        reason: ""
      },
      showSpinner:true,
      inputval:'',
      errorText:''
    }
  }

  handleInputChange(e) {
    this.setState({ inputval : e.target.value });
  }

  gotoChangeRating(e) {
    this.props.history.push(`/rating?psid=${this.props.query.psid}&botid=${this.props.query.botid}`)
  }

  gotoSendFeedback(e) {
    //this.setState ({ FeedbackRating :{reason:this.state.inputval } });
    var Feedback = this.state.FeedbackRating;
    Feedback.reason = this.state.inputval;
    this.setState({FeedbackRating:Feedback});
    var FEEDBACK = {};
    var feed_back = {
      type : "NPS",
      feedback_text : Feedback.reason,
      rating: Feedback.value,
      sentiment: ""              
    }
    if(this.state.FeedbackRating.value < 5 ) {
      feed_back.sentiment = "less likely"
      console.log(feed_back.sentiment)
    }  
    else if (this.state.FeedbackRating.value > 5) {
      feed_back.sentiment = "Very likely"
      console.log(feed_back.sentiment)
    }
    else {
      feed_back.sentiment = "neutral"
    }
    FEEDBACK = {      
      psid: this.props.query.psid,
      page_id : this.props.query.botid,
      feedback : JSON.stringify(feed_back)
    }
    request.post(`/api/sendFeedback`)
    .send({
      psid : this.props.query.psid,
      botid : this.props.query.botid,
      feedback : FEEDBACK,
    })
    .then( res => {
        console.log("response is ",res)
        console.log("response txt is ",res.text)
        if(res.text==="success") {
            this.props.history.push(`/submittedFeedback/${"botrating"}?psid=${this.props.query.psid}&botid=${this.props.query.botid}`);
        }
    })
  .catch(err => {
    if ( err && err.status ) {
      this.setState( { showSpinner : false, errorText: err.response.text } )
    }
    else {
      this.setState( { showSpinner : false, errorText: 'Server Error' } )
    }
    console.log(err);

    this.props.history.push(`/failedFeedback/${"botrating"}?psid=${this.props.query.psid}&botid=${this.props.query.botid}`);
  })
  }
  render() {
    return (
      <div>
      <div className='row'>
        <div className='col-xs-12' style={{fontSize:'20px', fontFamily:'Arial Black'}}>
          <TopHeader headerText="Feedback"/>
        </div>
      </div>

      <div style={{marginTop:'10px',marginLeft:'15px',fontFamily:'Times New Roman', fontSize:'16px'}}>
      <div className='row'> <span>You have provided a rating of {this.state.FeedbackRating.value}</span></div>  
      <div className='row'>Could you briefly explain the rating you provided</div>
      </div>
      <div style={{ resize:'none', marginTop:'10px',marginBottom:'40px', fontFamily:'Times New Roman'}} >        
        <textarea type="text" style={{ maxWidth:'330px', maxHeight:'350px'}} className="form-control" rows="5" value={this.state.inputval} onChange={e => this.handleInputChange(e)} />
      </div>


      <div style={{ position: 'fixed', bottom: '0', width: '100%', marginLeft: '-15px', padding: '15px 0', background: 'white', fontFamily:'Times New Roman' }} >
        <div className='row center-block'>
          <div className='col-xs-6'>
            <ButtonWide buttonText="CHANGE RATING" selected={false} clickHandler={ e => this.gotoChangeRating(e) }/>
          </div>
          <div className='col-xs-6'>
            <ButtonWide buttonText="SEND FEEDBACK" selected={true} clickHandler={ e => this.gotoSendFeedback(e) } />
          </div>
        </div>
      </div>

      </div>
    );

  }
}

module.exports = RatingReason
