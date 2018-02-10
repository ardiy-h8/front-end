import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import HomeScreen from './components/HomeScreen'

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


function asyncComponent(getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render() {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

  const LoginScreen = asyncComponent(() => 
    import('./components/LoginScreen')
      .then(module => module.default)
  )

  const Sketch = asyncComponent(() => 
    import('./components/Sketch')
      .then(module => module.default)
  )

  const UserScreen = asyncComponent(() =>
    import('./components/UserScreen')
      .then(module => module.default)
  )

  // const HomeScreen = asyncComponent(() =>
  //   import('./components/HomeScreen')
  //     .then(module => module.default)
  // )

const App = () =>
  
    <Router>
      <div style={styles.container}>
        <Route exact path='/login'
        getComponent={LoginScreen} />
        <Route exact path='/sketch' component={Sketch} />
        <Route exact path='/' component={HomeScreen} />
        <Route exact path='/content-input' component={UserScreen} />
      </div>
    </Router>
    
  


export default App
