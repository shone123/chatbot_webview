import React from 'react'
var classNames = require('classnames')

class RepeatCarousel extends React.Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
      <div className='item'>
        <div className='col-xs-4'>
          <a href={'/product?psid='+this.props.psid+'&botid='+this.props.botid+'&xc_sku='+this.props.product.xc_sku}><img src={this.props.product.image} className='img-responsive img-thumbnail'/></a>
        </div>
      </div>
    )
  }
}

module.exports = RepeatCarousel