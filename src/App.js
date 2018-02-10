import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import LoginScreen from './components/LoginScreen'
import Sketch from './components/Sketch'
import HomeScreen from './components/HomeScreen'
import UserScreen from './components/UserScreen'

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    fontFamily: "'Roboto', sans-serif"
  }
}

class App extends Component {
  render () {
    return (
      <Router>
        <div style={styles.container}>
          <Switch>
            <Route exact path='/' component={LoginScreen} />
            <Route exact path='/sketch' component={Sketch} />
            <Route exact path='/home' component={HomeScreen} />
            <Route exact path='/content-input' component={UserScreen} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
