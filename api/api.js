const _       = require( 'lodash'     )
var nconf     = require( 'nconf'      )
const request = require( 'superagent' )
const express = require( 'express'    )
const router  = express.Router()


console.log( 'USTBot url: ', nconf.get( 'USTBOTSERVER' ) )
let CHATBOTSERVER = nconf.get( 'USTBOTSERVER' )

/*******************************************
************** Document summary *************
********************************************/

/**
 * Get a product's details
 */
router.post( '/getDocumentSummary', ( req, res ) => {
  let params = req.body
  if ( ! params.psid || ! params.botid || ! params.doc_name ) {
    res.status( 404 ).send( 'UserId, BotId or doc_name not provided.' )
    return
  }
  console.log( 'getDocumentSummary -> ', params )
  request.post( `${CHATBOTSERVER}/webview/getDocumentSummary` )
  .send({ psid: params.psid, botid: params.botid, doc_name: params.doc_name })
  .then( result => {
    console.log( 'getDocumentSummary -> ', JSON.parse( result.text ) )
    // res.sendStatus( 200 )
    res.send( JSON.parse( result.text ) )
  })
  .catch( err => {
    console.log( err )
    res.status(err.status).send( 'Error getting Document summary from server.' )
  })
})

/*******************************************
************** Utility requests *************
********************************************/
/**
  *Get URL and AppID
  */
  router.post('/getConf', (req, res) => {
    let appID = nconf.get('appID')
    let URL = nconf.get('WebviewURL')
    let conf = {
      appID : appID,
      url : URL
    }
    if (appID && URL) {
      res.send(conf)
    } else {
      res.status(400).send('Error getting AppID and url')
    }
  })

/**
  *Get Facebook UserProfile
  */
  router.post('/getUserInfo', (req, res) => {
    let params = req.body
    if (!params.psid) {
      res.status(400).send('UserID not provided')
      return
    }
    let psid = params.psid
    request.get('https://graph.facebook.com/v2.6/'+psid+'?access_token='+ACCESS_TOKEN)
    .then(result => {
      res.send( result.text )
    })
    .catch( err => {
      console.log(err)
      res.status(err.status).send('Error getting UserInfo from Facebook')
    })
  })

module.exports = router
