import React from 'react'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'

class NotRightSuccess extends React.Component {
  constructor(props) {
    super(props)
    
    this.state= {
      showSpinner : true
    }
  }

  render() {
    return(
      <div>

        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="Feedback"/>
          </div>
        </div>
      {/* Instead of Static Text, Get dynamic text from sheet/db */}
        <div className='row' style={{marginTop: '20px'}}>
          <div className='text-center col-xs-12' >
            <h3> Thank you for your feedback</h3>
          </div>
        </div>

        <div className='row' style={{marginTop: '30px'}}>
          <div className='text-center'>
            <h5> Please come back and chat with me anytime.<br/>I look forward to speaking  with you again soon</h5>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = NotRightSuccess
