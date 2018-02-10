import React, { Component } from 'react'
import BottomNavigation, {
  BottomNavigationAction
} from 'material-ui/BottomNavigation'
import HomeIcon from 'material-ui-icons/Home'
import AssignmentIcon from 'material-ui-icons/Assignment'
import CameraIcon from 'material-ui-icons/CameraAlt'
import { Redirect } from 'react-router-dom'

class Navigation extends Component {
  state = {
    value: 0,
    camera: 0,
    home: 0,
    input: 0
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }
  render () {
    const { value } = this.state
    return (
      <div style={styles.root}>
        <BottomNavigation value={value} onChange={this.handleChange} showLabels>
          <BottomNavigationAction
            label='Home'
            icon={<HomeIcon />}
            onClick={() => this.setState({ home: 1 })}
          />
          {this.state.home && <Redirect to='/' />}
          <BottomNavigationAction
            label='Input'
            icon={<AssignmentIcon />}
            onClick={() => this.setState({ input: 1 })}
          />
          {this.state.input && <Redirect to='/content-input' />}
          <BottomNavigationAction
            label='Camera'
            icon={<CameraIcon />}
            onClick={() => this.setState({ camera: 1 })}
          />
          {this.state.camera && <Redirect to='/sketch' />}
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
