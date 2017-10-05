import React from 'react'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'

class QuestionSuccessComponent extends React.Component {
  constructor( props ) {
    super(props)
    this.state ={
      showSpinner : true
    }
  }

  render() {
    return(
        <div>
          <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="Give Feedback"/>
          </div>
        </div>

        <div className='row' style={{marginTop: '20px'}}>
          <div className='text-center col-xs-12' >
            <h4>Feedback submitted successfully</h4>
          </div>
        </div>

        </div>
      )
  }
}

module.exports = QuestionSuccessComponent