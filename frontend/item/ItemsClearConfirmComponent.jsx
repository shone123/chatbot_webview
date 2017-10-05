import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'

class ItemsClearConfirmComponent extends React.Component {

  constructor( props ) {
    super (props)

    this.state = {
      mode : (!_.isUndefined(this.props.location.state.mode))?this.props.location.state.mode : '',
      catalog : (!_.isUndefined(this.props.location.state.catalog))?this.props.location.state.catalog : ''
    }
  }

  clearAllItems() {

    if ( _.isEmpty(this.state.catalog) ) {
      request.post( `/api/clearAll${this.state.mode}s`)
      .send({
        psid : this.props.query.psid,
        botid : this.props.query.botid
      })
      .then( res => {
        this.navigateToItems()
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
      request.post( `/api/clear${this.state.mode}ByCatalog`)
      .send({
        psid    : this.props.query.psid, 
        botid   : this.props.query.botid,
        catalog : this.state.catalog
      })
      .then (res => {
        this.navigateToItems()
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

  navigateToItems() {
    this.props.history.push ({
      pathname : `/viewItems/${this.state.mode}`,
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`
    })
  }

  render() {

    return (
      <div>
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText={this.state.mode === 'Cart'?"Shopping Cart":this.state.mode}/>
          </div>
        </div>

        <div className='text-center' style={{position: 'fixed', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
          <div className='row'>
            { _.isEmpty(this.state.catalog) && <div className='col-xs-12'>
              Are you sure you want to clear ALL {this.state.mode}s?
            </div> }
            { !_.isEmpty(this.state.catalog) && <div className='col-xs-12'>
              Are you sure you want to clear this {this.state.mode}?
            </div> }
          </div>
          
          <div className='row' style={{marginTop: '20px'}}>
            <div className='col-xs-12'>
              By doing so, all items will be removed. This action cannot be undone.
            </div>
          </div>
        </div>

        <div style={ { position: 'absolute', bottom: '20px', width: '98%' } } >
          <div className='row center-block' style={ { marginRight: '15px' } }>
            <div className='col-xs-6'>
              <ButtonWide buttonText={_.isEmpty(this.state.catalog)?`Clear All ${this.state.mode}s`:`Clear ${this.state.mode}`} selected={false} clickHandler={ e => this.clearAllItems() }/>
            </div>
            <div className='col-xs-6'>
              <ButtonWide buttonText="Don't Clear" selected={true} clickHandler={ e => this.navigateToItems() } />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ItemsClearConfirmComponent