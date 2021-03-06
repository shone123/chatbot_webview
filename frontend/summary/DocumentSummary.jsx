import React from 'react'
import request from 'superagent'
import _ from 'lodash'
import TopHeader from '../misc/TopHeader'
var classNames = require('classnames')
import Spinner from '../misc/SpinnerComponent'
import ErrorComponent from '../misc/ErrorComponent'
import RepeatButton from '../misc/RepeatButton'
import {getDocumentSummary} from '../utility.js'

class DocumentSummary extends React.Component {

  constructor( props ) {
    super( props )
    console.log("DocumentSummary props is", props )

    this.state = {

        doc_name : this.props.query.doc_name,
        query  : this.props.query.query,
        user  : this.props.query.user,
        showSpinner : true,
        product: {
          image: '/images/not_available.jpg'
        },
    }
  }

  componentDidMount() {

    getDocumentSummary(this.props.query.psid, this.props.query.botid, this.state.doc_name, this.state.query, this.state.user)
    .then((result) => {

        let summary = {}
        let tips = []
        let concepts = []
        let hit = {}

        concepts = result.concepts
        tips = result.tips 
        hit = result.hit

        let hits = []
        let val
        if(hit) {
          let key
          console.log("hit is ", hit)
          console.log("type of hit is ",typeof(hit))
          for(key in hit) {
            val = key 
            hits.push(val)
          }
        }

        summary.concepts = concepts
        summary.tips = tips
        summary.hits = hits

        console.log(' Document summary is ',summary)

        return summary

    }).then((summary) =>{
            console.log('Final Document summary is ',summary)
      if (!_.isUndefined(summary)) {
        this.setState({
            summary : summary,
            showSpinner: false
        })
      }
    })
    .catch( err => {
      console.log( err )
      if ( err && err.status ) {
        this.setState( { showSpinner : false, errorText: err.response.text } )
      } else {
        this.setState( { showSpinner : false, errorText: 'Server Error' } )
      }
    })

  }



  // { this.state.errorText && <ErrorComponent errorText={this.state.errorText} /> }
  render() {

    var profileBtnClass = classNames({
      'col-xs-12' : this.props.device === 'MOBILE',
      'col-xs-12' : this.props.device !== 'MOBILE'
    })

    let page = <div>

      <div className='row' style={{ marginTop: '15px' }}>
        <div className='col-xs-12'>
          <TopHeader headerText="Document Summary"/>
        </div>
      </div>

        <div className='row' style={{marginTop: '15px'}}>
          <div className='col-xs-12 text-center'>
            <b>{this.state.doc_name}</b>
          </div>
        </div>


        {this.state.summary && this.state.summary.hits &&
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>"Query Based Summary"</div>
        </div>
        }

        { this.state.summary && this.state.summary.hits && this.state.summary.hits.map( (val, index) =>
            <div className='col-xs-12 wrapper' key = {index} style={{marginTop:'5px'}}> 
              <ul class="list-group">
                <li class="list-group-item list-group-item-action flex-column align-items-start">
                  <p class="mb-1">{val}</p>
                </li>
              </ul>
            </div>
        )}


        {this.state.summary && this.state.summary.tips &&
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>"General Summary"</div>
        </div>
        }

        { this.state.summary && this.state.summary.tips && this.state.summary.tips.map( (val, index) =>
            <div className='col-xs-12 wrapper' key = {index} style={{marginTop:'5px'}}> 
              <ul class="list-group">
                <li class="list-group-item list-group-item-action flex-column align-items-start">
                  <p class="mb-1">{val}</p>
                </li>
              </ul>
            </div>
        )}

        {this.state.summary && this.state.summary.concepts &&
            <div className='row' style={{marginTop: '10px'}}>
              <div className='col-xs-12'>
              <b>Key Concepts:</b> 
              </div>
            </div>
         }

        { this.state.summary && this.state.summary.concepts && this.state.summary.concepts.map( (val, index) =>
          <div className='col-xs-12 wrapper' key = {index} style={{marginTop:'5px'}}> 
            <ul class="list-group">
              <li class="list-group-item list-group-item-action">
                <p class="mb-1">{val}</p>
              </li>
            </ul>
      </div>
      )}

      </div>

      if( this.state.showSpinner ) {
        page = <div>
          { this.state.showSpinner && <Spinner /> }
        </div>
      }


    return (
      <div>
      {page}
      </div>
    )

  }

}



module.exports = DocumentSummary
