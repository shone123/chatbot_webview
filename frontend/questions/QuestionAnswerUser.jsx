import React from 'react'
import _ from 'lodash'

class QuestionAnswerUser extends React.Component {
  constructor( props ) {
    super (props)

    this.state = {
      question : this.props.question,
      answers : this.props.answers,
      currentAnswer : []
    }
    console.log(this.state)
  }

  componentDidMount() {
    let answers = _.cloneDeep(this.props.answers)
    let currentAnswer = _.find(answers, ans => {
      return ans.id === this.props.question.id
    })
    this.setState({
      currentAnswer : currentAnswer
    })
  }

  render() {
    return (
    <div>
      <div className='col-xs-12 panel panel-default'>
        <div className='panel-heading'>
          <span className='glyphicon glyphicon-chevron-right small'></span>&nbsp;<strong>{this.state.question.question}</strong>
        </div>
        <div className='panel-body' style={{marginTop: '10px',marginBottom:'10px'}}>
          <div className='col-xs-9' style={{marginBottom:'15px'}}>
            {this.state.currentAnswer.answer && this.state.currentAnswer.answer.length > 0 && this.state.currentAnswer.answer.map( answer => 
              <span key={answer.key} className='text-info'>{answer.answer}<br/></span> 
            )}
          </div>
          <div className='col-xs-3'></div>
          <br/>
        </div>
      </div>
    </div>
    )
  }

}

module.exports = QuestionAnswerUser