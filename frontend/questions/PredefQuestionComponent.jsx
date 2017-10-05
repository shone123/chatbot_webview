import React from 'react'
import _ from 'lodash'
import {Editor, EditorState} from 'draft-js'
import Modal from 'react-modal'
import TopHeader from '../misc/TopHeader'
import ErrorComponent from '../misc/ErrorComponent'
import PredefQuestionItemComponent from './PredefQuestionItemComponent'

class PredefQuestionComponent extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      editorState: EditorState.createEmpty(),
      answerType : 'text',
      modalIsOpen : false,
      optionSelected : false,
      EoO : false,     //End of Options
      dropdownOptions : [],
      customStyles : {
        content : {
          top : '50%',
          left : '50%',
          // right : 'auto',
          // bottom : 'auto',
          bottom : '100px',
          marginRight : '-50%',
          transform : 'translate(-50%, -50%)'
        }
      }
    }
    this.onChange = (editorState) => this.setState({editorState})
    this.handleChange = this.handleChange.bind(this)
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  openModal() {
    this.setState({
      modalIsOpen : true
    })
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({
      modalIsOpen : false,
      questionContent : {
        id : this.props.ques.id,
        keyContent: [{key : _.random(1000, 9999, false),
        type : this.state.answerType,
        value : this.state.dropdownOptions}]
      }
    }, () => {
      this.props.getQuestionData(this.state.questionContent, this.props.ques.id)
    })
  }

  selectOption(e) {
    this.setState ({
      answerType : e,
      EoO : false,
      optionSelected : true
    }, () => {
      console.log(this.state.answerType)
    })
  }

  removeOption(optionToRemove) {
    let dropdownOptions = _.cloneDeep(this.state.dropdownOptions)
    dropdownOptions = _.pull(dropdownOptions, optionToRemove)
    this.setState ({
      dropdownOptions : dropdownOptions
    }, () => {
      console.log(this.state.dropdownOptions)
    })
  }

  handleChange(e) {
    if ( e.target.checked ) {
      let trailIndex = _.findIndex(this.props.ques.message, mes => {
        return _.isEmpty(mes.trail) === false
      })
      if ( trailIndex !== -1 ) {
        this.props.editBlank(this.props.questionIndex, trailIndex)
      } else {
        this.openModal()
      }
    }
  }

  forceCheck(e) {
    var x = document.getElementById(e)
    x.checked = true
    this.openModal()
  }

  getEditorState() {
    let editorText = this.state.editorState.getCurrentContent().getPlainText()
    let dropdownOptions  = _.cloneDeep(this.state.dropdownOptions)
    if (editorText) {
      dropdownOptions.push(editorText)
      this.setState({
        dropdownOptions : dropdownOptions
      }, () => {
        console.log(this.state.dropdownOptions)
        this.emptyEditor()
      })
    } else {
      this.setState({
        errorText : 'Enter some text'
      })
    }
  }

  emptyEditor() {
    let editorState = EditorState.createEmpty()
    this.setState ({
      editorState : editorState
    })
  }

  closeEditor() {
    this.setState({
      EoO : true
    })
  }

  render() {
    return (
      <div className='row' style={{marginTop : '5px'}}>
        <div className='col-xs-1'>
        <label className="custom-control custom-checkbox small">
          <input id={this.props.ques.id} style={{marginBottom : '2px', bottom : '1.5px'}} type="checkbox" className="custom-control-input" onChange={this.handleChange}/>
            <span className="custom-control-indicator small"></span>
          </label>
        </div>
        <div className='col-xs-11'>
          { this.props.ques.message && this.props.ques.message.length > 0 && this.props.ques.message.map( (message, index) =>
              <PredefQuestionItemComponent
                key={index+message}
                index={index}
                questionIndex={this.props.questionIndex}
                message={message}
                id={this.props.ques.id}
                editBlank={ (index, key) => this.props.editBlank(index, key) }
                forceCheck={ e => this.forceCheck(e) }
                getTrailMessage = { (index, key, message) => this.props.getTrailMessage(index, key, message ) }
              />
            )
          }
        </div>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          style={this.state.customStyles}
          shouldCloseOnOverlayClick={false}
          contentLabel="questionModal"
        >
        {this.state.optionSelected && <span className='glyphicon glyphicon-remove pull-right' style={{cursor: 'pointer'}} onClick={this.closeModal}></span> }
        <TopHeader headerText="Select Answer Options"/>
        <div className='dropdown row' style={{ marginTop : '20px'}}>
          <div className='col-xs-3'></div>
          <div className='col-xs-6'>
            <button className="btn btn-default btn-sm dropdown-toggle" id='dropdownMenu' data-toggle="dropdown" type="button" aria-expanded="false">{ this.state.optionSelected?this.state.answerType:'Answer Type' }<span className="caret"></span></button>
            <ul className='dropdown-menu' aria-labelledby='dropdownMenu'>
              <li className='dropdown-item text-center'><span style={{cursor : 'pointer'}} role='menuitem' onClick={ e => this.selectOption('text') }>Text</span></li>
              <li className='dropdown-item text-center'><span style={{cursor : 'pointer'}} role='menuitem' onClick={ e => this.selectOption('dropdown') }>Dropdown</span></li>
            </ul>
          </div>
          <div className='col-xs-3'></div>
        </div>
        { this.state.answerType === 'dropdown' && !this.state.EoO &&
          <div style={{marginTop : '15px'}} className='row'>
            <div className='col-xs-12' style={{borderStyle : 'solid', borderWidth : '1px', borderColor : '#e6e6e6'}}>
              <div className='col-xs-8'>
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
              </div>
              <div className='col-xs-2'>
                <button className='btn btn-link btn-xs pull-right' onClick={ e => this.getEditorState() }><span className='glyphicon glyphicon-plus'></span></button>
              </div>
              <div className='col-xs-2'>
                <button className='btn btn-link btn-xs pull-right' onClick={ e => this.closeEditor() }>Done</button>
              </div>
            </div>
          </div>
        }
        { this.state.answerType === 'dropdown' && this.state.EoO && this.state.dropdownOptions && this.state.dropdownOptions.length > 0 && 
          <div className='dropdown row' style={{ marginTop : '15px' }}>
          <div className='col-xs-3'></div>
          <div className='col-xs-6'>
            <button className="btn btn-default btn-sm dropdown-toggle" id='dropdownMenu2' data-toggle="dropdown" type="button" aria-expanded="false">Options<span className="caret"></span></button>
            <ul className='dropdown-menu' aria-labelledby='dropdownMenu2'>
              { this.state.dropdownOptions.map ( (option, index) =>
                  <li key={index} className='dropdown-item'><span role='menuitem'>{_.upperFirst(option)}</span>
                    <span key={index+option} className='glyphicon glyphicon-remove pull-right' style={{cursor : 'pointer'}} onClick={ e => this.removeOption(option) }></span>
                  </li>
                )
              }
            </ul>
          </div>
          <div className='col-xs-3'></div>
        </div>
        }
        </Modal>
      </div>
    )
  }
}

module.exports = PredefQuestionComponent