import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
var classNames = require('classnames')
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import RepeatButton from '../misc/RepeatButton'
import {getProductDetails, removeItemFromList} from '../utility.js'

class ProductDetailsComponent extends React.Component {

  constructor( props ) {
    super( props )
    // console.log("Product details", props )

    this.state = {
      // xc_sku : this.props.match.params.xc_sku,
      xc_sku : this.props.query.xc_sku,
      showSpinner : true,
      product: {
        image: '/images/not_available.jpg'
      },
      group_sku: ''
    }
  }

  componentDidMount() {

    getProductDetails(this.props.query.psid, this.props.query.botid, this.state.xc_sku)
    .then((product) => {
      console.log('product',product)
      if (!_.isUndefined(product)) {
        this.setState({
          product : product,
          showSpinner: false
        }, () => {
          this.checkforWishlist()
        })
        FB.XFBML.parse();
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

  saveToWishlist() {
    this.props.history.push({
      pathname : '/addToItem',
      search : `psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
      state : {group_sku : this.state.group_sku?this.state.group_sku:'', mode : 'Wishlist', product : this.state.product}
    })
  }

  removeFromWishlist() {

    removeItemFromList(this.props.query.psid, this.props.query.botid, this.state.product.xc_sku, this.state.product.client_name, 'Wishlist')
    .then( noop => {
      let product = this.state.product
      product.inWishlist = false
      this.setState({
        product : product,
        selectedSize : ''
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

  checkforWishlist() {
    if(_.isUndefined(this.state.product.group_sku) ) {
      this.setState({
        group_sku : this.state.product.group_sku
      })
    }
    if (this.state.product.inWishlist && this.state.product.inCart) {
      this.removeFromWishlist()
    }
    else {
      console.log('No conflicts')
      return
    }
  }

  addItemToCart() {
    this.props.history.push({
      pathname : '/addToItem',
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
      state : { group_sku: this.state.group_sku?this.state.group_sku:'', mode : 'Cart', product : this.state.product}
    })
  }

  // { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }
  render() {

    var profileBtnClass = classNames({
      'col-xs-12' : this.props.device === 'MOBILE',
      'col-xs-12' : this.props.device !== 'MOBILE'
    })

    let page = <div>
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText="Product Details"/>
          </div>
        </div>

        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12'>
            <img src={this.state.product.image} className="img-responsive center-block img-thumbnail" />
          </div>
        </div>

        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12'>
            <h3>{ _.startCase( _.toLower( this.state.product.brand ) ) }
              <small style={{marginLeft: '10px'}}>{ _.startCase( _.toLower( this.state.product.productname ) ) }</small>
            </h3>
          </div>
        </div>

        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-right'>
            <b>Price ${ this.state.product.price }</b>
          </div>
        </div>

        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-6'>
            { ! this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-warning btn-sm btn-block' onClick={e=>this.saveToWishlist()}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            { this.state.product.inWishlist && ! this.state.product.inCart &&<button type='button' className='btn btn-warning btn-sm btn-block' onClick={e=>this.saveToWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            { ! this.state.product.inWishlist &&  this.state.product.inCart &&<button type='button' className='btn btn-warning btn-sm btn-block' onClick={e=>this.saveToWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
          </div>
          <div className='col-xs-6 text-right'>
            <div className="fb-share-button" data-href={this.state.product.product_url} data-layout="button_count" data-size="large" data-mobile-iframe="true"></div>
          </div>
        </div>

        <div className='row' style={{marginTop: '15px'}}>
          <div className='col-xs-12 text-center'>
            <b>Product Details</b>
          </div>
        </div>

        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>
            { _.upperFirst( this.state.product.details ) }
          </div>
        </div>

        { this.state.product.colorsText &&
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>
            <b>Colors:</b> { _.upperFirst( this.state.product.colorsText ) }
          </div>
        </div>
        }

        { this.state.product.size &&
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>
            <b>Sizes:</b> {this.state.product.sizeText}
          </div>
        </div>
        }
        <div className='row' style={{marginTop: '20px', marginBottom: '20px'}}>
          <div className={profileBtnClass}>
            { ! this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.addItemToCart()}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.addItemToCart()}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { ! this.state.product.inCart && this.state.product.inWishlist &&<button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.addItemToCart()}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
          </div>
        </div>
      </div>

      if( this.state.showSpinner ) {
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



module.exports = ProductDetailsComponent
