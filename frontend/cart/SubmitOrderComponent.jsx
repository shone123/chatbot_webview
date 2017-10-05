import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import { Link } from 'react-router-dom'
var classNames = require('classnames')

class SubmitOrderComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    this.state = {
      catalog : this.props.match.params.catalog
    }
  }
  
  componentDidMount() {
  }
  
  
  gotoKeepShopping() {
    this.props.history.push( `/carts?psid=${this.props.query.psid}&botid=${this.props.query.botid}` )
  }

  render() {

    return (
      <div>
        
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="Shopping Cart"/>
          </div>
        </div>

        <div className='text-center' style={{position: 'fixed', left: '50%', top: '40%', transform: 'translate(-50%, -50%)' }}>
          <div className='row'>
            <div className='col-xs-12'>
              You will be redirected to {this.state.catalog} in order to complete the checkout process.
            </div>
          </div>
          <div className='row' style={{marginTop: '20px'}}>
            <div className='col-xs-12'>
              Would you like to continue to {this.state.catalog}
            </div>
          </div>
        </div>
          
        <div style={ { position: 'absolute', bottom: '20px', width: '98%' } } >
          <div className='row center-block' style={ { marginRight: '15px' } }>
            <div className='col-xs-6'>
              <ButtonWide buttonText="Keep Shopping" selected={false} clickHandler={ e => this.gotoKeepShopping(e) } />
            </div>
            <div className='col-xs-6'>
              <ButtonWide buttonText={ "Go To " + this.state.catalog } selected={true} />
            </div>
          </div>
        </div>

      </div>
    )
  }

}

module.exports = SubmitOrderComponent
