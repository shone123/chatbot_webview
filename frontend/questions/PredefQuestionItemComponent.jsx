import React from 'react'
import _ from 'lodash'
import {Editor, EditorState} from 'draft-js'
import ReactModal from 'react-modal'
import styles from './questionSheet.css'

class PredefQuestionItemComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty(),
      trailExists : _.isEmpty(this.props.message.trail)
    }
    this.onChange = (editorState) => this.setState({editorState})
  }

  getEditorState() {
    let editorText = this.state.editorState.getCurrentContent().getPlainText()
    if (editorText) {
      this.props.getTrailMessage(this.props.questionIndex, this.props.index, editorText)
      this.props.forceCheck(this.props.id)
    }
  }

  render() {
    return(
      <span className="custom-control-description lead">
        <strong className='blank'>{this.props.message.message}
          { !this.state.trailExists && <span className='edit-wrapper' onClick={ e => this.props.editBlank(this.props.questionIndex, this.props.index) }>
            <span className='glyphicon glyphicon-pencil edit'></span>
            <span className='trail'>{this.props.message.trail}</span>
          </span> }
        </strong>
        { !this.state.trailExists && this.props.message.beingEdited &&
          <div style={{borderStyle : 'solid', borderWidth : '1px', borderColor : '#e6e6e6'}}>
            <Editor editorState={this.state.editorState} onChange={this.onChange} />
            <button className='btn btn-link btn-xs pull-right' onClick={ e => this.getEditorState() }>Done</button>
          </div>
        }
      </span>
    )
  }
}

module.exports = PredefQuestionItemComponent