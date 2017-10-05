import React from 'react'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
var classNames = require('classnames')
import { Route, withRouter } from 'react-router-dom'

class ProfileDoneComponent extends React.Component {
  
  constructor( props ) {
    super( props )
  }
  
  componentDidMount() {
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
      'col-xs-6' : this.props.device === 'MOBILE',
      'col-xs-12' : this.props.device !== 'MOBILE'
    })

    return (
      <div>

        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="My Profile"/>
          </div>
        </div>

        <div className='text-center' style={{position: 'fixed', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
          <div className='row'>
            <div className='col-xs-12'>
              You have completed your sizing Profile!
            </div>
          </div>
          <div className='row' style={{marginTop: '20px'}}>
            <div className='col-xs-12'>
              You can access your Profile at any time by typing "My Profile" in the text box, or selecting MY PROFILE from the main menu in you Messenger conversation with BotCouture.
            </div>
          </div>
          { this.props.device === "MOBILE" &&
          <div className='row' style={{marginTop: '20px'}}>
            <div className='col-xs-12'>
              Would you like to go back to Messenger or make edits to your Profile?
            </div>
          </div>
          }
        </div>

        <div style={{ position: 'fixed', bottom: '15px', width: '100%', marginLeft: '-15px' }} >
          <div className='row center-block'>
            <div className={profileBtnClass}>
              <Route render={ ({history}) => ( 
                  <ButtonWide 
                    buttonText="View Profile" 
                    selected={true} 
                    clickHandler={() => history.push( `/profile?psid=${this.props.query.psid}&botid=${this.props.query.botid}` ) } 
                  /> 
                )} 
              />
            </div>
            { this.props.device === "MOBILE" && 
            <div className='col-xs-6'>
              <ButtonWide buttonText="Keep Shopping" selected={true} clickHandler={ e => this.backToMessenger() } />
            </div>
            }
          </div>
        </div>

      </div>
    )
  }

}

module.exports = ProfileDoneComponent
