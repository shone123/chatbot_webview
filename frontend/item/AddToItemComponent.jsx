import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import RepeatButton from '../misc/RepeatButton'
import * as util from '../utility.js'

class AddToItemComponent extends React.Component {
  constructor( props ) {
    super ( props )

    this.state = {
      xc_sku : this.props.query.xc_sku,
      showSpinner : true,
      product:  (!_.isUndefined(this.props.location.state.product))?this.props.location.state.product : {
        image : '/images/not_available.jpg'
      },
      productarr : [],
      selectedSize: '',
      group_sku : this.props.location.state.group_sku,
      mode : (!_.isUndefined(this.props.location.state.mode))?this.props.location.state.mode : ''
    }
    this.iterator = 0
  }

  componentDidMount() {
    if (this.state.group_sku) {
      util.getGroupProductDetails(this.props.query.psid, this.props.query.botid, this.state.group_sku)
      .then( finalProductarr => {
        this.setState({
          productarr : finalProductarr,
          showSpinner : false
        })
      })
      .then( noop => {
        this.renderCarousel()
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
      this.setState({
        showSpinner : false
      })
      /*util.getProductDetails(this.props.query.psid, this.props.query.botid, this.state.xc_sku)
      .then((product) => {
        console.log('product',product)
        if (!_.isUndefined(product)) {
          this.setState({
            product : product,
            showSpinner: false
          })
        }
      })
      .catch( err => {
        console.log( err )
        if ( err && err.status ) {
          this.setState( { showSpinner : false, errorText: err.response.text } )
        } else {
          this.setState( { showSpinner : false, errorText: 'Server Error' } )
        }
      })*/
    }
  }

  renderCarousel() {
    var x = document.getElementsByClassName('item');
    var arr_length = this.state.productarr.length
    if(typeof x !== 'undefined' && arr_length > 0 && x.length === arr_length) {
      x[0].className = 'item active'
    }
  }

  switchProduct(state) {
    var arr_length = this.state.productarr.length
    if (state === 'prev') {
      $('#productCarousel').carousel('prev')
      if(this.iterator <= 0) {
        this.iterator = arr_length-1
      } else {
        this.iterator = this.iterator - 1
      }
    }
    else if(state === 'next') {
      $('#productCarousel').carousel('next')
      if (this.iterator >= arr_length-1) {
        this.iterator = 0
      } else {
        this.iterator = this.iterator + 1
      }
    }
    this.forceUpdate()
  }

  functionSelector(name, iterator) {
    if (iterator >= 0) {
      this.setState({
        product : this.state.productarr[iterator]
      }, () => {
        console.log(this.state.product)
        if (name === 'saveToWishlist') {
          this.saveToWishlist()
        } else if (name === 'removeFromWishlist') {
          this.removeFromWishlist()
        } else if (name === 'moveItemToWishlist') {
          this.moveItemToWishlist()
        } else if (name === 'addItemToCart') {
          this.addItemToCart()
        } else if (name === 'removeItemFromCart') {
          this.removeItemFromCart()
        } else if (name === 'moveItemToCart') {
          this.moveItemToCart()
        }
      })
    }
  }

  saveToWishlist() {

    util.saveToWishlist(this.props.query.psid, this.props.query.botid, this.state.product.client_name, this.state.product.colorsText, this.state.selectedSize, this.state.product.xc_sku)
    .then( noop => {
      let product = this.state.product
      product.inWishlist = true
      console.log(product)
      this.setState({
        product : product
      },() => {
        this.viewImmediateWishList()
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

  removeFromWishlist() {

    util.removeItemFromList(this.props.query.psid, this.props.query.botid, this.state.product.xc_sku, this.state.product.client_name, 'Wishlist')
    .then( noop => {
      let product = this.state.product
      product.inWishlist = false
      this.setState({
        product : product,
        selectedSize : ''
      }, () => {
        this.clearSize()
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

  moveItemToWishlist() {

    util.moveToList(this.props.query.psid, this.props.query.botid, this.state.product.client_name, this.state.product.colorsavailable, this.state.selectedSize, this.state.product.xc_sku, 'Wishlist')
    .then( noop => {
      let product = this.state.product
      product.inWishlist = true
      product.inCart = false
      this.setState({
        product : product
      }, ()=> {
        this.viewImmediateWishList()
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

  viewImmediateWishList() {
    if(this.state.selectedSize && this.state.product.sizeText) {
      this.props.history.push({
        pathname : '/addedToItem',
        search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.product.xc_sku}`,
        state : { size : this.state.selectedSize, mode : 'Wishlist', product : this.state.product}
      })
    } else {
      this.props.history.push({
        pathname : '/addedToItem',
        search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.product.xc_sku}`,
        state : {size : '', mode : 'Wishlist', product : this.state.product}
      })
    }
  }

  addItemToCart() {

    util.addItemToCart(this.props.query.psid, this.props.query.botid, this.state.product.client_name, this.state.product.colorsavailable, this.state.selectedSize, this.state.product.xc_sku)
    .then( noop => {
      let product = this.state.product
      product.inCart = true
      this.setState({
        product : product
      },() => { 
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

  removeItemFromCart() {

    util.removeItemFromList(this.props.query.psid, this.props.query.botid, this.state.product.xc_sku, this.state.product.client_name, 'Cart')
    .then( noop => {
      let product = this.state.product
      product.inCart = false
      this.setState({
        product : product,
        selectedSize : ''
      }, () => {
        this.clearSize()
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

  moveItemToCart() {

    util.moveToList(this.props.query.psid, this.props.query.botid, this.state.product.client_name, this.state.product.colorsavailable, this.state.selectedSize, this.state.product.xc_sku, 'Cart')
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

  viewImmediateCart() {
    if(this.state.selectedSize && this.state.product.sizeText){
      this.props.history.push({
      pathname : '/addedToItem',
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.product.xc_sku}`,
      state :  {size : this.state.selectedSize, mode : 'Cart', product : this.state.product}
    })
    } else {
      this.props.history.push({
      pathname : '/addedToItem',
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.product.xc_sku}`,
      state :  {size : '', mode : 'Cart', product : this.state.product}
    })
    }
  }

  getSize(sizeItem) {
    let product = _.cloneDeep(this.state.product)
    product.size = _.map(product.size, size => {
      if (size.size === sizeItem.size) {
        size.selected = true
        return size
      } else {
        size.selected = false
        return size
      }
    })
    this.setState({
      selectedSize: sizeItem.size,
      product : product
    }, () => {
      console.log('Selected Size :', this.state.selectedSize)
    })
  }

  clearSize() {
    let product = _.cloneDeep(this.state.product)
    product.size = _.map(product.size, size => {
      size.selected = false
      return size
    })
    this.setState({
      product : product
    }, () => {
      console.log(this.state.product)
    })
  }

  render() {
    let page = <div>
        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            {this.state.mode && <TopHeader headerText={`Add To ${this.state.mode}`}/>}
          </div>
        </div>
        { this.state.productarr && this.state.productarr.length > 0 && <div>
        <div className='row' style={{ marginTop: '25px' }}>
          <div className='col-xs-6'>
            <div id='productCarousel' className='carousel slide' data-interval='false'>
              <div className='carousel-inner'>
                { this.state.productarr.map( (productItem, index) =>
                    <div className='item' key={index}>
                      <div className='col-xs-12' key={productItem.image}>
                      {
                        <img key={productItem.xc_sku} src={productItem.image} className='img-responsive float-left rounded'/>
                      }
                    </div>
                  </div>
                  )
                }
              </div>
              {this.state.productarr.length > 1 && <a className="left carousel-control" data-slide="prev" style={{background:'none'}} onClick={e => this.switchProduct('prev')}>
                <span className="glyphicon glyphicon-chevron-left" style={{color:'#000'}}></span>
                <span className="sr-only">Previous</span>
              </a>}
              {this.state.productarr.length > 1 && <a className="right carousel-control" data-slide="next" style={{background:'none'}} onClick = {e => this.switchProduct('next')}>
                <span className="glyphicon glyphicon-chevron-right" style={{color:'#000'}}></span>
                <span className="sr-only">Next</span>
              </a>}
            </div>
          </div>
          <div className='col-xs-6'>
              <h3 className='text-left'>{ _.startCase( _.toLower( this.state.productarr[0].brand ) ) }
                <br/><small style={{marginTop: '5px'}}>{ _.startCase( _.toLower( this.state.productarr[0].productname ) ) }</small>
              </h3>
              <div className='text-left' style={{marginTop: '30px'}}>
                <p className='small'><b>Price ${ this.state.productarr[0].price }</b></p>
              </div>
          </div>
        </div>

        <div className='row pull-right' style={{marginTop: '10px'}}> 
          <div className='col-xs-6 text-right'>
            <div className="fb-share-button" data-href={this.state.productarr[this.iterator].product_url} data-layout="button_count" data-size="large" data-mobile-iframe="true"></div>
          </div>
        </div>

        { this.state.productarr[this.iterator].colorsText &&
        <div className='row' style={{marginTop: '25px'}}>
          <div className='col-xs-12 text-center'>
            <b>Colors:</b> <br/>{ _.upperFirst( this.state.productarr[this.iterator].colorsText ) }
          </div>
        </div>
        }

        { this.state.productarr[this.iterator].size &&
        <div className='row' style={{marginTop: '15px'}}>
          <div className='col-xs-12 text-center'>
            <b>Sizes:</b> <br/>{ 
                this.state.productarr[this.iterator].size.map( sizeItem =>
                <RepeatButton
                  key={sizeItem.size}
                  item={sizeItem}
                  getSize={e => this.getSize(e)}
                />
              )}
          </div>
        </div>
        }

        <div className='row' style={{marginTop: '50px', marginBottom: '5px'}}>
          <div className='col-xs-6'>
            { !this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inCart && ! this.state.productarr[this.iterator].inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.functionSelector('addItemToCart', this.iterator)}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.selectedSize && this.state.productarr[this.iterator].sizeText && this.state.productarr[this.iterator].inCart && ! this.state.productarr[this.iterator].inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.functionSelector('removeItemFromCart',this.iterator)}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inCart && this.state.productarr[this.iterator].inWishlist &&<button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.functionSelector('moveItemToCart', this.iterator)}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inCart && ! this.state.productarr[this.iterator].inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector(' addItemToCart' ,this.iterator)}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.selectedSize && this.state.productarr[this.iterator].sizeText && this.state.productarr[this.iterator].inCart && ! this.state.productarr[this.iterator].inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('removeItemFromCart' ,this.iterator)}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inCart && this.state.productarr[this.iterator].inWishlist &&<button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('moveItemToCart',this.iterator)}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inCart && ! this.state.productarr[this.iterator].inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('addItemToCart',this.iterator)}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.productarr[this.iterator].sizeText && this.state.productarr[this.iterator].inCart && ! this.state.productarr[this.iterator].inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('removeItemFromCart',this.iterator)}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inCart && this.state.productarr[this.iterator].inWishlist &&<button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('moveItemToCart',this.iterator)}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
          </div>
          <div className='col-xs-6'>
            {!this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inWishlist && ! this.state.productarr[this.iterator].inCart && <button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.functionSelector('saveToWishlist' ,this.iterator)}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            {!this.state.selectedSize && this.state.productarr[this.iterator].sizeText && this.state.productarr[this.iterator].inWishlist && ! this.state.productarr[this.iterator].inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.functionSelector('removeFromWishlist', this.iterator)}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            {!this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inWishlist &&  this.state.productarr[this.iterator].inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.functionSelector('moveItemToWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
            {this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inWishlist && ! this.state.productarr[this.iterator].inCart && <button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('saveToWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            {this.state.selectedSize && this.state.productarr[this.iterator].sizeText && this.state.productarr[this.iterator].inWishlist && ! this.state.productarr[this.iterator].inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('removeFromWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            {this.state.selectedSize && this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inWishlist &&  this.state.productarr[this.iterator].inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('moveItemToWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
            {!this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inWishlist && ! this.state.productarr[this.iterator].inCart && <button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('saveToWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            {!this.state.productarr[this.iterator].sizeText && this.state.productarr[this.iterator].inWishlist && ! this.state.productarr[this.iterator].inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('removeFromWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            {!this.state.productarr[this.iterator].sizeText && ! this.state.productarr[this.iterator].inWishlist &&  this.state.productarr[this.iterator].inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.functionSelector('moveItemToWishlist',this.iterator)}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
          </div>
        </div>
      </div>
    }

    {!this.state.productarr.length > 0 && this.state.product && 
          <div>
          <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-6'>
            <img src={this.state.product.image} className='img-responsive float-left rounded'/>
          </div>
          <div className='col-xs-6' style={{marginTop: '20px'}}>
            <h3 className='text-left'>{ _.startCase( _.toLower( this.state.product.brand ) ) }
              <br/><small style={{marginTop: '5px'}}>{ _.startCase( _.toLower( this.state.product.productname ) ) }</small>
            </h3>
            <div className='text-left' style={{marginTop: '30px'}}>
              <p className='small'><b>Price ${ this.state.product.price }</b></p>
            </div>
          </div>
        </div>

        <div className='row pull-right' style={{marginTop: '10px'}}> 
          <div className='col-xs-6 text-right'>
            <div className="fb-share-button" data-href={this.state.product.product_url} data-layout="button_count" data-size="large" data-mobile-iframe="true"></div>
          </div>
        </div>

        { this.state.product.colorsText &&
        <div className='row' style={{marginTop: '15px'}}>
          <div className='col-xs-12 text-center'>
            <b>Colors:</b> <br/>{ _.upperFirst( this.state.product.colorsText ) }
          </div>
        </div>
        }

        { this.state.product.size &&
        <div className='row' style={{marginTop: '15px'}}>
          <div className='col-xs-12 text-center'>
            <b>Sizes:</b> <br/>{ 
                this.state.product.size.map( sizeItem =>
                <RepeatButton
                  key={sizeItem.size}
                  item={sizeItem}
                  getSize={e => this.getSize(e)}
                />
              )}
          </div>
        </div>
        }
        <div className='row' style={{marginTop: '50px', marginBottom: '5px'}}>
          <div className='col-xs-6'>
            { !this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.addItemToCart()}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.selectedSize && this.state.product.sizeText && this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.removeItemFromCart()}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inCart && this.state.product.inWishlist &&<button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.moveItemToCart()}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.addItemToCart()}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.selectedSize && this.state.product.sizeText && this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.removeItemFromCart()}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inCart && this.state.product.inWishlist &&<button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.moveItemToCart()}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.product.sizeText && ! this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.addItemToCart()}>Add To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.product.sizeText && this.state.product.inCart && ! this.state.product.inWishlist && <button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.removeItemFromCart()}>Remove From Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
            { !this.state.product.sizeText && ! this.state.product.inCart && this.state.product.inWishlist &&<button type='button' className='btn btn-default btn-block ' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.moveItemToCart()}>Move To Cart&nbsp;<span className='glyphicon glyphicon-shopping-cart'></span></button> }
          </div>
          <div className='col-xs-6'>
            {!this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.saveToWishlist()}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            {!this.state.selectedSize && this.state.product.sizeText && this.state.product.inWishlist && ! this.state.product.inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.removeFromWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            {!this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inWishlist &&  this.state.product.inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} disabled onClick={e=>this.moveItemToWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
            {this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.saveToWishlist()}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            {this.state.selectedSize && this.state.product.sizeText && this.state.product.inWishlist && ! this.state.product.inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.removeFromWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            {this.state.selectedSize && this.state.product.sizeText && ! this.state.product.inWishlist &&  this.state.product.inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.moveItemToWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
            {!this.state.product.sizeText && ! this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.saveToWishlist()}>
              <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
            {!this.state.product.sizeText && this.state.product.inWishlist && ! this.state.product.inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.removeFromWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
            {!this.state.product.sizeText && ! this.state.product.inWishlist &&  this.state.product.inCart &&<button type='button' className='btn btn-warning  btn-block' style={{borderRadius: '0px', whiteSpace: 'normal'}} onClick={e=>this.moveItemToWishlist()}>
              <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
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
      <div>
      {page}
      </div>
    )

  }

}

module.exports = AddToItemComponent