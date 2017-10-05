import React from 'react'
// var Loader = require('halogenium/DotLoader')
var classNames = require('classnames');

class SquareButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var btnClasses = classNames(
      'btn-sl', 'btn-block', 'btn', 'btn-block', 'active',
      {
        'btn-warning': this.props.selected,
      }
    )
    return (
    <button type='button' className={btnClasses} onClick={this.props.clickHandler} style={{ fontSize: '14px' }} >
    {this.props.buttonValue }
    </button> );
  }
}
module.exports = SquareButton
