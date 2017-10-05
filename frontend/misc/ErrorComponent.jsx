import React from 'react'

class ErrorComponent extends React.Component {
  constructor( props ) {
    super( props )
    this.state = { errorText : this.props.errorText }
  }
  render() {
    return ( 
      <div style={{position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        {this.state.errorText}
      </div> 
    )
  }
}

module.exports = ErrorComponent
