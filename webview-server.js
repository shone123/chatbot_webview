var noop         = require( './loadEnv'   )
const express    = require( 'express'     )
var https = require('https');
var fs = require('fs');
const path       = require( 'path'        )
const bodyParser = require( 'body-parser' )
const api        = require( './api/api'   )
var nconf = require( 'nconf'  )
var helmet = require('helmet')

const app = express()

// if ( nconf.get( 'conf' ) === 'prod' ) {
//   https.createServer({
//     key  : fs.readFileSync( 'bot.key' ),
//     cert : fs.readFileSync( 'bot.cert')
//   }, app )
// }

/*app.use(helmet({
  frameguard: {
    action: 'allow-from',
    domain: 'https://www.messenger.com/'
  }
}))*/
app.use( bodyParser.json() )
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( express.static( path.join( __dirname, 'public' ) ) )
app.use( '*/js' , express.static( path.join( __dirname, 'public/js' ) ) )
app.use( '/api', api )
app.get( '*', ( req, res ) => {
    //console.log("res is ", req )

  res.sendFile( './public/index.html', { root: __dirname } )
})

app.listen( nconf.get( 'xpress_port' ), () => {
  console.log( 'App listening on port ', nconf.get( 'xpress_port' ) )
})