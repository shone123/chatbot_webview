import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import {getProductDetails, getFeatures} from '../utility.js'
import {Editor, EditorState, Modifier} from 'draft-js'
import Modal from 'react-modal'
import PredefQuestionComponent from './PredefQuestionComponent'
import QuestionEditorComponent from './QuestionEditorComponent'

class QuestionSelectComponent extends React.Component {

  constructor( props ) {
    super( props )

    this.state = {
      showSpinner : true,
      questions : [],
      questionData : [],
      product: {
        image: '/images/not_available.jpg'
      },
      addQues : false,
      userQuestions : [],
      selectedQues : {
        checkedQues : [],
        custQues : '' 
      },
      xc_sku : this.props.query.xc_sku,
      appID : '',
      url : '',
      entryID : '',
      encodedID : '',
      allowShare : false,
      userData : {
        name : 'NA',
        profile_pic : '/images/not_available.jpg'
      },
      inBetweenRequest : false,
      isSupported : false,
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
      },
      modalIsOpen : false,
      answerModalIsOpen : false,
      optionSelected: false,
      questionsShared : false,
      EoO : false,
      dropdownOptions : [],
      answerType : 'text',
      editorState: EditorState.createEmpty(),
      keyData : [],
      blankAdded : false,
      userQuestionData : []
    }
    this.onChange = (editorState) => this.setState({editorState})
    this.openModal = this.openModal.bind(this)
    this.afterOpenModal = this.afterOpenModal.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {

    getFeatures()
    .then( res => {
      if (res === 'supported') {
        return Promise.all([
          request.post('/api/getAllPredefQuestions')
          .send({
             psid : this.props.query.psid,
             botid : this.props.query.botid
          }),
          getProductDetails(this.props.query.psid, this.props.query.botid, this.state.xc_sku),
          request.post('/api/getConf'),
          request.post('/api/getUserInfo')
          .send({
            psid : this.props.query.psid
          })
        ])
        .then ( res => {
          let [rawQues, product, conf, userData] = res
          rawQues = JSON.parse( rawQues.text )
          conf = JSON.parse( conf.text )
          userData  = JSON.parse( userData.text )
          if (rawQues && rawQues.length > 0) {
            let questions = _.map( rawQues, (ques, index) => {
              let messageArr = _.split(ques.message, /#@#@/g)
              if ( messageArr.length === 1 ) {
                ques.message = _.map( messageArr, message => {
                  return {
                    message : message,
                    trail : '',
                    beingEdited : false
                  }
                })
              } else {
                ques.message = _.map( _.dropRight( messageArr, 1 ), message => {
                  return {
                    message : message,
                    trail : '_ _ _ _ _',
                    beingEdited : false
                  }
                })
              }
              return ques
            })
            this.setState({
              questions : questions,
              product : product,
              appID : conf.appID,
              url : conf.url,
              userData : {
                name : userData.first_name + ' ' + userData.last_name,
                profile_pic : userData.profile_pic
              },
              showSpinner : false,
              isSupported : true
            })
          }
        })
        .catch( err => {
          console.log( err )
          if ( err && err.status ) {
            this.setState( {
              showSpinner : false, 
              errorText: err.response.text
            } )
          } else {
            this.setState( {
              showSpinner : false, 
              errorText: 'Server Error' 
            } )
          }
        })  
      }
    })
    .catch( err => {
      console.log(err)
      this.setState({
        showSpinner : false,
        errorText : 'Messenger Extensions not supported, Is this page opened inside Messenger?'
      })
    })

  }

  editBlank(messageIndex, keyIndex) {
    let questions = _.cloneDeep(this.state.questions)
    questions[messageIndex].message[keyIndex].beingEdited = true
    this.setState({
      questions : questions
    })
  }

  getTrailMessage(messageIndex, keyIndex, message) {
    let questions = _.cloneDeep(this.state.questions)
    let questionData = _.cloneDeep(this.state.questionData)
    questions[messageIndex].message[keyIndex].trail = message
    questions[messageIndex].message[keyIndex].beingEdited = false
    _.forEach( questionData, data => {
      if ( data.id === questions[messageIndex].id ) {
        data.question = this.processQuestion( questions[messageIndex] )
      }
    })
    this.setState({
      questions : questions,
      questionData : questionData,
      questionsShared : false
    })
  }

  getQuestionData(questionContent, id) {
    let currQuestion = _.find( this.state.questions, ques => {
      return ques.id === id
    })
    currQuestion = this.processQuestion(currQuestion)
    let questionData = _.cloneDeep(this.state.questionData)
    let alreadyPresentQuestion = _.find(questionData, data => {
      return data.id === id
    })
    if ( _.isUndefined(alreadyPresentQuestion) ) {
      questionData.push({
        id : id,
        question : currQuestion,
        questionContent : questionContent
      })
    } else {
      _.remove(questionData, data => {
        return data.id === id
      })
      questionData.push({
        id : id,
        question : currQuestion,
        questionContent : questionContent
      })
    }
    this.setState({
      questionData : questionData,
      allowShare : true,
      questionsShared : false
    })
  }

  processQuestion(question) {
    let questionString = ''
    _.forEach(question.message, mes => {
      questionString += mes.message + ' ' + mes.trail
    })
    return questionString
  }

  removeCustomQues(id) {
    let userQuestions = _.cloneDeep(this.state.userQuestions)
    if (userQuestions && userQuestions.length > 0 && id) {
      userQuestions = _.reject(userQuestions, ques => {
        return ques.id === id
      })
    }
    this.setState({
      userQuestions : userQuestions,
      questionsShared :false
    })
  }

  sendQuestionData() {
    if ( !this.state.questionsShared ) {
      let questions = _.cloneDeep( this.state.questionData )
      let userQuestions = _.cloneDeep( this.state.userQuestions )
      let finalQuestions = _.concat( questions, userQuestions )
      request.post('/api/addUserQuestions')
      .send({
        questions : finalQuestions,
        psid : this.props.query.psid,
        botid : this.props.query.botid,
        sender_name : this.state.userData.name
      })
      .then( res => {
        let response = JSON.parse(res.text)
        console.log(response.id)
          this.setState({
            showSpinner: false,
            entryID : _.toString(response.id)
          })
      })
      .then(noop => {
        this.encodeQuestions()
      })
      .catch( err => {
        console.log( err )
        if ( err && err.status ) {
          this.setState( { showSpinner : false, errorText: err.response.text } )
        } else {
          this.setState( { showSpinner : false, errorText: 'Server Error' } )
        }
      })
    } else {
      this.shareQuestions()
    }
  }

  encodeQuestions() {
    let sharerPsid = this.props.query.psid
    let entryID = this.state.entryID
    console.log('Entry id', entryID)
    if ( sharerPsid && entryID ) {
      this.encodeData(entryID, sharerPsid)
    }
  }

  encodeData(quesId, psid) {
    if (quesId && psid) {
      request.post('/api/getUniqueID')
      .send({
        psid : psid,
        quesId : quesId
      })
      .then(res => {
        let response = JSON.parse(res.text) 
         this.setState({
            encodedID : response.encodedID
          })
      })
      .then(noop => {
         this.shareQuestions()
      })
      .catch( err => {
        if (err && err.status) {
          this.setState( { errorText: err.response.text } )
        } else {
          this.setState( { errorText: 'Server Error' } )
        }
      })
    }
  }

  openModal() {
    let questionID = _.random(10000, 99999, false)
    let userQuestionData = _.cloneDeep(this.state.userQuestionData)
    let alreadyPresentQuestion = _.find( userQuestionData, ques => {
      return  ques.id === questionID
    })
    if ( _.isUndefined(alreadyPresentQuestion) ) {
      userQuestionData.push({
        id : questionID,
        question : ''
      })
    } else {
      _.remove( userQuestionData, ques => {
        return ques.id === questionID
      })
      userQuestionData.push({
        id : questionID,
        question : ''
      })
    }
    this.setState({
      modalIsOpen : true,
      userQuestionData : userQuestionData,
      currentQuestion : questionID,
      editorState : EditorState.createEmpty()
    })
  }

  openAnswerModal(mode) {
    if( mode === 'addBlank' ) {
      const editorState = this.state.editorState
      const currentContent = editorState.getCurrentContent()
      const selection = editorState.getSelection()
      const blank = ' _ _ _ _ _ '
      const InsertText = Modifier.insertText(currentContent, selection, blank)
      this.setState({
        editorState : EditorState.push(editorState, InsertText, 'insert-characters'),
        answerModalIsOpen : true,
        blankAdded : true
      })
    } else if ( mode === 'noBlank') {
      this.setState({
        answerModalIsOpen : true
      })
    }
  }

  afterOpenModal() {
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    }, () => {
      let question = this.state.editorState.getCurrentContent().getPlainText()
      if (question) {
        let userQuestionData = _.cloneDeep(this.state.userQuestionData)
        let currentQuestionIndex = _.findIndex( userQuestionData, ques => {
          return ques.id === this.state.currentQuestion
        })
        userQuestionData[currentQuestionIndex].question = question
        this.setState({
          userQuestionData : userQuestionData
        }, () => {
          let currentQuestion = this.state.currentQuestion
          let currentUserQuestionData = _.find( _.cloneDeep(this.state.userQuestionData), ques => {
            return ques.id === currentQuestion
          })
          let currentKeyData = _.find(_.cloneDeep(this.state.keyData), key => {
            return key.id === currentQuestion
          })
          if ( !_.isUndefined( currentUserQuestionData ) && !_.isUndefined( currentKeyData ) ) {
            let userQuestions = _.cloneDeep(this.state.userQuestions)
            let alreadyPresentQuestionIndex = _.findIndex(userQuestions, ques => {
              ques.id === currentQuestion
            })
            if ( alreadyPresentQuestionIndex === -1 ) {
              userQuestions.push({
                id : currentQuestion,
                question : currentUserQuestionData.question,
                questionContent : currentKeyData
              })
            } else {
              _.remove(userQuestions, ques => {
                ques.id === currentQuestion
              })
              userQuestions.push({
                id : currentQuestion,
                question : currentUserQuestionData.question,
                questionContent : currentKeyData
              })
            }
            this.setState({
              userQuestions : userQuestions,
              questionsShared : false,
              allowShare : true
            })
          }

        })
      } else {
        console.log('Enter some text')
      }
    })
  }

  justCloseModal() {
    this.setState({
      modalIsOpen : false
    })
  }

  afterOpenAnswerModal() {
  }

  closeAnswerModal(answerType, dropdownOptions, answerKey, mode) {
    this.setState({
      answerModalIsOpen : false,
      answerType : answerType,
      dropdownOptions : dropdownOptions,
      answerKey : answerKey
    }, () => {
      let keyData = _.cloneDeep(this.state.keyData)
      let keyIndex = _.findIndex(keyData, key => {
        return key.id === this.state.currentQuestion
      })
      if ( keyIndex === -1) {
        keyData.push ({
          id : this.state.currentQuestion,
          keyContent : [{
            key : this.state.answerKey,
            type : this.state.answerType,
            value : this.state.dropdownOptions
          }]
        })
      } else {
        keyData[keyIndex].keyContent.push({
          key : this.state.answerKey,
          type : this.state.answerType,
          value : this.state.dropdownOptions
        })
      }
      if(mode === 'closeModal') {
        this.setState({
          keyData : keyData,
        },() => {
          this.closeModal()
        })
      } else {
        this.setState({
          keyData : keyData
        })
      }
    })
  }

  shareQuestions() {
    let appID = this.state.appID
    let url = this.state.url
    let eData = this.state.encodedID
    let sharerPsid = this.props.query.psid
    let botid = this.props.query.botid

    if (appID && url && eData && sharerPsid && botid) {
      var messageToShare = {
        "attachment" :{
          "type" : "template",
          "payload" : {
            "template_type": "generic",
            "elements": [{
              "title": "I need your advice in picking this outfit!",
              "image_url": this.state.product.image,
              "subtitle": _.upperFirst(this.state.product.productname) + ' : ' + _.upperFirst(this.state.product.brand) + ' : $'+ this.state.product.price,
              "default_action": {
                "type":"web_url",
                "url": `${url}/getFeedback?uid=${eData}&botid=${botid}&xc_sku=${this.state.xc_sku}`
              },
              "buttons": [{
                "type":"web_url",
                "url" : `${url}/getFeedback?uid=${eData}&botid=${botid}&xc_sku=${this.state.xc_sku}`,
                "title":"Give Feedback",
                "webview_height_ratio": "full",
                "messenger_extensions": true,
              }]
            }]
          }
        }
    };
    window.MessengerExtensions.beginShareFlow( response => {
        if (response.is_sent) {
          console.log('Shared')
          this.setState({
            inBetweenRequest : false,
            questionsShared : true
          })
        } else {

        }
      }, (errorCode, errorMessage) => {
        console.log(errorCode , errorMessage)
      }, messageToShare, "broadcast");
    }
  }
  
  render() {
    let page = <div>
      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText="Select Questions"/>
        </div>
      </div>
      <div className='row' style={{marginTop : '15px', overflow : 'hidden'}}>
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-6'>
            <img src={this.state.product.image} className='img-responsive float-left rounded'/>
          </div>
          <div className='col-xs-6' style={{marginTop: '20px'}}>
            <h3 className='text-left'>{ _.startCase( _.toLower( this.state.product.brand ) ) }
              <br/><small style={{marginTop: '5px'}}>{ _.startCase( _.toLower( this.state.product.productname ) ) }</small>
            </h3>
            <div className='text-left' style={{marginTop: '30px'}}>
              <p className='small'><b>Price ${ this.state.product.price }</b></p>
            </div>
          </div>
        </div>

        { this.state.product.colorsText &&
        <div className='row' style={{marginTop: '15px'}}>
          <div className='col-xs-12 text-center'>
            <b>Colors:</b> <br/>{ _.upperFirst( this.state.product.colorsText ) }
          </div>
        </div>
        }
        { this.state.product.size &&
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>
            <b>Sizes:</b> {this.state.product.sizeText}
          </div>
        </div>
        }
      </div>

      <div className='form-group row' style={{marginTop: '25px'}}>
        <div className='form-check col-xs-12'>
        {
          this.state.questions && this.state.questions.length > 0 && this.state.questions.map ( (ques, index) =>
            <PredefQuestionComponent
              key={ques + index}
              questionIndex={index}
              ques={ques}
              editBlank={ (index, key) => this.editBlank(index, key) }
              getTrailMessage = { (index, key, message) => this.getTrailMessage(index, key, message ) }
              getQuestionData = { (questionContent, id) => this.getQuestionData(questionContent, id) }
              handleChange={this.handleChange}
            />
          )
        }
        {
          this.state.userQuestions && this.state.userQuestions.length > 0 &&
          this.state.userQuestions.map ( ques =>
          <div key={ques.id * 5 + 11}>
            <label key={ques.id} className="custom-control custom-checkbox">
              <input key={ques.id * 7 + 17} id={ques.id} type="checkbox" className="custom-control-input customQues" checked/>
              <span key={ques.id * 3 + 43} className="custom-control-indicator"></span>
              <span key={ques.id * 17 + 47} className="custom-control-description lead"><strong>{ques.question}</strong></span>
            </label>
            <span key={ques.id * 10 + 73} onClick={e => this.removeCustomQues(ques.id)} 
              className='glyphicon glyphicon-remove-circle pull-right' 
                style={{cursor:'pointer', paddingTop: '4px' ,fontSize: '15px'}}></span>
            <br/>
          </div>
          )
        }
        </div>
        </div>
        { !this.state.modalIsOpen &&
          <div className='row' style={{marginTop: '15px',marginBottom:'15px'}}>
          <div className='col-xs-1'></div>
            <div className='col-xs-8'>
              <button id='viewQues' className='btn btn-link btn-lg' onClick={ e => this.openModal() }>
                <span className='glyphicon glyphicon-plus' style={{paddingBottom: '6px'}}></span>
              </button>
              <label htmlFor="viewQues"><h6>Write your own Question!</h6></label>
            </div>
            <div className='col-xs-3'></div>
          </div>
        }
        { this.state.modalIsOpen && <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        style={this.state.customStyles}
        shouldCloseOnOverlayClick={false}
        contentLabel="customQuestionModal"
        >
          <span className='glyphicon glyphicon-remove pull-right' style={{cursor: 'pointer'}} onClick={ e => this.justCloseModal() }></span>
          <TopHeader headerText="Write your own Question"/>
          <div className='row' style={{ marginTop : '20px' }}>
            <div className='col-xs-12' style={{borderStyle : 'solid', borderWidth : '1px', borderColor : '#e6e6e6'}}>
              <div className='col-xs-10'>
                <Editor editorState={this.state.editorState} onChange={this.onChange} />
              </div>
              <div className='col-xs-1'>
                <button className='btn btn-link btn-xs pull-right' data-toggle='tooltip' title='Add Blank' data-placement='top' onClick = { e => this.openAnswerModal('addBlank') }><span className='glyphicon glyphicon-plus'></span></button>
              </div>
              <div className='col-xs-1'>
                {!this.state.blankAdded && <button className='btn btn-link btn-xs' onClick={ e => this.openAnswerModal('noBlank') }>Done</button>}
                {this.state.blankAdded && <button className='btn btn-link btn-xs' onClick={ e => this.closeModal() }>Done</button>}
              </div>
            </div>
          </div>
          { this.state.answerModalIsOpen &&  <Modal
            isOpen={this.state.answerModalIsOpen}
            onAfterOpen={this.afterOpenModal}
            style={this.state.customStyles}
            shouldCloseOnOverlayClick={false}
            contentLabel="answerOptionsModal"
          >
            <QuestionEditorComponent
              mode={!this.state.blankAdded?'closeModal':'openModal'}
              closeAnswerModal = { (answerType, dropdownOptions, answerKey, mode) => this.closeAnswerModal(answerType, dropdownOptions, answerKey, mode) }
            />
          </Modal> }
        </Modal> }
      <div className='row' style={{marginTop:'35px'}}>
        <div className='col-xs-6'></div>
        <div className='col-xs-6'>
          {!this.state.inBetweenRequest && this.state.allowShare && <button className='btn btn-lg btn-warning' style={{whiteSpace: 'normal'}} onClick={e=> this.sendQuestionData()}>Share</button>}
          {!this.state.inBetweenRequest && !this.state.allowShare && <button className='btn btn-lg btn-warning' style={{whiteSpace: 'normal'}} disabled>Share</button>}
          {this.state.inBetweenRequest && this.state.allowShare && <button className='btn btn-lg btn-warning' style={{whiteSpace: 'normal'}} disabled>Share</button>}
        </div>
      </div>
    </div>

    if( this.state.showSpinner ) {
      page = <div>
        { this.state.showSpinner && <Spinner /> }
      </div>
    }

    if (!this.state.isSupported && !this.state.showSpinner) {
      page = <div className='col-xs-12' style={{marginTop : '150px'}}>
        <TopHeader headerText = {this.state.errorText}/>
      </div>
    }

    return (
      <div>
      {page}
      </div>
    )
  }
}

module.exports = QuestionSelectComponent