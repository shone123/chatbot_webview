import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import TextBox from '../misc/TextBox'
import QuestionAnswerAll from './QuestionAnswerAll'
import AnswerComponent from './AnswerComponent'
import {getProductDetails, getFeatures} from '../utility.js'

class QuestionDisplayComponent extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      showSpinner : true,
      uid : this.props.query.uid,
      appID : '',
      questions : [],
      customQuestions : [],
      answers : [],
      displayQues : false,
      displayAns : false,
      product: {
        image: '/images/not_available.jpg'
      },
      senderData : {
        name : 'NA',
        profile_pic : '/images/not_available.jpg'
      },
      receiverData : {
        name : 'NA',
        profile_pic : '/images/not_available.jpg'
      },
      entryID : '',
      senderPsid : '',
      receiverPsid : '',
      botid : this.props.query.botid,
      xc_sku : this.props.query.xc_sku,
      rUID : '',
      encodedID : '',
      receiverPsidArr : [],
      receiverDataArr : [],
      isSupported : false
    }
  }

  componentDidMount() {

    getFeatures()
    .then( res => {
      if (res === 'supported' || true ) {
        return Promise.all([
          request.post('/api/decodeUniqueID')
          .send({
            uid : this.props.query.uid
          }),
          request.post('/api/getConf')
        ])
        .then (res => {
          let [ids, conf] = res
          ids = JSON.parse( ids.text )
          conf = JSON.parse( conf.text )
          this.setState({
            isSupported : true,
            senderPsid : ids.psid,
            entryID : ids.entryID,
            appID : conf.appID,
            url : conf.url
          })
        })
        .then (noop => {
          return Promise.all([
            getProductDetails(this.state.senderPsid, this.props.query.botid, this.state.xc_sku),
            request.post('/api/getUserQuestions')
            .send({
              psid : this.state.senderPsid,
              entryID : this.state.entryID,
              botid : this.props.query.botid
            })
          ])
          .then( res => {
            let [product, questions] = res
            questions = JSON.parse(questions.text)
            questions = questions.question
            let processedQues = []
            if ( questions.length > 0 ) {
              processedQues = this.processQues(questions)
            }
            this.setState({
              product : product,
              questions : !_.isEmpty(processedQues)? processedQues : []
            })
          })
          .then (noop => {
            this.getPsid()
          })
          .catch( err => {
            console.log( err )
            if ( err && err.status ) {
              this.setState( { showSpinner : false, errorText: err } )
            } else {
              this.setState( { showSpinner : false, errorText: 'Server Error' } )
            }
          })
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

  processQues(questions) {
    questions = _.map( questions, ques => {
      let quesArr = _.split(ques.question, ' _ _ _ _ _ ')
      if( quesArr.length === 1) {
        ques.question = _.map(quesArr, qArr => {
          return {
            question : qArr,
            trail : '',
            keyContent : ques.questionContent
          }
        })
      } else {
        ques.question = _.map( _.dropRight( quesArr, 1 ), (qArr, index) => {
          return {
            question : qArr,
            trail : ' _ _ _ _ _ ',
            keyContent : ques.questionContent.keyContent[index]
          }
        })
      }
      return ques
    })
    return questions
  }

  getPsid() {
    window.MessengerExtensions.getContext(this.state.appID,
      res => {
        this.setState({
          receiverPsid : _.toString(res.psid)
        }, () => {
          this.setDisplay()
        })
      },
      err => {
        console.log(err)
        this.setState({
          showSpinner : false,
          isSupported : false,
          errorText : 'Error Fetching user ID, Please try again'
        })
      }
    )
  }

  setDisplay() {
    if (! _.isEmpty(this.state.receiverPsid) ) {
        return Promise.all([
          request.post('/api/getUserInfo')
          .send({
            psid : this.state.senderPsid
          }),
          request.post('/api/getUserInfo')
          .send({
            psid : this.state.receiverPsid
          })
        ])
        .then (res => {
          let [sender, receiver] = res
          sender = JSON.parse( sender.text )
          receiver = JSON.parse( receiver.text )
          this.setState({
            senderData : {
              name : sender.first_name + ' ' + sender.last_name,
              profile_pic : sender.profile_pic
            },
            receiverData : {
              name : receiver.first_name + ' ' + receiver.last_name,
              profile_pic : receiver.profile_pic
            }
          })
        })
        .then (noop => {
          if(this.state.receiverPsid === this.state.senderPsid) {
            this.getAllAnswers()
            this.setState({
              displayQues : true,
              showSpinner : false
            })
          } else {
            this.setState({
              displayQues : false,
              showSpinner : false
            })
          }
        })
        .catch( err => {
          console.log( err )
          if ( err && err.status ) {
            this.setState( { showSpinner : false, errorText: err.response.text } )
          } else {
            this.setState( { showSpinner : false, errorText: 'Server Error' } )
          }
        })
      }
  }

  getAllAnswers() {
    request.post('/api/retrieveAllAnswers')
    .send({
      psid : this.state.senderPsid,
      botid : this.props.query.botid,
      feedback_id : this.state.entryID
    })
    .then( res => {
      let response = JSON.parse(res.text)
      if (!_.isEmpty(response)) {
        var receiverPsidArr = _.map(response, res => {
          return {
            name : res.receiver_name,
            psid : res.receiverPsid
          }
        })
        // console.log(receiverPsidArr)
       this.parseAllAnswers(response,receiverPsidArr)
      } else {
        this.setState({
          errorText : 'No friend has filled Feedback until now!'
        })
      }
    })
    .catch( err => {
      console.log( err )
      if ( err && err.status ) {
        this.setState( { showSpinner : false, errorText: err.response.text } )
      } else {
        this.setState( { showSpinner : false, errorText: 'Server Error' } )
      }
    })
  }

  parseAllAnswers(response, receiverPsidArr) {
    var receiverDataArray = []
    receiverDataArray = _.map (receiverPsidArr, rec => {
      var resData = _.filter(response, res => {
        return _.toString(res.receiverPsid) === _.toString(rec.psid)
      })
      if (resData) {
        resData = _.map(resData, responseData => {
          let answerData = JSON.parse(responseData.answer)
          let questions =  this.processQuestions(answerData)
          let answers = this.processAnswers(answerData)
          return {
            questions : questions,
            answers : answers
          }
        })
        return {
          receiverPsid : rec.psid,
          receiverName : rec.name,
          receiverData : resData
        }
      }
    })
    if (receiverDataArray) {
      this.setState({
        receiverDataArr : receiverDataArray
      })
    }
  }

  getAnswerData(id, key, answer) {
    let answers = _.cloneDeep(this.state.answers)
    let questions = _.cloneDeep(this.state.questions)
    let questionIndex = _.findIndex(questions, ques => {
      return ques.id === id
    })
    let ansIndex = _.findIndex(answers, ans => {
      return ans.id === id
    })
    if ( ansIndex === -1 ) {
      answers.push({
        id : id,
        question : questions[questionIndex],
        answerData : [{
          key : key,
          answer : answer
        }]
      })
    } else {
      answers[ansIndex].answerData.push({
        key : key,
        answer : answer
      })
    }
    this.setState({
      answers : answers
    }, () => {
      console.log(this.state.answers)
    })
  }

  encodeData() {
    let quesId = this.state.rUID
    let psid = this.state.senderPsid
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
         this.shareFeedback()
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

  sendAnswers() {
    request.post('/api/sendUserAnswers')
    .send({
      feedback_id : this.state.entryID,
      senderPsid : this.state.senderPsid,
      receiverPsid : this.state.receiverPsid,
      // receiverPsid : _.random(1000000000000000, 9999999999999999, false),
      answers : this.state.answers,
      sender_name : this.state.senderData.name,
      receiver_name : this.state.receiverData.name,
      // receiver_name : 'Abzooba',
      botid : this.state.botid
    })
    .then( res => {
      let response = JSON.parse(res.text)
      if (response) {
        this.setState({
          rUID : response.id
        })
      }
    })
    .then(noop => {
      this.encodeData()
    })
    .catch( err => {
      console.log( err )
      if (err && err.status) {
        this.setState( { errorText: err.response.text } )
      } else {
        this.setState( { errorText: 'Server Error' } )
      }
    })
  }

  processQuestions(data) {
    let questions = _.map(data, quesData => {
      let id = quesData.id
      let question = ''
      _.forEach(quesData.question.question, ques => {
        question += ques.question + ques.trail
      })
      let questionContent = quesData.question.questionContent
      return {
        id : id,
        question : question,
        questionContent : questionContent
      }
    })
    return questions
  }

  processAnswers(data) {
    let answers = _.map(data, ansData => {
      let id  = ansData.id
      let answer = ansData.answerData
      return {
        id : id,
        answer : answer
      }
    })
    return answers
  }

  shareFeedback() {
    let url = this.state.url
    let uid = this.state.encodedID
    let botid = this.props.query.botid
    let xc_sku = this.props.query.xc_sku
    if (uid && url) {
      var messageToShare = {
        "attachment" : {
          "type" : "template",
          "payload" : {
            "template_type" : "generic",
            "elements" : [{
              "title": "My advice for you!",
              "image_url": this.state.product.image,
              "subtitle": _.upperFirst(this.state.product.productname) + ' : ' + _.upperFirst(this.state.product.brand) + ' : $'+ this.state.product.price,
              "default_action": {
                "type": "web_url",
                "url" : `${url}/showUserAnswer?uid=${uid}&botid=${botid}&xc_sku=${xc_sku}`
              },
              "buttons": [{
                "type"  : "web_url",
                "url"   : `${url}/showUserAnswer?uid=${uid}&botid=${botid}&xc_sku=${xc_sku}`,
                "title" : "See Feedback",
                "webview_height_ratio": "full",
                "messenger_extensions": true
              }]
            }]
          }
        }
      };
      window.MessengerExtensions.beginShareFlow( response => {
        if (response.is_sent) {
          console.log('Shared Feedback')
        }
      }, (errorCode, errorMessage) => {
        console.log(errorCode, errorMessage)
      }, messageToShare, 'current_thread');
    }
  }

  render() {
    let page = null
      let answerPage = <div>
      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText="Give Feedback"/>
        </div>
      </div>
      <div className='row' style={{marginTop : '15px'}}>
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
          this.state.questions && this.state.questions.length > 0 &&
          this.state.questions.map ( ques =>
            <AnswerComponent
              key={ques.id}
              id={ques.id}
              ques={ques.question}
              getAnswerData={ (id, key, answer) => this.getAnswerData(id, key, answer)}
            />
          )
        }
        </div>
        </div>
        <div className='row' style={{marginTop:'35px'}}>
        <div className='col-xs-6'></div>
        <div className='col-xs-6'>
          <button className='btn btn-lg btn-warning' style={{whiteSpace: 'normal'}} onClick={e=> this.sendAnswers()}>Submit</button>
        </div>
      </div>
    </div>

    let displayPage = <div>
      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText="Feedback from Friends"/>
        </div>
      </div>
      <div className='row' style={{marginTop : '25px'}}>
        <div className='col-xs-1'></div>
        <div className='col-xs-10'>
          { this.state.receiverDataArr && this.state.receiverDataArr.length > 0 && this.state.receiverDataArr.map ( rec => 
              rec.receiverData && rec.receiverData.length > 0 && rec.receiverData.map( (receiver, index) =>
                <QuestionAnswerAll
                  receiver_name={rec.receiverName}
                  receiverPsid={rec.receiverPsid}
                  receiverItem={receiver}
                  key={index+receiver}
                ></QuestionAnswerAll>
              )
            )
          }
        </div>
        <div className='col-xs-1'></div>
      </div>
    </div>



    if( this.state.showSpinner && !this.state.displayQues) {
      page = <div>
        { this.state.showSpinner && <Spinner /> }
      </div>
    }

    if(!this.state.displayQues && !this.state.showSpinner) {
      page = <div>
        {!this.state.displayQues && answerPage}
      </div>
    }

    if (this.state.displayQues && !this.state.showSpinner) {
      page = <div>
        {this.state.displayQues && displayPage}
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

module.exports = QuestionDisplayComponent