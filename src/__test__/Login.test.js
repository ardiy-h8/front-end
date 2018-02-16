import React from 'react'
import { Button, Grid, Paper } from 'material-ui'

import LoginScreen from '../components/LoginScreen'
import './__setupTest__.js'



var login =  new LoginScreen()


describe('login button', () => {
  
  it('Should be defined', () => {
    expect(LoginScreen).toBeDefined()
  })

  it('should render button google correctly', () => {
    const tree = shallow(
      <Button
        variant='raised'
        onClick={() => this.handleGoogleLogin()}
      >
        <i className='fab fa-google'/>
        Login With Google
        </Button>
    )
    expect(tree).toMatchSnapshot()
    
  })

  it('should render button facebook correctly', () => {
    const tree = shallow(
      <Button
        variant='raised'
        onClick={() => this.handleFacebookLogin()}
      >
        <i className='fab fa-google' />
        Login With Facebook
        </Button>
    )
    expect(tree).toMatchSnapshot()
  })

  // simulate click button
  it('Google Btn should call mock function when button is clicked', () => {
    const mockFn = login.handleGoogleLogin
    const tree = shallow(
      <Button
        variant='raised'
        onClick={mockFn}
      >
        <i className='fab fa-google' />
        Login With Google
        </Button>
    )
    tree.simulate('click')
  })
  
  it('FB btn should call mock function when button is clicked', () => {
    const mockFn = login.handleFacebookLogin
    const tree = shallow(
      <Button
        variant='raised'
        onClick={mockFn}
      >
      <i
        className='fab fa-facebook-f'
      />
      Login With Facebook
      </Button>
    )
    tree.simulate('click')
  })

})
