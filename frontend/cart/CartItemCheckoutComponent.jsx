import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import { Link } from 'react-router-dom'
var classNames = require('classnames')

class CartItemCheckoutComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    // console.log( 'CartItem constructor', this.props)
  }
  
  componentDidMount() {
  }
  

  render() {


    return (
      <div style={{ "marginTop" : "20px" }} >
        <div className='row'>
          <div className='col-xs-3'>
            <img src={this.props.item.item.image} className='img-responsive img-thumbnail center-block' />
          </div>
          <div className='col-xs-9'>
            
            <div className='row'>
              <div className='col-xs-12'>
                <b>{ _.startCase( _.toLower( this.props.item.item.brand ) ) }</b> { _.startCase( _.toLower( this.props.item.item.productname ) ) }
              </div>
            </div>
            
            <div className='row'>
              <div className='col-xs-4'>
                Size: <b>{this.props.item.size}</b>
              </div>
              <div className='col-xs-4'>
                Color: <b>{this.props.item.color}</b>
              </div>
              <div className='col-xs-4'>
                Price: <b>$ {this.props.item.item.price}</b>
              </div>
            </div>

            <div className='row'>
              <div className='col-xs-6'>
                <button className='btn btn-default btn-sm' onClick={ e => this.props.toggleQuantitySelector( this.props.item ) }>
                  Quantity : {this.props.item.quantity}
                </button>
              </div>
              <div className='col-xs-6'>
              </div>              
            </div>

          </div>
        </div>
      </div>
    )
  }

}

module.exports = CartItemCheckoutComponent
