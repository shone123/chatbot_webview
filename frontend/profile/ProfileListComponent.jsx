import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import { Link } from 'react-router-dom'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'

class ProfileListComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    // console.log( 'List constructor', this.props)
    this.state = {
      query : this.props.query,
      gender : this.props.userObj.gender || 'no_preference',
      showSpinner : true
    }
  }
  
  componentDidMount() {
    
    // console.log(this.props.userObj)
    
    let userPreferences = request.post( '/api/getUserPreferences' ).send({ psid : this.state.query.psid, botid : this.state.query.botid })
    let questions = request.post( '/api/getProfileQuestions' ).send({ gender: this.props.userObj.gender })
    
    Promise.all( [ questions, userPreferences ] )
    .then( res => {
      let [ questions , userPref ] = res
      questions = JSON.parse( questions.text )
      userPref = JSON.parse( userPref.text )

      // Match userPref with questions
      questions = _.map( questions, ques => {
        let str = ''
        let userStr = []
        let gender = []
        let gresult1 = _.find(ques.ques, q => { return (q[0] === 'men') })
        let gresult2 = _.find(ques.ques, q => { return (q[0] === 'women') })
        if ( !_.isUndefined(gresult1) && !_.isUndefined(gresult2) ) {
          gender.push(gresult2[0])
          gender.push(gresult1[0])
          ques.gender = gender
        } else {
          gender.push(!_.isUndefined(gresult2) ? gresult2[0] : gresult1[0])
          ques.gender = gender
        }
        this.setState({
          genderPref : gender
        })
        ques.ques = _.filter(_.partition(ques.ques, q => {
          return q[0] === 'men'
        }), q => {
          return q.length > 0
        })
        _.forEach( userPref, up => {
          _.forEach( ques.ques, q => {
            _.forEach(q, ques => {
              if ( _.toLower(ques[2]) === _.toLower(up.entity) && up[ ques[3] ] && up[ ques[3] ].length > 0  && ques[0] === up['gender']) {
                str += ' | ' +_.upperFirst( _.toLower(ques[2]) ) + ' ' +_.toLower( ques[3] ) + ' : ' + up[ ques[3] ].join( ', ' )
              } else if ( _.toLower(ques[2]) === _.toLower(up.entity) && ques[3] === 'colorsavailable' && up ['color'] && up[ 'color' ].length > 0  && ques[0] === up['gender']) {
                str += ' | ' +_.upperFirst( _.toLower(ques[2]) ) + ' ' + 'color' + ' : ' + up[ 'color' ].join( ', ' )
              } else if ( _.toLower(ques[2]) === _.toLower(up.entity) && ques[3] === 'price' && up[ 'priceLowerLimit' ] && up['priceUpperLimit'] && ques[0] === up['gender']) {
                str += ' | ' +_.upperFirst( _.toLower(ques[2]) ) + ' ' + 'price' + ' : ' + '$' +  up[ 'priceLowerLimit' ] +  ' - $' + + up['priceUpperLimit']
              }
            })
            if (!_.isEmpty(str)) {
              userStr.push(str)
            }
            ques.ques.userPref = userStr
            str = ''
          })
        })
        return ques
      })

      // Attach images
      questions = _.map( questions, ques => {
        let imageArr = []
        _.forEach(ques.ques, q => {
          imageArr.push(q[0][5])
        })
        ques.ques.image = _.reverse(imageArr)
        return ques
      })

      var categories = _.map(questions, ques => {
        return {
          category : ques.category,
          gender : ques.gender
        }
      })

      console.log( 'questions', questions)
      // TODO: Figure out user preference merging
      this.setState({
        firstCategory : questions[0].category, 
        questions     : questions,
        categories : categories,
        showSpinner   : false
      })
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

  startWizard() {
    if ( this.state.firstCategory ) {
      this.props.history.push({ 
        pathname : `/profileItem/${this.state.gender}/${this.state.firstCategory}`,
        search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
        state : {genderPref : this.state.genderPref, categories : this.state.categories}
      })
    }
  }

  render() {
    let genderString = ''
    if ( this.props.userObj.gender === 'men' ) genderString = 'Men\'s'
    if ( this.props.userObj.gender === 'women' ) genderString = 'Women\'s'

      let page =  <div>
        
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="My Profile"/>
          </div>
        </div>

        { this.state.questions && this.state.questions.map( (ques,index) =>
          <div key={index + ques.category}>
            <div key={ques+index} className='row' style={{ marginTop: '15px' }}>
              <div className='col-xs-12' key={ques.userPref}>
                  {ques.gender && ques.gender.length > 0 && ques.gender.map( (genderString,index) => 
                  <div key={genderString+index}>
                    <div className='text-center' key={index}>
                      { index === 0 && ques.category }
                    </div>
                    <div className="list-group" style={{ marginTop: '15px' }}>
                    <Link 
                    to={ {
                      pathname : "/profileItem/" + genderString + "/"+ ques.category,
                      query : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
                      state : {genderPref : ques.gender, categories : this.state.categories} }
                    } 
                    key={ques.category}
                    className="list-group-item"
                    >
                    <b>{_.upperFirst(genderString)}</b>
                    <span className='pull-right'>
                      <span className="glyphicon glyphicon-chevron-right pull-right" aria-hidden="true" style={{ marginTop: '8px' }}></span>
                      <img src={ques.ques.image[index]} className='pull-right' style={{ height: '35px', marginRight: '9px', marginTop: '1px' }}/>
                    </span>
                    <br/>
                    { !_.isUndefined(ques.ques.userPref) && <small className='text-warning'>{ques.ques.userPref[index]}&nbsp;</small>}
                    </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={{ bottom: '15px', width: '100%', marginLeft: '-15px', marginBottom: '15px' }} >
          <div className='row center-block'>
            <div className='col-xs-6'>
              <ButtonWide buttonText="Change Gender" selected={false} clickHandler={ e => this.props.switchToGenderPage(e) }/>
            </div>
            <div className='col-xs-6'>
              <ButtonWide buttonText="Edit Profile" selected={true} clickHandler={ e => this.startWizard(e) } />
            </div>
          </div>
        </div>


      </div>
    if (this.state.showSpinner) {
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

module.exports = ProfileListComponent
