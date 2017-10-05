import React from 'react'
var Loader = require('halogen/DotLoader')

class Spinner extends React.Component {
  render() {
      return ( 
        <div>
          <div style={{position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <Loader color="orange" size="50px" margin="4px"/>

          </div>
        </div>
      )
  }
}

module.exports = Spinner
