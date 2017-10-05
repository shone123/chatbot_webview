import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import { Link } from 'react-router-dom'
import TopHeader from '../misc/TopHeader'
import classNames from 'classnames'
import Spinner from '../misc/SpinnerComponent'
import RatingReason from './RatingReason'

// var Loader = require('halogenium/DotLoader')

class SubmittedFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      showSpinner : true,
    }
  }


  render() {
    let page = null
    let caller = this.props.match.params.str
    if(caller==="botrating") {
        page =  <div>
                    <div className='row'>
                        <div className='col-xs-12' style={{ fontSize:'20px',marginTop: '15px',fontFamily:'Arian Black' }}>
                            <TopHeader headerText="Feedback"/>
                        </div>
                    </div>
            
                    <div className='row'>
                        <div className='col-xs-12 text-center' style={{fontSize:'18px',marginTop:'20px',fontFamily:'Times New Roman'}}>
                            <h2> Thank you for your feedback</h2>
                        </div>
                        <div className='col-xs-12 text-center' style={{fontSize:'18px',fontFamily:'Times New Roman'}}>
                            <span> Please come back and chat with me anytime. I look forward to speaking  with you again soon</span>
                        </div>
                    </div>
                </div>
    } else if(caller==='selectshop'){
        page =  <div>
                    <div className='row'>
                        <div className='col-xs-12' style={{ fontSize:'20px',marginTop: '15px',fontFamily:'Arian Black' }}>
                            <TopHeader headerText="Selct Shop"/>
                        </div>
                    </div>
            
                    <div className='row'>
                        <div className='col-xs-12 text-center' style={{fontSize:'18px',marginTop:'20px',fontFamily:'Times New Roman'}}>
                            <h2> Your Shop preference has been saved </h2>
                        </div>
                        <div className='col-xs-12 text-center' style={{fontSize:'18px',fontFamily:'Times New Roman'}}>
                            <span> You can always change your shop preferences in edit shop preference menu</span>
                        </div>
                    </div>
                </div>
        
    }
    return( <div>{page}</div>  );
  }
}

module.exports = SubmittedFeedback
