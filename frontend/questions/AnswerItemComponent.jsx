import React from 'react'
import _ from 'lodash'
import styles from './questionSheet.css'

class AnswerItemComponent extends React.Component {
  constructor( props ) {
    super ( props )
    this.state = {
      trailExists : !_.isEmpty(this.props.question.trail)
    }
  }

  render() {
    return(
      <span className='lead'>
        { this.state.trailExists && <strong>
          {this.props.question.question}
            <span className='edit-wrapper' onClick={ e => this.props.displayOptions(this.props.question.keyContent) }>
              <span className='glyphicon glyphicon-pencil edit'></span>
              <span className='trail'>{this.props.question.trail}</span>
            </span>
        </strong> }
        { !this.state.trailExists && <strong style={{ cursor : 'pointer' }} onClick={ e => this.props.displayOptions(this.props.question.keyContent.keyContent[0]) }>
          {this.props.question.question}
        </strong> }
      </span>
    )
  }
}

module.exports = AnswerItemComponent