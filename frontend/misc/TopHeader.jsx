import React from 'react'
// var Loader = require('halogenium/DotLoader')

class TopHeader extends React.Component {
  render() {
      return ( <div className='text-center' style={{fontSize:'110%'}}><b>{this.props.headerText}</b></div> )
  }
}

module.exports = TopHeader
