import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
var classNames = require('classnames')
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import {getProductDetails} from '../utility.js'

class ExpandedMenu extends React.Component {

    constructor( props ) {
        super( props )
        this.state = {
            xc_sku : this.props.query.xc_sku,
            product :  null,
            showSpinner :  true,
            group_sku: '',
            query_type : this.props.query.query_type,
            intent : {
                entity : (typeof this.props.query.entity !== 'undefined')?this.props.query.entity:'NA',
                price : (typeof this.props.query.price !== 'undefined')?this.props.query.price:'NA',
                size : (typeof this.props.query.size !== 'undefined')?this.props.query.size:'NA',
                xc_category : (typeof this.props.query.xc_category !== 'undefined')?this.props.query.xc_category:'NA',
                features : (typeof this.props.query.features !== 'undefined')?this.props.query.features:'NA',
                brand : (typeof this.props.query.brand !== 'undefined')?this.props.query.brand:'NA',
                details : (typeof this.props.query.details !== 'undefined')?this.props.query.details:'NA',
                colorsavailable : (typeof this.props.query.colorsavailable !== 'undefined')?this.props.query.colorsavailable:'NA',
                gender : (typeof this.props.query.gender !== 'undefined')?this.props.query.gender:'NA'
            },
            uploaded_img : this.props.query.img_url
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

    componentWillUnmount() {
    }

    saveToWishlist() {
        this.props.history.push({
            pathname : '/addToItem',
            search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
            state : { group_sku : this.state.group_sku?this.state.group_sku:'', mode : 'Wishlist' , product : this.state.product}
        })
    }

    gotoNotRight() {
        let query_type = this.state.query_type
        if (query_type && query_type !== 'VISION') {
            this.props.history.push({
                pathname : '/notRight',
                search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
                state : { query_type : query_type , intent : this.state.intent, product : this.state.product}
            })
        } else if (query_type) {
            this.props.history.push({
                pathname : '/notRightVision',
                search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}&xc_sku=${this.state.xc_sku}`,
                state : {query_type : query_type, img_url : this.props.query.img_url
                    , upload_id : this.props.query.upload_id, product : this.state.product}
            })
        }
    }

    checkforWishlist() {
        if( !_.isUndefined(this.state.product.group_sku) ) {
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
            state : {group_sku : this.state.group_sku?this.state.group_sku:'', mode : 'Cart', product : this.state.product}
        })
    }

    gotoViewCart() {
        this.props.history.push({
            pathname : `/viewItems/Cart`,
            search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`
        })
    }

    gotoViewWishlist() {
        this.props.history.push({
            pathname : `/viewItems/Wishlist`,
            search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}` 
        })
    }

    // { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }// { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }// { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }
    render() {

        // var profileBtnClass = classNames({
        //     'col-xs-6' : this.props.device === 'MOBILE',
        //     'col-xs-12' : this.props.device !== 'MOBILE'
        // })


        let page = null
        if( ! this.state.showSpinner ) {
            page =  <div>
            <div className='row' style={{ marginTop: '15px' }}>
                <div className='col-xs-12'>
                    <TopHeader headerText="Expanded Menu"/>
                </div>
            </div>

            <div className='row' style={{marginTop: '20px', marginBottom: '20px'}}>
                <div className='col-xs-12'>
                    { this.state.product && ! this.state.product.inCart && !this.state.product.inWishlist && <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.addItemToCart()}>
                        <span className="glyphicon glyphicon-ok" aria-hidden="true"></span> Add To Cart</button> }
                    { this.state.product && this.state.product.inCart && !this.state.product.inWishlist && <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.addItemToCart()}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Remove From Cart</button> }
                    { this.state.product && ! this.state.product.inCart && this.state.product.inWishlist && <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.addItemToCart()}>
                        <span className="glyphicon glyphicon-remove" aria-hidden="true"></span> Move To Cart</button> }
                </div>
            </div>

            <div className='row' style={{marginTop: '20px', marginBottom: '20px'}}>
                <div className='col-xs-12'>
                    <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.gotoViewCart()}>
                        <span className="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> View Cart</button>
                </div>
            </div>

            <div className='row' style={{marginTop: '20px', marginBottom: '20px'}}>
                <div className='col-xs-12'>
                    <button type='button' className='btn btn-warning btn-block btn-lg' onClick={e=>this.gotoNotRight()}>
                    <span className='glyphicon glyphicon-thumbs-down'></span>&nbsp;Not Right</button>
                </div>
            </div>

            <div className='row' style={{marginTop: '20px', marginBottom: '20px'}}>
                <div className='col-xs-12'>
                    { this.state.product && ! this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-warning btn-lg btn-block' onClick={e=>this.saveToWishlist()}>
                        <span className="glyphicon glyphicon-heart-empty" aria-hidden="true"></span> Save To Wishlist</button> }
                    { this.state.product && this.state.product.inWishlist && ! this.state.product.inCart && <button type='button' className='btn btn-warning btn-lg btn-block' onClick={e=>this.saveToWishlist()}>
                        <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Remove From Wishlist</button> }
                    { this.state.product && ! this.state.product.inWishlist && this.state.product.inCart && <button type='button' className='btn btn-warning btn-lg btn-block' onClick={e=>this.saveToWishlist()}>
                        <span className="glyphicon glyphicon-heart" aria-hidden="true"></span> Move To Wishlist</button> }
                </div>
            </div>

            <div className='row' style={{ marginTop : '20px', marginBottom : '20px'}}>
                <div className='col-xs-12'>
                    <button type='button' className='btn btn-warning btn-lg btn-block' onClick={e=>this.gotoViewWishlist()}> View Wishlist </button>
                </div>
            </div>

            <div className='row' style={{marginTop: '20px', marginBottom: '20px'}}>
                <div className='col-xs-12 text-center'>
                <div className="fb-share-button" data-href={this.state.product.product_url} data-layout="button_count" data-size="large" data-mobile-iframe="true"></div>
                </div>
            </div>
        </div>
        }

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



module.exports = ExpandedMenu
