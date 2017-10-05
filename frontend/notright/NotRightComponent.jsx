import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
var classNames = require('classnames')
import Spinner from '../misc/SpinnerComponent'
import {getProductDetails} from '../utility.js'

class NotRightComponent extends React.Component {
  constructor( props ) {
    super( props )

    let intent = this.props.location.state.intent
    this.state = {
      xc_sku : this.props.query.xc_sku,
      showSpinner :  true,
      feedback : {
        psid : this.props.query.psid,
        type : 'Not_right',
        query_type : this.props.location.state.query_type,
        intent : {
          entity : (typeof intent.entity !== 'undefined')?intent.entity:'NA',
          price : (typeof intent.price !== 'undefined')?intent.price:'NA',
          size : (typeof intent.size !== 'undefined')?intent.size:'NA',
          xc_category : (typeof intent.xc_category !== 'undefined')?intent.xc_category:'NA',
          features : (typeof intent.features !== 'undefined')?intent.features:'NA',
          brand : (typeof intent.brand !== 'undefined')?intent.brand:'NA',
          details : (typeof intent.details !== 'undefined')?intent.details:'NA',
          colorsavailable : (typeof intent.colorsavailable !== 'undefined')?intent.colorsavailable:'NA',
          gender : (typeof intent.gender !== 'undefined')?intent.gender:'NA'
        },
        channel_id : 'facebook',
        not_right_parameter : '',
        page_id : this.props.query.botid
      },
      sizeText : 'NA',
      colorsText : 'NA',
      priceText : 'NA',
      product: (!_.isUndefined(this.props.location.state.product))?this.props.location.state.product : {
        image : '/images/not_available.jpg'
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
      }, () => this.sendFeedback())
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
        state : {query_type : this.state.feedback.query_type, intent : this.state.feedback.intent, product : this.state.product}
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
          <div className='text-center'>
            <p><b>Product Type: {this.state.feedback.intent.entity}</b></p>
            <p><b>Gender: {this.state.feedback.intent.gender}</b></p>
            <p><b>Colors: {this.state.feedback.intent.colorsavailable}</b></p>
            <p><b>Size: {this.state.feedback.intent.size}</b></p>
            <p><b>Price: {this.state.feedback.intent.price}</b></p>
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
          <button type='button' className='btn btn-default btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.backToMessenger()}>EXIT</button>
        </div>
        <div className='col-xs-6'>
          <button type='button' className='btn btn-warning btn-block' style={{color: '#fff', borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.sendFeedback()}>SEND FEEDBACK</button>
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

module.exports = NotRightComponent