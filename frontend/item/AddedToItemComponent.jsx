import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import LoadingIdentifier from '../misc/LoadingIdentifier'
import ErrorComponent from '../misc/ErrorComponent'
import RepeatCarousel from '../misc/RepeatCarousel'
import {getProductDetails, removeItemFromList, moveToList, getFeatures} from '../utility.js'

class AddedToItemComponent extends React.Component {
  constructor( props ) {
    super ( props )

    this.state = {
      xc_sku : this.props.query.xc_sku,
      showSpinner : true,
      product: (!_.isUndefined(this.props.location.state.product))?this.props.location.state.product : {
        image : '/images/not_available.jpg'
      },
      recommend: [],
      size: this.props.location.state.size,
      group_sku: '',
      mode : (!_.isUndefined(this.props.location.state.mode))?this.props.location.state.mode : '',
      isSupported : true
    }
  }

  componentDidMount() {

    this.getSupportedFeatures()

    /*getProductDetails(this.props.query.psid, this.props.query.botid, this.state.xc_sku)
    .then((product) => {
      console.log('product',product)
      if ( !_.isUndefined(product) ) {
        this.setState({
          product : product,
          showSpinner: false
        }, () => {
          this.setGroupSku()
        })
        FB.XFBML.parse();
      }
    })*/
    this.setState({
      showSpinner : false
    })

    this.setGroupSku()

    this.getRecommendations()
    .then( nooper => {
      var x = document.getElementsByClassName('item')
      var carouselLength = this.state.recommend.length
      if(!_.isUndefined(x) && x.length === carouselLength && carouselLength > 0) {
        x[0].className = 'item active'
        this.alignRecommendations()
      }
    })
    .catch(err => {
      console.log(err)
    })

  }

  getRecommendations() {
    return new Promise((resolve, reject) => {
      request.post( '/api/recommendProduct' )
      .send( {
        psid  : this.props.query.psid,
        botid : this.props.query.botid,
        type  : _.toLower(this.state.mode)
      })
      .then( res =>
        this.setState({
          recommend : JSON.parse( res.text ).Results
        }, () => {
          resolve('Success')
        })
      )
      .catch( err => {
        console.log( err )
        if ( err && err.status ) {
          this.setState( { showSpinner : false, errorText: err.response.text } )
        } else {
          this.setState( { showSpinner : false, errorText: 'Server Error' } )
        }
      })
    })
  }

  alignRecommendations() {
    $('.multi-item-carousel .item').each(function(){
      var next = $(this).next();
      if (!next.length) {
        next = $(this).siblings(':first');
      }
      next.children(':first-child').clone().appendTo($(this));
  
      if (next.next().length>0) {
        next.next().children(':first-child').clone().appendTo($(this));
      } else {
        $(this).siblings(':first').children(':first-child').clone().appendTo($(this));
      }
    });
  }

  setGroupSku() {
    if(!_.isUndefined(this.state.product.group_sku)) {
      this.setState({
        group_sku : this.state.product.group_sku
      })
    }
  }

  goToWishlist() {
    this.props.history.push({
      pathname : `/viewItems/Wishlist`,
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`
    })
  }

  removeFromWishlist() {

    removeItemFromList(this.props.query.psid, this.props.query.botid, this.state.product.xc_sku, this.state.product.client_name, this.state.mode)
    .then( noop => {
      let product = this.state.product
      product.inWishlist = false
      this.setState({
        product : product
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

  saveToWishlist() {
    this.props.history.push({
     pathname : '/addToItem',
     search   : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
     state    :  {group_sku : (this.state.group_sku)?this.state.group_sku:'', mode : 'Wishlist', product : this.state.product}
   })
  }

  moveItemToCart() {

    moveToList(this.props.query.psid, this.props.query.botid, this.state.product.client_name, this.state.product.colorsavailable, this.state.size?this.state.size:'', this.state.xc_sku, 'Cart')
    .then( noop => {
      console.log('Moved Item to Cart')
      let product = this.state.product
      product.inCart = true
      product.inWishlist = false
      this.setState({
        product: product
      }, () => {
        this.viewImmediateCart()
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

  addItemToCart() {
    this.props.history.push({
     pathname : '/addToItem',
     search   : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
     state    :  {group_sku : (this.state.group_sku)?this.state.group_sku:'', mode : 'Cart', product : this.state.product}
   })
  }

  viewImmediateCart() {
    this.props.history.push({
      pathname : '/addedToItem',
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.props.query.xc_sku}`,
      state :  {size : this.state.size?this.state.size:'', mode: 'Cart', product : this.state.product}
    })
  }

  gotoViewCart() {
    this.props.history.push({
      pathname : `/viewItems/Cart`,
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`
    })
  }

  getSupportedFeatures() {
    getFeatures()
    .then( res => {
      if (res === 'supported') {
        this.setState({
          isSupported : true
        })
      } else {
        this.setState({
          isSupported : false
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  }

  backToMessenger() {
    window.MessengerExtensions.requestCloseBrowser( function success() {
        return;
      }, function error(err) {
        console.error( err, 'Unable to close window.', 'You may be viewing outside of the Messenger app.' )
    })
  }

  render() {
    let page = <div>
      <div className='row' style={{ marginTop: '25px'}}>
        <div className='col-xs-12 text-left'>
          <b><h4>Added to {this.state.mode}!</h4></b>
        </div>
      </div>
      <div className='row' style={{marginTop: '10px', border: 'solid #bc42f4 2px'}}>
        <span className='glyphicon glyphicon-ok' style={{marginRight: '95%', color: '#bc42f4'}}></span>
        <div className='row' style={{marginTop: '5px'}}>
          <div className='col-xs-4' style={{marginBottom: '10px'}}>
            <img src={this.state.product.image} className='img-responsive float-left rounded'/>
          </div>
          <div className='col-xs-8'>
            <div className='row' style={{marginTop:'10px'}}>
              <div className='col-xs-12'>
                <h5>{ _.startCase( _.toLower( this.state.product.brand ) ) }
                  <small style={{marginLeft: '10px'}}>{ _.startCase( _.toLower( this.state.product.productname ) ) }</small>
                </h5>
              </div>
            </div>
            <div className='row' style={{marginTop:'15px'}}>
              <div className='col-xs-4'>
                <span className='small'>Size: </span>
                <span className='small'><b>{_.upperFirst(this.state.size)}</b></span>
              </div>
              <div className='col-xs-4'>
                <span className='small'>Color: </span>
                <span className='small'><b>{(!this.state.product.colorsText)?'NA':this.state.product.colorsText}</b></span>
              </div>
              <div className='col-xs-3'>
                <span className='pull-right small'><b>$ {this.state.product.price}</b></span>
              </div>
              <div className='col-xs-1'></div>
            </div>
            { _.toLower(this.state.mode) === 'wishlist' &&
              <div className='row' style={{marginTop:'15px', marginBottom : '10px'}}>
                <div className='col-xs-6'>
                  { ! this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-default btn-sm btn-block' style={{whiteSpace: 'normal'}} onClick={e=>this.saveToWishlist()}>
                    <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
                  { this.state.product.inWishlist && ! this.state.product.inCart &&<button type='button' className='btn btn-default btn-sm btn-block' style={{whiteSpace: 'normal'}} onClick={e=>this.removeFromWishlist()}>
                    <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
                </div>
                <div className='col-xs-5'>
                  { ! this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-warning btn-block btn-sm' style={{whiteSpace: 'normal'}} onClick={e=>this.addItemToCart()}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
                  { ! this.state.product.inCart && this.state.product.inWishlist &&<button type='button' className='btn btn-warning btn-block btn-sm' style={{whiteSpace: 'normal'}} onClick={e=>this.moveItemToCart()}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
                </div>
                <div className='col-xs-1'></div>
              </div>
            }
          </div>
        </div>
      </div>
      <div className='row'>
        
        <div className='col-xs-12' style={{paddingTop: '20px', paddingBottom: '10px'}}></div>
        </div>
        
        <div className='row'>
          <div className='col-xs-1'></div>
          
          { this.state.mode && _.toLower(this.state.mode) === 'wishlist' && <div className='col-xs-4'>
            <button className='btn btn-default btn-sm btn-block' style={{whiteSpace : 'normal'}} onClick={e=>this.goToWishlist()}>View Wishlist</button>
          </div> }

          { this.state.mode && _.toLower(this.state.mode) === 'cart' && <div className='col-xs-4'>
            <button className='btn btn-default btn-sm btn-block' style={{whiteSpace : 'normal'}} onClick={e=>this.gotoViewCart()}>View Cart</button>
          </div> }
          
          <div className='col-xs-2'></div>
          
          {this.state.isSupported && <div className='col-xs-4'>
            <button className='btn btn-warning btn-sm btn-block' style={{whiteSpace : 'normal'}} onClick={e=>this.backToMessenger()}>KEEP SHOPPING</button>
           </div>
          }  
          <div className='col-xs-1'></div>
        </div>
        
        <div className='row'>
          <div className='col-xs-12' style={{borderBottom: '2px dashed #c7c8c9', paddingTop: '25px', paddingBottom: '15px'}}></div>
        </div>
        
        <div className='row justify-content-center' style={{paddingTop: '3px', paddingBottom: '3px'}}>
          <div className='col-xs-2'></div>
          <div className='col-xs-8'>
            Want to complete the look? Take a look at the items below...
          </div>
          <div className='col-xs-2'></div>
        </div>
        
        <div id='productCarousel' className='carousel slide multi-item-carousel' data-interval='false'>
          <div className='carousel-inner'>
            { this.state.recommend && this.state.recommend.length > 0 && this.state.recommend.map( recommendItem =>
                <RepeatCarousel key={recommendItem.xc_sku} product={recommendItem} psid={this.props.query.psid} botid={this.props.query.botid}/>
              )
            }
            { this.state.recommend && !this.state.recommend.length > 0 &&
              <LoadingIdentifier />
            }
          </div>
          <a className="left carousel-control" href="#productCarousel" data-slide="prev" style={{background:'none'}}>
            <span className="glyphicon glyphicon-chevron-left" style={{color:'#000'}}></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="right carousel-control" href="#productCarousel" data-slide="next" style={{background:'none'}}>
            <span className="glyphicon glyphicon-chevron-right" style={{color:'#000'}}></span>
            <span className="sr-only">Next</span>
          </a>
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

module.exports = AddedToItemComponent