import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
var classNames = require('classnames')
import Spinner from '../misc/SpinnerComponent'
import {getProductDetails} from '../utility.js'

class NotRightVisionComponent extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      xc_sku : this.props.query.xc_sku,
      showSpinner :  true,
      product : (!_.isUndefined(this.props.location.state.product))?this.props.location.state.product : {
        image : '/images/not_available.jpg'
      },
      uploaded_img : this.props.location.state.img_url,
      feedback : {
        psid : this.props.query.psid,
        type : 'Not_right',
        query_type : this.props.location.state.query_type,
        upload_id : this.props.location.state.upload_id,
        channel_id : 'facebook',
        not_right_parameter : '',
        page_id : this.props.query.botid
      },
      notRightOptions : [
        {option : 'gender', selected: false}, 
        {option : 'product type', selected: false},
        {option : 'product style', selected: false},
        {option : 'color', selected: false}] 
    }
  }

  componentDidMount() {

    /*getProductDetails(this.props.query.psid, this.props.query.botid, this.state.xc_sku)
    .then((product) => {
      console.log('product',product)
      if (!_.isUndefined(product)) {
        this.setState({
          product : product,
          showSpinner: false
        })
      }
    })
    .catch( err => {
      console.log( err )
      if ( err && err.status ) {
        this.setState( { showSpinner : false, errorText: err.response.text } )
      } else {
        this.setState( { showSpinner : false, errorText: 'Server Error' } )
      }
    })*/
    this.setState({
      showSpinner : false
    })

  }

  backToMessenger() {
    window.MessengerExtensions.requestCloseBrowser( function success() {
        return;
      }, function error(err) {
        console.error( err, 'Unable to close window.', 'You may be viewing outside of the Messenger app.' )
    })
  }

  getUserOption(optionClicked) {
    if(typeof option !== undefined) {
      let predefinedOptions = _.cloneDeep(this.state.notRightOptions)
      predefinedOptions = _.map(predefinedOptions, option => {
        if(option.option === optionClicked) {
          option.selected = !option.selected
          return option
        } else 
          return option
      })
      this.setState({
        notRightOptions : predefinedOptions
      }, console.log(this.state))

    } else 
      return
  }

  setFeedback() {
    if (this.state.notRightOptions) {
      let feedback_arr = this.state.notRightOptions.map(option => {
        return option.option
      })
      let final_feedback = feedback_arr.join(',')
      console.log(final_feedback)
      this.setState({
        feedback : {
          not_right_parameter : final_feedback
        }
      }, () => {
        this.sendFeedback()
      })
    }
  }

  sendFeedback() {

    request.post('/api/sendFeedback')
    .send( {
      psid      : this.props.query.psid,
      botid     : this.props.query.botid,
      feedback  : this.state.feedback
    })
    .then( res => {
      if( res.text === 'success') {
        console.log('Feedback Sent successfully')
        this.props.history.push({
          pathname : `/notRightSuccess`,
          search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`
        })
      }
    })
    .catch( err => {
      console.log(err)
      this.props.history.push({
        pathname : `/notRightFail`,
        search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
        state : {img_url : this.state.uploaded_img, query_type : this.state.feedback.query_type, upload_id : this.state.feedback.upload_id, product : this.state.product}
      })
      if ( err && err.status ) {
        this.setState( { showSpinner : false, errorText: err.response.text } )
      } else {
        this.setState( { showSpinner : false, errorText: 'Server Error' } )
      }      
    })
  
  }

  render() {

    let page = <div>
      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText="What I got wrong"/>
        </div>
      </div>

      <div className='row' style={{marginTop: '10px'}}>
        <div className='col-xs-6'>
          <div className='thumbnail'>
            <img src={this.state.uploaded_img} className="img-responsive"/>
            <div className='caption'>
              <p><b>Your Image</b></p>
            </div>
          </div>
        </div>
        <div className='col-xs-6'>
          <div className='thumbnail'>
            <img src={this.state.product.image} className="img-responsive"/>
            <div className='caption'>
              <p><b>My Match</b></p>
              <p><b>Color: </b>{this.state.product.colorsText}</p>
              <p><b>Size: </b>{this.state.product.sizeText}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='row' style={{marginTop: '10px'}}>
        <div className='col-xs-12 text-center'>
          Please tell me what is incorrect about this item:
        </div>
      </div>

      {this.state.notRightOptions && this.state.notRightOptions.map( (option, index) =>
        <div className='row justify-content-center' style={{marginTop: '5px'}} key={index}>
          <div className='col-xs-12'>
            <button type='button' className={'btn btn-block btn-md '+ (option.selected?'btn-warning':'btn-default')} style={{borderRadius: '0px'}} onClick={e=>this.getUserOption(option.option)}>{_.upperFirst(option.option)}</button>
           </div>
        </div>
        )
      }

      <div className='row' style={{marginTop: '15px', marginBottom: '20px'}}>
        <div className='col-xs-6'>
          <button type='button' className='btn btn-default btn-block btn-lg' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.backToMessenger()}>EXIT</button>
        </div>
        <div className='col-xs-6'>
          <button type='button' className='btn btn-warning btn-block btn-lg' style={{color: '#fff', borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.setFeedback()}>SEND FEEDBACK</button>
        </div>
      </div>
    </div>

    return (
      <div>
      {page}
      </div>
      )
  } 
}

module.exports = NotRightVisionComponent