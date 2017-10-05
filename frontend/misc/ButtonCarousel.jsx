import React from 'react'
import _ from 'lodash'

class ButtonCarousel extends React.Component {
  constructor( props ) {
    super( props )
  }

  render() {
    return (
        <button
          className={ 'btn ' + (this.props.attr.selected ? 'btn-warning' : 'btn-default') } 
          onClick={ e => this.props.toggleSelected(this.props.attr, this.props.ques.entity, this.props.attributeIterator) }
          style={{margin: '5px'}} >
          <img 
          src={'https://s3.amazonaws.com/xpressobrand/images/' + encodeURIComponent(this.props.attr.text)}
          onError={this.props.onError.bind(this)}
          className='img-rounded'
          style={{height: '50px', width: '80px'}}
          />
        </button>
    )
  }
}

module.exports = ButtonCarousel