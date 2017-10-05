import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import { Link } from 'react-router-dom'
import TopHeader from '../misc/TopHeader'
import classNames from 'classnames'
import Spinner from '../misc/SpinnerComponent'
import RatingReason from './RatingReason'
import ButtonWide from '../misc/ButtonWide'


// var Loader = require('halogenium/DotLoader')

class FailedFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      showSpinner:false,
    };
  }
  gotoRating(e) {
    this.props.history.push(`/rating?psid=${this.props.query.psid}&botid=${this.props.query.botid}`);
  }

  gotoselectretailers(e) {
   this.props.history.push(`/selectretailers?psid=${this.props.query.psid}&botid=${this.props.query.botid}`); 
  }

  render() {
    let page = null
    let caller = this.props.match.params.str
    if(caller === "botrating") {
        page = <div>
                <div className='row'>
                    <div className='col-xs-12' style={{ marginTop: '15px', fontSize:'20px', fontFamily:'Arian Black'}}>
                    <TopHeader headerText="Feedback"/>
                    </div>
                </div>
        
                <div className='col-xs-12 text-center' style={{fontSize:'18px',marginTop:'20px',fontFamily:'Times New Roman'}}> 
                    <span> Unable to send feedback, please try again</span>
                    <ButtonWide buttonText="Try again" selected={false} clickHandler={ e => this.gotoRating(e) }/>
                </div>
             </div>
    } else if(caller==="selectshop") {
        page = <div>
                <div className='row'>
                    <div className='col-xs-12' style={{ marginTop: '15px', fontSize:'20px', fontFamily:'Arian Black'}}>
                    <TopHeader headerText="Select Shop"/>
                    </div>
                </div>
        
                <div className='col-xs-12 text-center' style={{fontSize:'18px',marginTop:'20px',fontFamily:'Times New Roman'}}> 
                    <span> Unable to save you shop preference, please try again</span>
                    <ButtonWide buttonText="Try again" selected={false} clickHandler={ e => this.gotoselectretailers(e) }/>
                </div>
             </div>
    } 
    return(<div>{page}</div>);
  }
}

module.exports = FailedFeedback
