import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import AttributesComponent from '../misc/AttributesComponent'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import { Link } from 'react-router-dom'

class ProfileItemComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    // console.log( 'CONSTRUCTUR', this.props )
    this.state = {
      gender : this.props.match.params.gender,
      category : this.props.match.params.category,
      genderPref : this.props.location.state.genderPref,
      categories : this.props.location.state.categories,
      query : this.props.query,
      quesAttributes : null,         // questions and attributes
      showSpinner : true,
      selectOnce : false
    }
    console.log(this.props.match)
  }
  
  componentDidMount() {

    Promise.all([
      request.post( '/api/getProfileQuestions' )
      .send({ 
        gender: this.state.gender
      })
    ])
    .then (res => {
      let [questions] = res
      questions = JSON.parse( questions.text )
      let currGender
      let currPos
      let quesCurrPos
      return Promise.all([ 
        _.findIndex( this.state.categories, val => val.category === this.state.category ),
        _.findIndex( questions, val => val.category === this.state.category )
      ])
      .then ( res => {
        [currPos, quesCurrPos] = res
        console.log(currPos)
        console.log(this.state.categories[currPos])
        currGender = _.findIndex(this.state.categories[currPos].gender, gender => gender === this.state.gender)
      })
      .then ( noop => {
        this.setState({
          // Previous and Next questions
          prevCategory : ( currPos === 0 ) ? null : this.state.categories[ currPos - 1 ],
          nextCategory : ( currPos === this.state.categories.length - 1 ) ? null : this.state.categories[ currPos + 1 ],
          currCategory : this.state.categories[currPos],
          prevGender : (currGender === 0 ) ? null : this.state.categories[currPos].gender[currGender - 1],
          nextGender : (currGender === this.state.categories[currPos].gender.length - 1) ? null : this.state.categories[currPos].gender[currGender + 1]
        })

        return questions[ quesCurrPos ]
      })

    })
    .then( questions => {

      let quesArray = _.map( questions.ques, ques => {

        return { gender: ques[0], entity: ques[2], attribute: ques[3], quesType: ques[4] }
      })
      return Promise.all([
        request.post( '/api/getAttributesByEntities' ).send({
          quesArray : quesArray,
        }),
        request.post( '/api/getUserPreferencesByEntities' ).send({
          psid   : this.state.query.psid, 
          botid  : this.state.query.botid,
          quesArray : quesArray
        }),
        request.post( '/api/getUserPreferencesByEntity' ).send({
          psid : this.state.query.psid,
          botid : this.state.query.botid,
          entity : quesArray[0].entity,
          gender : quesArray[0].gender
        }),
        questions
      ])
    })
    .then( res => {
      let [ attributes, userPref, entityresult , questions ] = res
      attributes = JSON.parse( attributes.text )
      userPref = JSON.parse( userPref.text )
        // console.log("attributes really are", attributes )
      attributes = _.map( attributes, att => {

        let tmp = _.find( questions.ques, ques => ques[2] === att.entity )
        att.quesType = tmp[4]
        att.attributeName = tmp[3]      // <- size etc.
        att.attributeGender = tmp[0]
        return att
      })
      console.log( attributes, userPref, questions )

      attributes = _.map( attributes, attrObj => {
        // TODO: Enable the following when gender is availabel with backend preferene api
        // let userPrefAttr = _.find( userPref, up => up.entity === attrObj.entity && up.gender === attrObj.attributeGender )
        let userPrefAttr = _.find( userPref, up => up.entity === _.toLower(attrObj.entity) ) 
        if ( userPrefAttr ) {
          userPrefAttr = userPrefAttr[ attrObj.attributeName ]

        }
        return attrObj
      })
      // Convert attributes (eg. size from text to object)
      // Turn selected to true if present in userPref
      //skip if there are no user preferences
      if ( userPref && userPref.length > 0) {
        let defaultPrices = []
        attributes = _.map( attributes, attrObj => {
          if (attrObj.attributeName === 'price') {
            defaultPrices.push(Math.min(...attrObj.attributes))
            defaultPrices.push(Math.max(...attrObj.attributes))
          }
          // TODO: Enable the following when gender is availabel with backend preferene api
          let userPrefAttr = _.find( userPref, up => _.toLower(up.entity) === _.toLower(attrObj.entity) && _.toLower(up.gender) === _.toLower(attrObj.attributeGender) )
          // let userPrefAttr = _.find( userPref, up => _.toLower(attrObj.entity) ) 
          if ( userPrefAttr ) {
            if(attrObj.attributeName === 'price' && !_.isEmpty(userPrefAttr ['priceLowerLimit']) && !_.isEmpty(userPrefAttr ['priceUpperLimit']) ) {
              userPrefAttr = [userPrefAttr ['priceLowerLimit'], userPrefAttr ['priceUpperLimit'] ]
            } else if ( attrObj.attributeName === 'colorsavailable' ) {
              if (userPrefAttr['color'])
                userPrefAttr = userPrefAttr['color']
            } else {
              if (userPrefAttr[ attrObj.attributeName ])
                userPrefAttr = userPrefAttr[ attrObj.attributeName ]
            }
          }
          attrObj.attributes = _.map( attrObj.attributes, attr => {
            if ( _.includes( userPrefAttr, attr ) ) {
              return { text: attr, selected: true }
            }
            return { text: attr, selected: false }
          })
          if (attrObj.attributeName === 'price') {
            if( !_.isUndefined(userPrefAttr)  && !_.isEmpty(userPrefAttr[0]) ) {
              attrObj.attributes = _.map(userPrefAttr, up => {
                  return {text: up, selected: true, key: 'userPref'}
              })
              if (defaultPrices) {
               attrObj.attributes = attrObj.attributes.concat(_.map(defaultPrices, dp => {
                  return {text: dp, selected: false, key: 'defaultPrices'}
                }))
              }
            } else {
              attrObj.attributes = _.map(attrObj.attributes, attr => {
                return attr
              })
            }
          }
          // attrObj.attributes = attrObj.attributes.slice(0, 25)
          attrObj.attributes = this.processAttributes(attrObj.attributes)
          return attrObj
        })
      } else {
        attributes = _.map( attributes, attrObj => {
          attrObj.attributes = _.map( attrObj.attributes, attr => {
            return { text: attr, selected: false }
          })
          // attrObj.attributes = attrObj.attributes.slice(0, 25)
          attrObj.attributes = this.processAttributes(attrObj.attributes)
          return attrObj
        })
      }
      // Add Skip state indicator
      attributes = _.map( attributes, attrObj => {
        attrObj.skip = false
        return attrObj
      })
       console.log('questions', questions)
        console.log('attributes', attributes)

        this.setState({
        quesAttributes : attributes,
        showSpinner : false,
        categoryImage : questions.ques[0][5]
      }, () => {
        console.log(this.state.quesAttributes)
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

  processAttributes(attributes) {
    var processedArr = []
    for (var i = 0; i < attributes.length; i+=25) {
      let temp = attributes.slice(i, i + 25)
      processedArr.push(temp)
    }
    return processedArr
  }

  /**
   * Toggle users selection of attribute
   * @param {*} attrClicked 
   * @param {*} entityText 
   */
  toggleSelected( attrClicked, entityText, iterator ) {
    // console.log( attrClicked, entityText )
    // console.log( this.state.quesAttributes )
    let attributes = _.cloneDeep( this.state.quesAttributes )
    attributes = _.map( attributes, ques => {
      if ( ques.entity !== entityText ) return ques
      ques.attributes[iterator] = _.map( ques.attributes[iterator], attr => {
        if ( attr.text === attrClicked.text  ) {
          attr.selected = !attr.selected
          return attr
        } else {
          return attr
        }
      })
      ques.skip = false
      return ques
    })
    // console.log( ' --> ', attributes )
    this.setState({
      quesAttributes : attributes,
      selectOnce : true
    }, () => {
      console.log( this.state.quesAttributes )
    })
  }

  togglePrice () {
    let attributes = _.cloneDeep( this.state.quesAttributes )
    attributes = _.map( attributes, ques => {
      if (ques.attributeName !== 'price')
        return ques
      ques.attributes = 
          [{
            text : this.setPrice()[0],
            key : 'userPref',
            selected : true
          },
          {
            text : this.setPrice()[1],
            key : 'userPref',
            selected : true
          }]
      ques.skip = false
      return ques
    })
    this.setState ({
      quesAttributes : attributes,
      selectOnce : true
    }, () => {
      console.log( this.state.quesAttributes )
    })
  }

  /**
   * Clear all user selection, toggle skip
   * @param {*} entityText 
   */
  toggleSkip( entityText, iterator ) {
    // console.log( 'Skip', entityText )
    let attributes = _.cloneDeep( this.state.quesAttributes )
    attributes = _.map( attributes, attrObj => {
      if ( attrObj.entity !== entityText ) return attrObj
      attrObj.skip = !attrObj.skip
      attrObj.attributes[iterator] = _.map( attrObj.attributes[iterator], attr => {
        attr.selected = false
        return attr
      })
      return attrObj
    })
    // console.log( attributes )
    this.setState({
      quesAttributes : attributes,
      selectOnce : true
    })
  }

  /**
   * Save users's selections
   */
  savePreferences(e) {
    console.log( 'Save Preferences' )
    console.log( this.state.quesAttributes )

    let preferences = _.cloneDeep( this.state.quesAttributes )
    preferences = _.map( preferences, ques => {
      
      if(ques.attributeName === 'colorsavailable')
        ques.attributeName = 'color'
      // Just take the selected ones
      ques.attributes = _.flatten(ques.attributes)
      ques.attributes = _.filter( ques.attributes, attr => {
        return attr.selected
      })
      // Convert object back into text
      ques.attributes = _.map( ques.attributes, attr => attr.text )

      return ques
    })
    console.log( preferences )
    request.post( '/api/saveUserPreferencesByEntities' )
    .send({
      psid   : this.state.query.psid, 
      botid  : this.state.query.botid,
      preferences : preferences,
    })
    .then( res => {
      console.log( 'saveUserPreferencesByEntities', JSON.parse( res.text ) )

      if (this.state.nextGender) {
        this.props.history.push({ 
          pathname : `/profileItem/${this.state.nextGender}/${this.state.currCategory.category}`,
          search :  `?psid=${this.state.query.psid}&botid=${this.state.query.botid}`,
          state : {genderPref : this.state.genderPref, categories : this.state.categories}
        })
      } else if ( this.state.nextCategory ) {
        console.log( this.state.nextCategory )
        this.props.history.push({ 
         pathname : `/profileItem/${this.state.nextCategory.gender[0]}/${this.state.nextCategory.category}`,
         search : `?psid=${this.state.query.psid}&botid=${this.state.query.botid}`,
         state : {genderPref : this.state.genderPref, categories : this.state.categories}
        })
      } else {
        this.props.history.push( `/profileCompleted?psid=${this.state.query.psid}&botid=${this.state.query.botid}` )        
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

  setPrice() {
    let priceArr = $('#slider-range').slider('values')
    return priceArr
  }

  /**
   * Goto Previous question
   */
  goToPreviousPage() {
    if (this.state.prevGender) {
      this.props.history.push({
        pathname : `/profileItem/${this.state.prevGender}/${this.state.currCategory.category}`,
        search : `?psid=${this.state.query.psid}&botid=${this.state.query.botid}`,
        state : {genderPref : this.state.genderPref, categories : this.state.categories}
      })
    } else if ( this.state.prevCategory ) {
      this.props.history.push({ 
        pathname : `/profileItem/${this.state.prevCategory.gender[0]}/${this.state.prevCategory.category}`,
        search : `?psid=${this.state.query.psid}&botid=${this.state.query.botid}`,
        state : {genderPref : this.state.genderPref, categories : this.state.categories}
      })
    } else {
      this.props.history.push( `/profile?psid=${this.state.query.psid}&botid=${this.state.query.botid}` )        
    }
  }

  render() {

     let page = <div>
        
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="My Profile"/>
          </div>
        </div>

        <div className='row' style={{ marginTop: '20px' }}>
          <div className='col-xs-12 text-center'>
            <b>{this.state.category}</b>
          </div>
        </div>
        
        <div className='row'>
          <div className='col-xs-12'>
            <small style={{ marginLeft: '10px' }}>
              <Link to={"/profile?psid=" + this.props.query.psid + "&botid=" + this.props.query.botid } style={{color: 'black'}}>
                <span className="glyphicon glyphicon-menu-left" aria-hidden="true"></span>
                &nbsp;Profile Home
              </Link>
            </small>
          </div>
        </div>

        <div className='row' style={{ marginTop: '0px' }}>
          <div className='col-xs-12 text-cent1er'>
            <img src={this.state.categoryImage} className='center-block img-responsive' style={{ height: '50px' }}/>
          </div>
        </div>
        
        { 
          this.state.quesAttributes && this.state.quesAttributes.length > 0 && this.state.quesAttributes.map( (ques, index) =>
            <AttributesComponent
              index={index}
              key={ques.entity}
              ques={ ques }
              toggleSelected={ ( attr, entityText, iterator ) => this.toggleSelected( attr, entityText , iterator) }
              setPrice={ e => this.setPrice() } 
              toggleSkip={ (e, iterator) => this.toggleSkip(e, iterator) }
              togglePrice={e => this.togglePrice()}
            ></AttributesComponent>
          )
        }

        <div style={{ marginTop: '30px', width: '100%', marginLeft: '-15px' }} >
          <div className='row center-block'>
            <div className='col-xs-6'>
              <ButtonWide 
                buttonText="Previous" 
                selected={false} 
                clickHandler={ e => this.goToPreviousPage(e) }/>
            </div>
            <div className='col-xs-6'>
              <ButtonWide 
                buttonText="Save & Next" 
                selected={this.state.selectOnce} 
                enabled={this.state.selectOnce}
                clickHandler={ e => this.savePreferences(e) }/>
            </div>
          </div>
        </div>

      </div>
    if (this.state.showSpinner) {
      page = <div>
      { this.state.showSpinner && <Spinner /> }
      </div>
    }

    if (this.state.errorText && !this.state.showSpinner) {
      page = <div>
      { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }
      </div>
    }

    return (
      <div>
      {page}
      </div>
    )
  }

}

module.exports = ProfileItemComponent
