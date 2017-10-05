import React from 'react'
var Loader = require('halogen/MoonLoader')

class LoadingIdentifier extends React.Component {
  render() {
    return (
      <div style={{position: 'fixed', left: '50%', top: '84%', transform: 'translate(-50%, -50%)' }}>
          <Loader color="orange"/>
      </div>
    )
  }
}

module.exports = LoadingIdentifier