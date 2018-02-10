import React from 'react'
import { AppBar, Toolbar, Typography } from 'material-ui/'


import Header from '../components/Header'
import './__setupTest__.js'



const styles = {
  root: {
    width: '100%',
    top: 0,
    zIndex: 100,
    position: 'fixed',
    backgroundColor: '#000080'
  }
}

describe('Header component', () => {
  it('should be defined', () => {
    expect(Header).toBeDefined()
  })

  it('should render Header component and match Snapshot', () => {
    const wrapper = shallow(
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
    expect(wrapper).toMatchSnapshot()
  })
})
