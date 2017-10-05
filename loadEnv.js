/**
 * Load values from config files
 */
var _     = require( 'lodash' )
var hjson = require( 'hjson'  )
var nconf = require( 'nconf'  )

nconf.use( 'memory' )
nconf.argv().env()

let confName = nconf.get( 'conf' ) || ''
confName = confName.trim()

if ( _.includes( [ 'dev', 'stage', 'prod','jamie' ], confName ) ) {
	console.log( 'Loading: ./config/' + confName + '.json' )
  nconf.add( 'file1', { file : './config/' + confName + '.json', type: 'file', format : hjson } );
} else {
	console.log( `
    Usage:
      node webview-server --conf prod|stage|dev` 
  )
  process.exit( 0 )
}

// Defaults are loaded last as values are not overwritten
// i.e. older values win
nconf.add( 'file', { type: 'file', file : './config/defaults.json', format : hjson } )
nconf.load()
