import React from 'react'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import ButtonWide from '../misc/ButtonWide'


class NotRightFail extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showSpinner : false,
      query_type : this.props.location.state.query_type,
      intent : this.props.location.state.intent,
      product : this.props.location.state.product,
      upload_id : this.props.location.state.upload_id,
      img_url : this.props.location.state.img_url
    }
  
  }

  goToNotRightFeedback() {
    if(_.toLower(this.state.query_type) === 'vision') {
      this.props.history.push({
        pathname : `/notRightVision`,
        search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
        state : {query_type : this.state.query_type, img_url : this.state.img_url, upload_id : this.state.upload_id, product : this.state.product}
      })
    } else if(_.toLower(this.state.query_type) === 'others'){
      this.props.history.push({
        pathname : `/notRight`,
        search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
        state : { query_type : this.state.query_type, intent : this.state.intent, product : this.state.product}
      })
    }
  }

  render() {
    return(
      <div>
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="Failed Feedback"/>
          </div>
        </div>

        { this.state.showSpinner && <Spinner /> }

        <div className='row' style={{ marginTop: '20px'}}>
          <div className='col-xs-12'>
            <h3 className='text-center'> Unable to send feedback, please try again</h3>
          </div>
          <div style={{marginTop: '30px'}}>
            <ButtonWide buttonText="Try again" selected={false} clickHandler={ e => this.goToNotRightFeedback() }/>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = NotRightFail
