import React from 'react'
import request from 'superagent'
import _ from 'lodash'

export var getProductDetails = (psid, botid, xc_sku) => {
  return new Promise((resolve, reject) => {
    request.post( '/api/getProductDetails' )
      .send( {
        psid   : psid,
        botid  : botid,
        xc_sku : xc_sku
      })
      .then( res => JSON.parse( res.text ) )
      .then( product => {
        let finalProduct = generateProduct( product )
        resolve(finalProduct)
      })
      .catch( err => {
        console.log( err )
        reject(err)
      })
  })
}

export var removeItemFromList = (psid, botid, xc_sku, client_name, mode) => {
  return new Promise((resolve, reject) => {
    request.post( `/api/removeItemFrom${mode}` )
      .send( {
        psid   : psid,
        botid  : botid,
        xc_sku : xc_sku,
        catalog : client_name
      })
      .then( res => {
        resolve('Success')
      })
      .catch( err => {
        console.log( err )
        reject(err)
      })
  })
}

export var addItemToCart = (psid, botid, client_name, color, size, xc_sku) => {
  return new Promise((resolve, reject) => {
    request.post( '/api/addItemToCart' )
    .send( {
      psid     : psid,
      botid    : botid,
      catalog  : client_name,
      color    : color && color.length > 0 ? color[0] : null,
      quantity : 1,
      size     : size,
      xc_sku   : xc_sku
    })
    .then( res => {
      resolve('Success')
    })
    .catch( err => {
      console.log( err )
      reject(err)
    })
  })
}

export var saveToWishlist = (psid, botid, client_name, color, size, xc_sku) => {
  return new Promise((resolve, reject) => {
    request.post( '/api/saveToWishlist' )
    .send( {
      psid   : psid,
      botid  : botid,
      xc_sku : xc_sku,
      color  : color,
      size   : size,
      catalog : client_name
    })
    .then( res => {
      resolve('Success')
    })
    .catch( err => {
      console.log( err )
      reject(err)
    })
  })
}

export var moveToList = (psid, botid, client_name, color, size, xc_sku, mode) => {
  return new Promise((resolve, reject) => {
    request.post( `/api/moveTo${mode}`)
    .send({ 
      psid     : psid, 
      botid    : botid, 
      catalog  : client_name,
      color    : color && color.length > 0 ? color[0] : null,
      size     : size,
      xc_sku   : xc_sku
    })
    .then( res => {
      resolve('Success')
    })
    .catch( err => {
      console.log( err )
      reject(err)
    })
  })
}

export var getGroupProductDetails = (psid, botid, group_sku) => {
  return new Promise((resolve, reject) => {
    request.post( '/api/getGroupProductDetails' )
      .send( {
        psid  : psid,
        botid : botid,
        group_sku : group_sku
      })
      .then( res => JSON.parse( res.text ) )
      .then( productarr => {
        let finalProductarr = productarr.map( product => generateProduct(product) )
        resolve( finalProductarr )
      })
      .catch( err => {
        console.log( err )
        reject(err)
      })
    })
}

export var getFeatures = () => {
  return new Promise((resolve, reject) => {
    window.MessengerExtensions.getSupportedFeatures(
      res => {
        var features  = res.supported_features
        if (_.indexOf(features, "context") != -1 && _.indexOf(features, "sharing_broadcast") != -1) {
          resolve('supported')
        }
      }, err => {
        console.log(err)
        reject('not supported')
      }
    )
  })
}

function generateProduct(product) {
  product.colorsText = null
  if ( product.colorsavailable && product.colorsavailable.length > 0 ) {
    let arr = product.colorsavailable
    if ( product.colorsavailable.length > 5 ){
      arr = arr.slice(0, 5)
      arr.push('more...')
    }
    product.colorsText = arr.map( col => _.startCase( _.toLower( col ) ) ).join( ', ' )
  }

  product.sizeText = null
  if ( product.size && product.size.length > 0 ) {
    let arr = product.size
    if ( product.size.length > 5 ){
      arr = arr.slice(0, 5)
      arr.push('more...')
    }
    product.sizeText = arr.join( ' | ' )
  }

  product.size = _.map(product.size, sizeItem => {
    return {
      size : sizeItem,
      selected : false
    }
  })
  return product
}