import React, { Component } from 'react'
import BottomNavigation, {
  BottomNavigationAction
} from 'material-ui/BottomNavigation'
import HomeIcon from 'material-ui-icons/Home'
import AccountCircleIcon from 'material-ui-icons/AccountCircle'
import CameraIcon from 'material-ui-icons/CameraAlt'
import AddIcon from 'material-ui-icons/AddCircle'
import { Redirect } from 'react-router-dom'

class Navigation extends Component {
  constructor () {
    super()
    this.state = {
      value: 0,
      camera: 0,
      home: 0,
      user: 0,
      add: 0
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange (event, value) {
    this.setState({ value })
  }
  render () {
    const { value } = this.state
    return (
      <div style={styles.root}>
        <BottomNavigation value={value} onChange={this.handleChange} showLabels>
          <BottomNavigationAction
            label='Catalogue'
            icon={<HomeIcon />}
            onClick={() => this.setState({ home: 1 })}
          />
          {this.state.home && <Redirect to='/' />}
          <BottomNavigationAction
            label='My Profile'
            icon={<AccountCircleIcon />}
            onClick={() => this.setState({ user: 1 })}
          />
          {this.state.user && <Redirect to='/user-profile' />}
          <BottomNavigationAction
            label='Add'
            icon={<AddIcon />}
            onClick={() => this.setState({ add: 1 })}
          />
          {this.state.add && <Redirect to='/add-magazine' />}
        </BottomNavigation>
      </div>
    )
  }
}

const styles = {
  root: {
    width: '100%',
    position: 'fixed',
    left: 0,
    bottom: 0
  },
  icon: {
    color: '#010080'
  }
}

export default Navigation
