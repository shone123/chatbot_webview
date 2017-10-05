import React from 'react'
import _ from 'lodash'
import QuestionAnswerItem from './QuestionAnswerItem'
import TopHeader from '../misc/TopHeader'

class QuestionAnswerAll extends React.Component {
  constructor( props ) {
    super (props)

    this.state = {
      answerData : this.props.receiverItem,
      receiverName : this.props.receiver_name,
      receiverPsid : this.props.receiverPsid
    }
  }

  render() {
    return (
    <div style={{marginTop : '15px'}}>
      <TopHeader headerText={this.state.receiverName}/>
      <div className='row'>
        <div className='col-xs-1'></div>
        <div className='col-xs-10'>
          <QuestionAnswerItem
            questions={this.state.answerData.questions}
            answers={this.state.answerData.answers}
          ></QuestionAnswerItem>
        </div>
        <div className='col-xs-1' style={{ borderWidth : '1px', borderStyle : 'dashed', width : '100%'}}></div>
      </div>
    </div>
    )
  }

}

module.exports = QuestionAnswerAll