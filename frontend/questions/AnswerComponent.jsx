import React from 'react'
import _ from 'lodash'
import {Editor, EditorState} from 'draft-js'
import AnswerItemComponent from './AnswerItemComponent'
import ErrorComponent from '../misc/ErrorComponent'

class AnswerComponent extends React.Component {
  constructor( props ) {
    super ( props )
    this.state = {
      displayAnswerOptions : false,
      answerType : '',
      dropdownOptions : [],
      optionIsSelected : false,
      userAnswer : '',
      selectedOption : '',
      editorState: EditorState.createEmpty()
    }
    this.onChange = (editorState) => this.setState({editorState})
  }

  displayOptions(keyContent) {
    if (keyContent.type === 'text') {
      this.setState({
        displayAnswerOptions : true,
        answerKey : keyContent.key,
        userAnswer : '',
        answerType : keyContent.type,
        dropdownOptions : keyContent.value
      })
    } else {
      this.setState({
        displayAnswerOptions : true,
        answerKey : keyContent.key,
        answerType : keyContent.type,
        dropdownOptions : keyContent.value
      })
    }
  }

  selectOption(option){
    this.setState({
      optionIsSelected : true,
      selectedOption : option
    })
  }

  closeEditor() {
    let answer = this.state.editorState.getCurrentContent().getPlainText()
    this.setState({
      displayAnswerOptions : false,
      userAnswer : answer
    }, () => {
      this.props.getAnswerData(this.props.id, this.state.answerKey, this.state.userAnswer)
    })
  }

  confirmOptions() {
    if (this.state.optionIsSelected) {
      this.setState({
        displayAnswerOptions : false,
        errorText : ''
      }, () => {
        this.props.getAnswerData(this.props.id, this.state.answerKey, this.state.selectedOption)
      })
    } else {
      this.setState({
        errorText : 'Please select an option first'
      })
    }
  }

  render() {
    return(
      <div className='row' style={{marginTop : '5px'}}>
        <div className='col-xs-1'>
          <span className='glyphicon glyphicon-chevron-right'></span>
        </div>
        <div className='col-xs-11'>
        { this.props.ques && this.props.ques.length > 0 && this.props.ques.map( (question, index) =>
            <AnswerItemComponent
            key={index+question}
            displayOptions={ (keyContent) => this.displayOptions(keyContent) }
            question={question}
            />
          )
        }
        </div>
        { this.state.displayAnswerOptions && this.state.answerType === 'text' &&
          <div style={{marginTop : '15px'}} className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-10' style={{borderStyle : 'solid', borderWidth : '1px', borderColor : '#e6e6e6', margin : '15px'}}>
              <div className='col-xs-10'>
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
              </div>
              <div className='col-xs-2'>
                <button className='btn btn-link btn-xs pull-right' onClick={ e => this.closeEditor() }>Done</button>
              </div>
            </div>
            <div className='col-xs-1'></div>
          </div>
        }
        { !this.state.displayAnswerOptions && this.state.answerType === 'text' && this.state.userAnswer &&
          <div style={{marginTop : '15px'}} className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-10'>
              <ul>
                <li><strong>{this.state.userAnswer}</strong></li>
              </ul>
            </div>
            <div className='col-xs-1'></div>
          </div>
        }
        { this.state.displayAnswerOptions && this.state.answerType === 'dropdown' && this.state.dropdownOptions && this.state.dropdownOptions.length > 0 &&
          <div className='dropdown row' style={{ marginTop : '15px' }}>
            <div className='col-xs-3'></div>
            <div className='col-xs-4' style={{margin : '15px'}}>
              <button className="btn btn-default btn-sm dropdown-toggle" id='dropdownMenu2' data-toggle="dropdown" type="button" aria-expanded="false">{ this.state.optionIsSelected? this.state.selectedOption :'Options'}<span className="caret"></span></button>
              <ul className='dropdown-menu' aria-labelledby='dropdownMenu2'>
                { this.state.dropdownOptions.map ( (option, index) =>
                    <li key={index} className='dropdown-item' style={{cursor : 'pointer'}} onClick={ e => this.selectOption(option) }><span role='menuitem'>{_.upperFirst(option)}</span>
                    </li>
                  )
                }
              </ul>
            </div>
            <div className='col-xs-1' style={{top : '17px', right : '40px'}}>
              <button className='btn btn-link btn-sm' data-toggle='tooltip' title='Confirm Selection' data-placement='top' onClick={ e => this.confirmOptions() }><span className='glyphicon glyphicon-ok'></span></button>
            </div>
            <div className='col-xs-4'></div>
          </div>
        }
      </div>
    )
  }
}

module.exports = AnswerComponent