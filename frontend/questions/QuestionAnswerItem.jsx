import React from 'react'
import _ from 'lodash'
import QuestionAnswerUser from './QuestionAnswerUser'

class QuestionAnswerItem extends React.Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return(
      <div>
      { this.props.questions && this.props.questions.length > 0 && this.props.questions.map( (question, index) =>
          <QuestionAnswerUser
            question={question}
            answers={this.props.answers}
            key={index+question.id}
          ></QuestionAnswerUser>
        )
      }
      </div>
    )
  }
}

module.exports = QuestionAnswerItem