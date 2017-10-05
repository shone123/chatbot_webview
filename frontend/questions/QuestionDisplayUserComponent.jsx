import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import QuestionAnswerUser from './QuestionAnswerUser'
import {getProductDetails} from '../utility.js'

class QuestionDisplayUserComponent extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      showSpinner : true,
      uid : this.props.query.uid,
      psid : '',
      entryID : '',
      questions : [],
      answers : [],
      feedbackUsername : '',
      product: {
        image: '/images/not_available.jpg'
      },
    }
  }

  componentDidMount() {
    request.post('/api/decodeUniqueID')
    .send({
      uid : this.state.uid
    })
    .then(res => {
      let response = JSON.parse(res.text)
      this.setState({
        psid : response.psid,
        entryID : response.entryID
      })
    })
    .then(noop => {
      // this.getAllQuestions()
      this.getProductDetails()
      this.getUserAnswers()
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

  getUserAnswers() {
    request.post('/api/retrieveUserAnswer')
    .send({
      psid : this.state.psid,
      // psid : '4743974666519724',
      entryID : this.state.entryID,
      botid : this.props.query.botid
    })
    .then(res => {
      let response = JSON.parse(res.text)
      let answerData = JSON.parse(response.answer)
      let questions = this.processQuestions(answerData)
      let answers = this.processAnswers(answerData)
      this.setState ({
        questions : questions,
        answers : answers,
        feedbackUsername : response.receiver_name,
        showSpinner : false
      }, () => {
        console.log(this.state)
      })
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

  getProductDetails() {

    getProductDetails(this.state.psid, this.props.query.botid, this.props.query.xc_sku)
    .then((product) => {
      if (!_.isUndefined(product)) {
        this.setState({
          product : product
        })
      }
    })
    .catch( err => {
      console.log( err )
      if ( err && err.status ) {
        this.setState( { errorText: err.response.text } )
      } else {
        this.setState( { errorText: 'Server Error' } )
      }
    })

  }

  render() {
    let page = null
      page = <div>
        <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          {this.state.feedbackUsername && <TopHeader headerText={this.state.feedbackUsername+ "'s" + " Feedback"}/>}
          {!this.state.feedbackUsername && <TopHeader headerText="User Feedback"/>}
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

      <div className='row' style={{marginTop : '25px'}}>
        <div className='col-xs-1'></div>
        <div className='col-xs-10'>
          { this.state.questions && this.state.questions.length > 0 &&
            this.state.questions.map((question, index) => 
              <QuestionAnswerUser
              question={question}
              answers={this.state.answers}
              key={index+question.id}
              ></QuestionAnswerUser>
              )
          }
        </div>
        <div className='col-xs-1'></div>
      </div>

      </div>

    if( this.state.showSpinner ) {
        page = <div>
          { this.state.showSpinner && <Spinner /> }
        </div>
    }

    return (
      <div>
      {page}
      </div>
    )
  }
}

module.exports = QuestionDisplayUserComponent