import React from 'react'
import request from 'superagent'
import _ from 'lodash'

export var getDocumentSummary = (psid, botid, doc_name) => {
  return new Promise((resolve, reject) => {
    request.post( '/api/getDocumentSummary' )
      .send( {
          psid   : psid,
          botid  : botid,
          doc_name : doc_name
      })
      .then( res => JSON.parse( res.text ) )
      .then( summary => {

          console.log( 'getDocumentSummary utility response is  -> ', summary )
          resolve(summary)
      })
      .catch( err => {
        console.log("some error happened in Document Summary " ,err )
        reject(err)
      })
  })
}

