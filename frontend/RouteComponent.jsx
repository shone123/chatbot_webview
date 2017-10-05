import React from 'react';
import { render } from 'react-dom';
import _ from 'lodash'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
const queryString = require('query-string');

class RouteComponent extends React.Component {

  constructor(props) {
    super(props)
    let query = { psid : null, botid : null }  // Empty template for query
    _.merge( query, queryString.parse(this.props.location.search) )
    this.state = { 
        query : query,
        path : this.props.location.pathname
    }
  }

  componentWillMount() {

    if (!_.isNull( this.state.path.match(/summary/g ) ) ) {
        import('./summary/DocumentSummary').then(DocumentSummary => {
            this.DocumentSummary = DocumentSummary
            this.forceUpdate()
        })

    }
  }

  render() {
    return (
      <div>
        { this.DocumentSummary ? <Route path='/summary' render={ props => <this.DocumentSummary {...props} query={this.state.query} device={this.props.device} /> } /> : null }
      </div>
    )
  }
}

module.exports = RouteComponent
