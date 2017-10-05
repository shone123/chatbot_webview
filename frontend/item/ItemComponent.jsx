import React from 'react'
import _ from 'lodash'

class ItemComponent extends React.Component {

  constructor( props ) {
    super ( props )
  }

  render() {

    return (
      <div style={{ marginTop : '20px' }}>
        
        <div className='row'>
          <div className='col-xs-3'>
            <img src={this.props.item.item.image} className='img-responsive img-thumbnail center-block' />
          </div>
          
          <div className='col-xs-9'>
            <div className='row'>
              <div className='col-xs-12'>
                <b>{ _.upperFirst( this.props.item.item.brand ) }</b> { _.upperFirst( this.props.item.item.productname ) }
              </div>
            </div>

            <div className='row' style={{ marginTop : '5px'}}>
              <div className='col-xs-4'>
                Size: <b>{_.upperFirst(this.props.item.size)}</b>
              </div>
              <div className='col-xs-4'>
                Color: <b>{this.props.item.color}</b>
              </div>
              <div className='col-xs-4'>
                Price: <b>$ {this.props.item.item.price}</b>
              </div>
            </div>

            <div className='row' style={{marginTop : '5px'}}>
              <div className='col-xs-6'>
                <button className='btn btn-default btn-sm btn-block' style={{whiteSpace : 'normal'}} onClick={ e => this.props.removeFromList( this.props.item ) }>
                  <span className='glyphicon glyphicon-remove' aria-hidden='true'></span> From {this.props.mode}
                </button>
              </div>
              <div className='col-xs-6'>
                { this.props.mode === 'Cart' &&
                  <button className='btn btn-warning btn-sm btn-block' style={{whiteSpace : 'normal'}} onClick={ e => this.props.moveItemToList( this.props.item ) } >Move To Wishlist</button>
                }
                { this.props.mode === 'Wishlist' &&
                  <button className='btn btn-warning btn-sm btn-block' style={{whiteSpace : 'normal'}} onClick={ e => this.props.moveItemToList( this.props.item ) } >Move To Cart</button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

module.exports = ItemComponent