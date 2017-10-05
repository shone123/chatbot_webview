import React from 'react'
import _ from 'lodash'
import ButtonCarousel from './ButtonCarousel'
var classNames = require('classnames')

class AttributesComponent extends React.Component {
  
  constructor( props ) {
    super( props )
    // console.log( 'AttributesComponent', this.props )
    // let ques = this.props.ques
    // ques.attributes = ques.attributes.slice(0, 15)
    this.state = {
      titleState: true,
      minPrice: {
        display : false,
        value : 0
      },
      maxPrice: {
        display : false,
        value : 0
      },
      skipState : false,
      colorAttr : [],
      brandAttr : [],
      sizeAttr : []
    }
    this.attributeIterator = 0
    this.priceChanged = false
  }

  componentDidMount() {
    this.buildSlider()
  }

  toggleTitle(state) {
    this.setState({
      titleState: !state
    }, () => {
      if (this.state.titleState && this.priceChanged) {
      this.setState ({
        minPrice : {
          display : true,
          value : $( '#slider-range' ).slider( 'values', 0 )
        },
        maxPrice : {
          display : true,
          value : $( '#slider-range' ).slider( 'values', 1 )
        }
      }, () => {
        this.props.togglePrice()
      })
    }
    })
  }

  collapseTitle(index) {
    $('#categories'+index).collapse('hide')
    this.setState({
      titleState: true
    })
  }

  removeSelection(attr) {
    attr.selected = !attr.selected
  }

  onError(e) {
    e.target.src = '/images/not_available.jpg'
  }

  buildSlider() {
    let attributes = (this.props.ques.quesType === 'slider')?this.props.ques.attributes[0]:false
    var Min = 0, Max = 0, Minvalue = 0, Maxvalue = 0, step = 0.5, values = []
    if(attributes) {
      let userValues = _.compact(attributes.map( function(attr) {
        return (attr.key === 'userPref')?parseInt(attr.text):null
      }) )
      let defaultPrices = _.compact(attributes.map( function(attr) {
        return (attr.key === 'defaultPrices')?parseInt(attr.text):null
      }) )
      if ( !_.isEmpty(userValues) && !_.isEmpty(defaultPrices)) {
        Min = Math.min(...defaultPrices)
        Max = Math.max(...defaultPrices)
        // let calStep = Math.floor((Max - Min)/evaluate.length)
        Minvalue = Math.min(...userValues)
        Maxvalue = Math.max(...userValues)
      } else {
        values = attributes.map( attr => {
          return parseInt(attr.text)
        })
        Min = Math.min(...values)
        Max = Math.max(...values)
        Minvalue = Min
        Maxvalue = Max 
      }
      $('#slider-range').slider({
        range: true,
        min : Min,
        max : Max,
        step: step,
        values: [Minvalue, Maxvalue],
        animate: 'slow',
        slide : ( event, ui ) => {
          $( '#price' ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] )
          this.priceChanged = true
        }
      })
      $( '#price' ).val( '$' + $( '#slider-range' ).slider( 'values', 0 ) +
        ' - $' + $( '#slider-range' ).slider( 'values', 1 ) )
      if ( _.isEmpty(values) ) {
        $('#minValue').text('$ ' + $( '#slider-range' ).slider( 'values', 0 ) + ' - ')
        $('#maxValue').text('$ ' + $('#slider-range' ).slider( 'values', 1 ))
      }
    }
  }

  updateIterator(state) {
    let arr_length = this.props.ques.attributes.length
    if (state === 'prev') {
      if(this.attributeIterator <= 0) {
        this.attributeIterator = arr_length-1
      } else {
        this.attributeIterator -= 1
      }
    } else if (state === 'next') {
      if (this.attributeIterator >= arr_length-1) {
        this.attributeIterator = 0
      } else {
        this.attributeIterator += 1
      }
    }
    this.forceUpdate()
  }

  render() {

    let page = null
    if ( this.props.ques.attributes.length > 0 ) {
      page =<div style={{ marginTop: '10px' }}>
              <div className='row'>
                <div className='col-xs-12'>
                  <button className='btn btn-default btn-block' data-toggle='collapse' data-target={'#categories'+this.props.index} style={{background:'#fff'}} onClick={e=>this.toggleTitle(this.state.titleState)}>
                    <span className='pull-left'>{_.upperFirst( (this.props.ques.attributeName !== 'colorsavailable')?this.props.ques.attributeName:'color' )}&nbsp;</span>
                    <span className={this.props.ques.attributeName === 'size'?'glyphicon glyphicon-info-sign pull-left text-danger' : 'glyphicon glyphicon-info-sign pull-left' } 
                      style={{top : '5px' , paddingLeft : '5px'}} data-toggle='tooltip' data-placement='top' title={ this.props.ques.attributeName === 'size' ? 'Products shown will be of these sizes only!' : `Preferences will help stream-line results` }></span>
                    <span className={'glyphicon glyphicon-chevron-' + (this.state.titleState?'down':'right') + ' pull-right'}></span>
                    <br/> {this.state.titleState && this.props.ques.attributes && (this.props.ques.quesType === 'square' || this.props.ques.quesType === 'image') && _.flatten(this.props.ques.attributes).map( attr =>
                      <p className='small pull-left' key={attr.text}>
                        {attr.selected && <span>&nbsp;<span className='glyphicon glyphicon-remove' onClick={e=> this.removeSelection(attr)}></span></span>} <span>{(attr.selected)?' '+attr.text:''}</span>
                      </p>
                      ) }
                      {this.state.titleState && this.props.ques.attributes && this.props.ques.quesType === 'slider' &&
                      <p className='small pull-left'>
                        <b><span id='minValue'>{(this.state.minPrice.display)?`$ ${this.state.minPrice.value} - `:''}</span></b>
                        <b><span id='maxValue'>{(this.state.maxPrice.display)?`$ ${this.state.maxPrice.value}`:''}</span></b>
                      </p>
                      }
                  </button>
                </div>
              </div>
              <div className='text-center collapse' id={'categories' + this.props.index}>
                { this.props.ques && this.props.ques.quesType === 'square' &&
                  <div>
                    <span className="glyphicon glyphicon-chevron-left" style={{color:'#000', cursor : 'pointer'}} onClick={e => this.updateIterator('prev')}></span>
                    {this.props.ques.attributes && this.props.ques.attributes.length > 0 && 
                      this.props.ques.attributes[this.attributeIterator].map( attr => 
                      <button 
                        key={attr.text} 
                        className={ 'btn ' + (attr.selected ? 'btn-warning' : 'btn-default') } 
                        onClick={ e => this.props.toggleSelected(attr, this.props.ques.entity, this.attributeIterator) }
                        style={{margin: '5px'}}
                      >
                        {attr.text}
                      </button>
                    )}
                    <span className="glyphicon glyphicon-chevron-right" style={{color:'#000', cursor : 'pointer'}} onClick={e => this.updateIterator('next')}></span>
                  </div>
                }
                  { this.props.ques && this.props.ques.quesType === 'slider' && 
                    <div style={{marginTop: '15px'}}>
                      <input type="text" id="price" className='text-center' readOnly style={{border:'0', fontWeight:'bold'}}/>
                      <div id="slider-range" style={{marginTop: '20px'}}></div>
                    </div>
                  }
                {
                  this.props.ques && this.props.ques.quesType === 'image' && 
                  <div>
                    <span className="glyphicon glyphicon-chevron-left" style={{color:'#000', cursor : 'pointer'}} onClick={e => this.updateIterator('prev')}></span>
                    {this.props.ques.attributes && this.props.ques.attributes.length > 0
                      && this.props.ques.attributes[this.attributeIterator].map( attr =>
                      <ButtonCarousel
                      key={attr.text}
                      toggleSelected={ (attr, entity, iterator) => this.props.toggleSelected(attr, entity, iterator) }
                      attributeIterator={this.attributeIterator}
                      attr={attr}
                      ques={this.props.ques}
                      onError={ e => this.onError(e) }
                      ></ButtonCarousel>
                    )}
                    <span className="glyphicon glyphicon-chevron-right" style={{color:'#000', cursor : 'pointer'}} onClick={e => this.updateIterator('next')}></span>
                  </div>
                }


                <div className='clearfix center-block'></div>
                <div>
                  <button 
                    className={'btn ' + (this.props.ques.skip ? 'btn-warning' : 'btn-default')}
                    onClick={ e => {this.props.toggleSkip(this.props.ques.entity, this.attributeIterator); this.collapseTitle(this.props.index)}}
                    style={{marginTop:'15px'}} >
                      Skip
                  </button>
              </div>
            </div>
          </div>
    }

    return( 
      <div>{page}</div>
    )
  }
}

module.exports = AttributesComponent
