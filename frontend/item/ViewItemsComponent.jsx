import React from 'react'
import _ from 'lodash'
import request from 'superagent'
import TopHeader from '../misc/TopHeader'
import ButtonWide from '../misc/ButtonWide'
var classNames = require('classnames')
import { Link } from 'react-router-dom'
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'

class ViewItemsComponent extends React.Component {
  constructor( props ) {
    super( props )

    this.state ={
      showSpinner : true,
      items : null,
      errorText : null,
      mode : (!_.isUndefined(this.props.match.params.mode))?this.props.match.params.mode : ''
    }
  }

  componentDidMount() {

    request.post( `/api/getUsersAll${this.state.mode}s`)
    .send({
      psid : this.props.query.psid, 
      botid : this.props.query.botid
    })
    .then( res => {
      console.log( `All ${this.state.mode}s` )
      let items = JSON.parse( res.text )
      let errorText = null
      if( items.length === 0 ) {
        errorText = `There are no items in your ${this.state.mode}!`
      }
      this.setState ({
        items : items,
        showSpinner : false,
        errorText : errorText
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
      state : { mode : this.state.mode }
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
    var profileBtnClass = classNames({
      'col-xs-6'  : this.props.device === 'MOBILE',
      'col-xs-12' : this.props.device !== 'MOBILE'
    })

    return (
      <div>

        <div className='row' style={{ marginTop: '15px' }}>
          <div className='col-xs-12'>
            <TopHeader headerText={this.state.mode === 'Cart'?"Shopping Cart":this.state.mode}/>
          </div>
        </div>

        <div className='list-group' style={{marginTop: '30px'}}>
        { this.state.items && this.state.items.length > 0 && this.state.items.map( item => 
            <Link
              to={ {pathname : `/viewItem`,
                query : `?psid=${this.props.query.psid}&botid=${this.props.query.botid}`,
                state : {mode : this.state.mode, catalog : item.catalog} } }
              key={item.catalog}
              className="list-group-item"
            >
            <b> {_.upperFirst(item.catalog)}</b><span className='pull-right'>{item.itemCount} {item.itemCount === 1 ? 'item' : 'items' } <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></span>
            </Link>
          )}
        </div>

        { this.state.showSpinner && <Spinner /> }
        { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }

        <div style={{ position: 'fixed', bottom: '15px', width: '100%', marginLeft: '-15px' }} >
          <div className='row center-block'>
            <div className={profileBtnClass}>
              <ButtonWide buttonText={`Clear All ${this.state.mode}s`} selected={false} clickHandler={ e => this.gotoClearItems(e) }/>
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

module.exports = ViewItemsComponent