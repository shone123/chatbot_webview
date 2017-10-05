import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
import { Link } from 'react-router-dom'
var classNames = require('classnames')
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import {removeItemFromList, moveToList} from '../utility.js'
import ItemComponent from './ItemComponent'

class ViewItemComponent extends React.Component {
  constructor( props ) {
    super( props )

    this.state = {
      catalog : (!_.isUndefined(this.props.location.state.catalog))?this.props.location.state.catalog : '',
      items : null,
      showSpinner : true,
      mode : (!_.isUndefined(this.props.location.state.mode))?this.props.location.state.mode : ''
    }
  }

  componentDidMount() {

    request.post( `/api/getUsers${this.state.mode}ByCatalog`)
    .send ({
      psid : this.props.query.psid,
      botid : this.props.query.botid,
      catalog : this.state.catalog
    })
    .then( res => {
      let items = JSON.parse( res.text )
      this.setState ({
        items : items,
        showSpinner : false
      })
    })
    .then ( noop => {
      console.log( 'items' ,this.state.items)
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

  removeFromList (item) {
    removeItemFromList (this.props.query.psid, this.props.query.botid, item.item.xc_sku, this.state.catalog, this.state.mode)
    .then (res => {
      let listItems = _.cloneDeep(this.state.items)
      console.log(listItems)
      listItems.items = _.filter( listItems.items, listItem => {
        return listItem.item.xc_sku !== item.item.xc_sku
      })
      this.setState({
        items : listItems
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

  moveItemToList (item) {
    let mode = (this.state.mode === 'Cart')?'Wishlist':'Cart'
    moveToList(this.props.query.psid, this.props.query.botid, this.state.catalog, item.color, item.size, item.item.xc_sku, mode)
    .then( res => {
      console.log(`Moved Item to ${this.state.mode}`)
      let listItems = _.cloneDeep(this.state.items)
      listItems.items = _.filter (listItems.items, listItem => {
        return listItem.item.xc_sku !== item.item.xc_sku
      })
      this.setState({
        items : listItems
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

  gotoClearItems() {
    this.props.history.push({
      pathname : `/itemsClear`,
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
      state : { mode : this.state.mode, catalog : this.state.catalog }
    })
  }

  gotoCheckout() {
    this.props.history.push( `/checkout/${this.state.catalog}?psid=${this.props.query.psid}&botid=${this.props.query.botid}` )    
  }

  gotoViewItems() {
    this.props.history.push({
      pathname : `/viewItems/${this.state.mode}`,
      search : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`
    })
  }

  render() {
    var profileBtnClass = classNames({
      'col-xs-6'  : this.props.device === 'MOBILE',
      'col-xs-12' : this.props.device !== 'MOBILE'
    })

    return (
      <div>

        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText={ _.upperFirst(this.state.catalog) + ' ' + this.state.mode}/>
          </div>
        </div>

        <div className='row' style={{marginTop : '10px'}}>
          <div className='col-xs-12'>
            <button className='btn btn-sm btn-default' onClick={ e => this.gotoViewItems() }><span className='glyphicon glyphicon-chevron-left'></span>&nbsp;All&nbsp;<span className={this.state.mode === 'Cart'?'glyphicon glyphicon-shopping-cart':'glyphicon glyphicon-heart'}></span>&nbsp;{this.state.mode}s</button>
          </div>
        </div>

        <div style={{marginBottom: '100px'}}>
          { this.state.items && this.state.items.items.length > 0 &&this.state.items.items.map ( (item, index) => 
              <ItemComponent
                key={item.item.xc_sku + index}
                item={item}
                removeFromList={ e => this.removeFromList(e) }
                moveItemToList={ e => this.moveItemToList(e) }
                mode={ this.state.mode }
              />
            )
          }
          { this.state.items && this.state.items.items.length === 0 &&
            <div style={{position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>There are no items in your {this.state.mode}!</div>
          }
        </div>

        { this.state.showSpinner && <Spinner /> }

        <div style={{ position: 'fixed', bottom: '0', width: '100%', marginLeft: '-15px', padding: '15px 0', background: 'white' }} >
          <div className='row center-block'>
            <div className='col-xs-6'>
              <ButtonWide buttonText={`Clear ${this.state.mode}`} selected={false} clickHandler={ e => this.gotoClearItems() }/>
            </div>
            { this.state.mode === 'Cart' && <div className='col-xs-6'>
              <ButtonWide buttonText="Checkout" selected={true} clickHandler={ e => this.gotoCheckout(e) } />
             </div>
            }
          </div>
        </div>

      </div>
    )
  }
}

module.exports = ViewItemComponent