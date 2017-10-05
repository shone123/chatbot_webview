import React from 'react'
import ButtonMain from './ButtonMain'
import ButtonWide from './ButtonWide'
var classNames = require('classnames')

class ButtonMainPanel extends React.Component {

  constructor(  props ) {
    super( props )
    this.state = this.props
  }

  closeCurrentTab() {
    console.log( 'Closing Tab' )
    // window.top.close();
    // window.open('','_self').close();
    // window.open(location, '_self').close();
    // window.close();opener.window.focus();
    // window.open('','_parent','');
    // window.close();
    // var myWindow = window.open("", "_self");
    // myWindow.document.write("");
    // setTimeout (function() {myWindow.close();},1000);
  }
  
  backToMessenger() {
    window.MessengerExtensions.requestCloseBrowser( function success() {
        return;
      }, function error(err) {
        console.error( err, 'Unable to close window.', 'You may be viewing outside of the Messenger app.' )
    })
  }

  render() {

    var profileBtnClass = classNames({
      'col-xs-6' : this.state.device === 'MOBILE',
      'col-xs-12' : this.state.device !== 'MOBILE'
    })

    return (
      <div style={ { position: 'absolute', bottom: '20px', width: '98%' } } >
        <div className='row center-block' style={ { marginRight: '15px' } }>
          { this.props.device === 'MOBILE' &&
            <div className='col-xs-6'>
              <ButtonWide buttonText="Back To Messenger" selected={false} clickHandler={ e => this.backToMessenger() }/>
            </div>
          }
          <div className={profileBtnClass} >
            { this.props.profileExists && <ButtonWide buttonText="Update Profile" selected={true} clickHandler={ this.props.saveGender } /> }
            { ! this.props.profileExists && <ButtonWide buttonText="Create Profile" selected={true}  clickHandler={ this.props.saveGender } /> }
          </div>
        </div>
      </div>

    )
  }
}

module.exports = ButtonMainPanel
