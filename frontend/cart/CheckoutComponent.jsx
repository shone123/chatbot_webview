import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import { Link } from 'react-router-dom'
var classNames = require('classnames')
import CartItemCheckoutComponent from './CartItemCheckoutComponent'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'

class CheckoutComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    // console.log( 'Chekcout constructor', this.props)
    this.state = {
      catalog : this.props.match.params.catalog,
      shipping: 10,
      cart : null,
      showQuantitySelector: false,
      quantityOptionList: [0,1,2,3,4,5,6],
      showSpinner: true
    }
  }
  
  componentDidMount() {
    request.post( '/api/getUsersCartByCatalog' )
    .send({ 
      psid : this.props.query.psid, 
      botid : this.props.query.botid,
      catalog: this.state.catalog
    })
    .then( res => {
      let cart = JSON.parse( res.text )
      console.log( cart )

      let orderTotal = this.calcOrderTotal( cart )

      this.setState({
        cart : cart,
        orderTotal: orderTotal,
        showSpinner: false
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
  
  calcOrderTotal( cart ) {
    // console.log( 'calcOrderTotal ' )
    let total = 0;
    _.each( cart.items, cartItem => {
      // console.log( cartItem )
      total += cartItem.quantity * Number( cartItem.item.price )
    })
    total += Number( this.state.shipping )
    return total
  }

  /**
   * Toggle quantity selector popup
   */
  toggleQuantitySelector( item ) {
    // console.log(  item )
    // let toggle = this.state.showQuantitySelector || false
    // console.log( item.quantity )
    this.setState({
      showQuantitySelector : true,
      currentQuantitySelectorItemSku : item.item.xc_sku,
      currentQuantitySelected: item.quantity
    })
  }

  changeSelectedQuantity( quantity ) {
    this.setState({
      currentQuantitySelected: quantity
    })
  }

  saveSelectedQuantity(  ) {

    console.log( 'saveSelectedQuantity main' )

    request.post( '/api/updateCartItem' )
    .send({
      psid    : this.props.query.psid, 
      botid   : this.props.query.botid,
      catalog : this.state.catalog,
      xc_sku  : this.state.currentQuantitySelectorItemSku,
      quantity: this.state.currentQuantitySelected
    })
    .then( res => {
      console.log( 'saveSelectedQuantity then', res )
      // console.log( 'saveSelectedQuantity')
      let currentSku = this.state.currentQuantitySelectorItemSku
      let currentQuantity = this.state.currentQuantitySelected
      let cart = this.state.cart
      cart.items = _.map( cart.items, cartItem => {
        if ( cartItem.item.xc_sku === currentSku ) {
          cartItem.quantity = currentQuantity
        }
        return cartItem
      })
      
      let orderTotal = this.calcOrderTotal( cart )

      this.setState({
        cart: cart,
        showQuantitySelector : false,
        orderTotal: orderTotal
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


  gotoSubmitOrder() {
    this.props.history.push( `/submitOrder/${this.state.catalog}?psid=${this.props.query.psid}&botid=${this.props.query.botid}` )
  }

  render() {

    var profileBtnClass = classNames({
      'col-xs-6'  : this.props.device === 'MOBILE',
      'col-xs-12' : this.props.device !== 'MOBILE'
    })

    let page = <div>
      
      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText="Shopping Cart"/>
        </div>
      </div>

      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText={ this.state.catalog.charAt(0).toUpperCase() + this.state.catalog.slice(1) + ' Cart'}/>
        </div>
      </div>

      <div className='row' style={{ marginTop: '10px' }}>
        <div className='col-xs-12'>
          <Link to={{pathname : `/viewItem`,
                query : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
                state : {mode : 'Cart', catalog : this.state.catalog} } } > &larr; Back </Link>
        </div>
      </div>


      <div>
      { this.state.cart && this.state.cart.items.map( cartItem =>
          <CartItemCheckoutComponent 
            key={cartItem.item.xc_sku} 
            item={cartItem} 
            toggleQuantitySelector={ e => this.toggleQuantitySelector(e) }
          />
      )}
      { this.state.cart && this.state.cart.items.length === 0 &&
        <div>There are no items in your cart!</div>
      }
      </div>

      { this.state.showSpinner && <Spinner /> }

      <div className='row' style={{ marginTop: '35px' }}>
        <div className='col-xs-8 text-center'>
        Shipping
        </div>
        <div className='col-xs-4'>
          $ {this.state.shipping}
        </div>
      </div>
        
      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-offset-2 col-xs-8'>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Enter Promo Code" />
            <span className="input-group-btn">
              <button className="btn btn-default" type="button">APPLY</button>
            </span>
          </div>
        </div>
      </div>

      <div className='row' style={{ marginTop: '15px', marginBottom: '100px', fontSize: '120%' }}>
        <div className='col-xs-8 text-center'>
          <b>Order Total</b>
        </div>
        <div className='col-xs-4'>
          <b>$ {this.state.orderTotal}</b>
        </div>
      </div>
        
      <div  style={{ position: 'fixed', bottom: '0px', width: '100%', marginLeft: '-15px', zIndex: 2, background: 'white', padding: '15px 0' }}>
        <div className='row center-block'>
          <div className='col-xs-12'>
            <ButtonWide buttonText="Submit Order" selected={true} clickHandler={ e => this.gotoSubmitOrder() } />
          </div>
        </div>
      </div>

      { this.state.showQuantitySelector &&    
      <div style={ { position: 'fixed', bottom: '0px', width: '100%',  background: 'white', zIndex: 10, marginLeft: '-15px', padding: '0 20px', borderTop: '1px dotted grey' } } >
        <div className='row'>
          <div className='col-xs-12'>
            <button type='button' className='btn btn-link' 
              style={{fontSize: '20px', padding: '5px 0'}}
              onClick={ e => this.saveSelectedQuantity(e) }><b>Done</b></button>
          </div>
        </div>
        <div className='row'>
        <div className='col-xs-12 center-block'>
          <div className="list-group">
            <button type="button" className={"list-group-item " + ( this.state.currentQuantitySelected === 1 ? "list-group-item-warning" : "" ) } style={{textAlign: 'center'}} onClick={ e => this.changeSelectedQuantity(1) }>1</button>
            <button type="button" className={"list-group-item " + ( this.state.currentQuantitySelected === 2 ? "list-group-item-warning" : "" ) } style={{textAlign: 'center'}} onClick={ e => this.changeSelectedQuantity(2) }>2</button>
            <button type="button" className={"list-group-item " + ( this.state.currentQuantitySelected === 3 ? "list-group-item-warning" : "" ) } style={{textAlign: 'center'}} onClick={ e => this.changeSelectedQuantity(3) }>3</button>
            <button type="button" className={"list-group-item " + ( this.state.currentQuantitySelected === 4 ? "list-group-item-warning" : "" ) } style={{textAlign: 'center'}} onClick={ e => this.changeSelectedQuantity(4) }>4</button>
            <button type="button" className={"list-group-item " + ( this.state.currentQuantitySelected === 5 ? "list-group-item-warning" : "" ) } style={{textAlign: 'center'}} onClick={ e => this.changeSelectedQuantity(5) }>5</button>
          </div>
        </div>
        </div>
      </div>
      }
    </div>
      
    if( this.state.showSpinner ) {
      page = <div>
        { this.state.showSpinner && <Spinner /> }
      </div>
    }
    return (
      <div>{page}</div>
    )
  }

}

module.exports = CheckoutComponent
