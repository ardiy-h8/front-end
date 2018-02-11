import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from './redux'
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

function asyncComponent (getComponent) {
  return class AsyncComponent extends React.Component {
    static Component = null
    state = { Component: AsyncComponent.Component }

    componentWillMount () {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component
          this.setState({ Component })
        })
      }
    }
    render () {
      const { Component } = this.state
      if (Component) {
        return <Component {...this.props} />
      }
      return null
    }
  }
}

const LoginScreen = asyncComponent(() =>
  import('./components/LoginScreen').then(module => module.default)
)

const Sketch = asyncComponent(() =>
  import('./components/Sketch').then(module => module.default)
)

const UserProfile = asyncComponent(() =>
  import('./components/UserProfile').then(module => module.default)
)

const AddDetailScreen = asyncComponent(() =>
  import('./components/AddDetailScreen').then(module => module.default)
)

const AddObjectScreen = asyncComponent(() =>
  import('./components/AddObjectScreen').then(module => module.default)
)

const ContentDetail = asyncComponent(() =>
  import('./components/ContentDetail').then(module => module.default)
)

const App = () => (
  <Provider store={store}>
    <Router>
      <div style={styles.container}>
        <Route exact path='/login' getComponent={LoginScreen} />
        <Route exact path='/' component={HomeScreen} />
        <Route exact path='/sketch' component={Sketch} />
        <Route exact path='/user-profile' component={UserProfile} />
        <Route exact path='/add-object' component={AddObjectScreen} />
        <Route exact path='/add-detail' component={AddDetailScreen} />
        <Route exact path='/content/:name' component={ContentDetail} />
      </div>
    </Router>
  </Provider>
)

export default App
