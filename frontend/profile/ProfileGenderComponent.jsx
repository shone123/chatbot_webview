import React from 'react'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import ButtonMainPanel from '../misc/ButtonMainPanel'

class ProfileGenderComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    // console.log('Gender comp', this.props.userObj )
    // this.state = {
    //   gender: this.props.userObj.gender,
    //   currentGenderSelection: this.props.userObj.gender
    // }
  }

  componentDidMount() {
    console.log( 'ProfileGender did mount' )
  }

  componentWillUnmount() {
    console.log( 'ProfileGender will unmount' )
  }

  // clickHandler( gender ) {
  //   console.log( 'clickHandelr', gender )
  //   this.setState( { currentGenderSelection: gender } )
  // }

  // saveGender() {
  //   console.log( 'save gender', this.state.currentGenderSelection )
  // }

  render() {
    return ( 
      <div>
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="My Profile"/>
          </div>     
        </div>

        <div style={{position : 'absolute', top : '50%', left: '50%', transform : 'translate(-50%, -50%)' }}>
          <div className='row' style={{ marginBottom: '15px' }}>
            <div className='col-xs-12 text-center'>
              Do you prefer to shop Men's or Women's clothing?
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <ButtonWide buttonText="Men's" selected={ this.props.currentGenderSelection === "men" } clickHandler={ e => this.props.changeGenderSelection( 'men' ) } />
              <ButtonWide buttonText="Women's" selected={this.props.currentGenderSelection === "women"} clickHandler={ e => this.props.changeGenderSelection( 'women' ) } />
              <ButtonWide buttonText="No Preference" selected={ ! this.props.currentGenderSelection || this.props.currentGenderSelection === "no_preference" }  clickHandler={ e => this.props.changeGenderSelection( 'no_preference' ) }/>
            </div>
          </div>
        </div>

        <div>
          <ButtonMainPanel profileExists={ this.props.profileExists } device={ this.props.device } saveGender={ e => this.props.saveGender(e) } />
        </div>

      </div>
    )
  }
}

module.exports = ProfileGenderComponent
