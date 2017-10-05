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
        showSpinner : true,
        product: {
          image: '/images/not_available.jpg'
        },
    }
  }

  componentDidMount() {

    getDocumentSummary(this.props.query.psid, this.props.query.botid, this.state.doc_name)
    .then((result) => {

        let summary = result
        let tips = ""
        let concepts = ""

        for(let i=0;i<result.tips.length;i++ ){
            tips = "\n" + tips + result.tips[i] + "\n"
        }

        for(let i=0;i<result.tips.concepts;i++ ){
            concepts = "  " + tips + result.concepts[i] + "  "
        }

        summary.tips = tips
        summary.concepts = concepts

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

        {this.state.summary && this.state.summary.tips &&
        <div className='row' style={{marginTop: '10px'}}>
          <div className='col-xs-12 text-center'>
              {_.upperFirst(this.state.summary.tips) }
          </div>
        </div>
        }

          {this.state.summary && this.state.summary.concepts &&
            <div className='row' style={{marginTop: '10px'}}>
              <div className='col-xs-12 text-center'>
              <b>Key Concepts:</b> { _.upperFirst( this.state.summary.concepts ) }
              </div>
            </div>
         }


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
