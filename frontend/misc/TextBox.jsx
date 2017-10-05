import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import Spinner from './SpinnerComponent'
import ErrorComponent from './ErrorComponent'

class TextBox extends React.Component {
  constructor( props ) {
    super (props)

    this.state = {
      showSpinner : true
    }
  }

  render() {
    return (
    <div>
      <div className='col-xs-12'>
        <p className='lead' data-toggle='collapse' data-target={'#answerDiv'+this.props.ques.key} style={{cursor: 'pointer'}}>
          <span className='glyphicon glyphicon-chevron-right small'></span>&nbsp;<strong  id={'answerQues'+this.props.ques.key}>{this.props.ques.message}</strong></p>
      </div>
      <div className='collapse' id={'answerDiv'+this.props.ques.key} style={{marginTop: '15px',marginBottom:'15px'}}>
        <div className='col-xs-9' style={{marginBottom:'25px'}}>
          { !this.props.displayAns && <textarea className="form-control" id={'answerArea'+this.props.type+this.props.ques.key} rows="3" style={{resize: 'none'}}></textarea> }
          { this.props.displayAns && <p className='text-info' id={'answerText'+this.props.ques.key}></p>}              
        </div>
        <div className='col-xs-3'>
          {!this.props.displayAns && <button type="submit" className='btn btn-sm btn-default' onClick={e=>this.props.getAnswerData(this.props.ques.key, this.props.type)}>Done</button>}
        </div>
        <br/>
      </div>
    </div>
    )
  }
}

module.exports = TextBox