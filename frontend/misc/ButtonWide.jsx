import React from 'react'
var classNames = require('classnames')

class ButtonWide extends React.Component {
  
  constructor( props ) {
    super( props )
  }

  render() {
      var btnClasses = classNames(
        'btn-lg', 'btn-block',
        {
          'btn-warning': this.props.selected,
        }
      );
      // let image = null
      // if ( this.props.image ) {
      //   image = <img src={ `${this.props.image}` } />        
      // }
      let returnButton = (typeof this.props.enabled === 'undefined')?<button type='button' className={btnClasses} onClick={this.props.clickHandler} style={{ fontSize: '14px', whiteSpace : 'normal'}} >
      {this.props.buttonText}
      </button> : (this.props.enabled) ? <button type='button' className={btnClasses} onClick={this.props.clickHandler} style={{ fontSize: '14px', whiteSpace : 'normal' }} >
      {this.props.buttonText}
      </button> : <button type='button' className={btnClasses} disabled onClick={this.props.clickHandler} style={{ fontSize: '14px', whiteSpace : 'normal' }} >
      {this.props.buttonText}
      </button>
      return ( 
        returnButton
       )
  }
}

module.exports = ButtonWide
