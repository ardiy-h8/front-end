import React, { Component } from 'react'
import { AppBar, Toolbar, Typography } from 'material-ui/'

class Header extends Component {
  render () {
    return (
      <div style={styles.root}>
        <AppBar position='static'>
          <Toolbar>
            <Typography variant='title' color='inherit'>
              <img src='./header-logo.png' alt='logo' height='40px' width='40px' />
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    )
  }
}

const styles = {
  root: {
    width: '100%',
    top: 0,
    zIndex: 100,
    position: 'fixed',
    backgroundColor: '#000080'
  }
}

export default Header
