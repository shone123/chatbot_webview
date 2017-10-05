import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import RouteComponent from './RouteComponent'


class App extends React.Component {

  render () {
    return (
      <div>
        <Router>
          <div>
            <Route render={ props => <RouteComponent {...props} device={this.props.device} /> } />
          </div>
        </Router>
      </div>
    )
  }
}


window.attachApp = ( device ) => {
  ReactDOM.render( <App device={device} /> , window.document.getElementById('app'));
}
