import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import ProfileGenderComponent from '../profile/ProfileGenderComponent'
import ProfileListComponent from '../profile/ProfileListComponent'
import ErrorComponent from '../misc/ErrorComponent'
import Spinner from '../misc/SpinnerComponent'


class ProfileComponent extends React.Component {
  
  constructor( props ) {
    super( props )    
    this.state = { 
      showSpinner : true,
      errorText   : null,
      query       : this.props.query,
      userObj     : null,
      currentGenderSelection: null,
      showGenderPage: false,
      showListPage: false,
      profileExists : false
    }
  }

  componentDidMount() {
    
    request.post( '/api/getUser' )
    .send( { 
      psid : this.state.query.psid, 
      botid : this.state.query.botid 
    })
    .then( res => JSON.parse( res.text ) )
    .then( userObj => {
      console.log('userObj', userObj)
      userObj.gender = userObj.gender === 'men,women' ? 'no_preference' : userObj.gender
      let showGenderPage = !userObj.gender        // If gender is null or undefined, show Gender page
      let profileExists =  !!userObj.gender
      userObj.gender = ! userObj.gender ? 'no_preference' : userObj.gender    // But make the gender 'no_preference' before passing it to gender component
      
      this.setState( { 
        showSpinner : false, 
        userObj : userObj,
        currentGenderSelection : userObj.gender,
        showGenderPage: showGenderPage,
        showListPage: ! showGenderPage,
        profileExists: profileExists
      })
    })
    .catch( err => {
      if ( err && err.status ) {
        this.setState( { showSpinner : false, errorText: err.response.text } )
      } else {
        this.setState( { showSpinner : false, errorText: 'Server Error' } )
      }
    })

  }

  componentWillUnmount() {
  }

  changeGenderSelection( gender ) {
    // console.log( 'clickHandelr', gender )
    this.setState( { currentGenderSelection: gender } )
  }

  saveGender() {

    request.post( '/api/updateUser' )
    .send( { 
      psid : this.state.query.psid, 
      botid : this.state.query.botid,
      gender: this.state.currentGenderSelection || 'no_preference'
    })
    .then( noop => {
      this.setState({
        userObj: {
          gender : this.state.currentGenderSelection
        },
        profileExists  : true,
        showGenderPage : false,
        showListPage   : true
      })
    })
    .catch( err => {
      if ( err && err.status ) {
        this.setState( { showSpinner : false, errorText: err.response.text } )
      } else {
        this.setState( { showSpinner : false, errorText: 'Server Error' } )
      }
    })

  }

  switchToGenderPage() {
    console.log( 'switchToGenderPage' )
    this.setState({
      showGenderPage : true,
      showListPage   : false
    })
  }


  render() {
    
    let page = null

    // userObj.gender can be null, men, women and men,women
    if ( this.state.showListPage ) {
      page = <ProfileListComponent
              switchToGenderPage = { e => this.switchToGenderPage(e) }
              query   = { this.state.query   }
              userObj = { this.state.userObj }
              {...this.props}
             />
    }
    if ( this.state.showGenderPage ) {
      page = <ProfileGenderComponent 
              device={ this.props.device } 
              profileExists={ this.state.profileExists }
              currentGenderSelection={ this.state.currentGenderSelection }
              changeGenderSelection={ e => this.changeGenderSelection(e) }
              saveGender={ e => this.saveGender(e) }
            />
    }
    if ( this.state.showSpinner ) {
      page = <Spinner />
    }
    if ( this.state.errorText ) {
      page = <ErrorComponent errorText={this.state.errorText} />
    }

    return (
      <div>{page}</div>
    )

  }

}



module.exports = ProfileComponent
