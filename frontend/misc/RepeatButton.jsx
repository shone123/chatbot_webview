import React from 'react'
import _ from 'lodash'

class RepeatButton extends React.Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
      <button onClick={e=>this.props.getSize(this.props.item)} className={this.props.item.selected ? 'btn btn-warning btn-sm' : 'btn btn-default btn-sm' }>{ _.upperFirst( this.props.item.size ) }</button>
    )
  }
}

module.exports = RepeatButton