import React from 'react'

import UserScreen from '../components/UserScreen'

import './__setupTest__.js'


var userScreen = new UserScreen()

describe('marker generator', () => {
  const getComponent = () => shallow(<UserScreen />)
  it('should be defined', () => {
    expect(getComponent()).toBeDefined()
  })

  it('should render button', () => {
    expect(getComponent()).toMatchSnapshot()
  })
  
  it('input should changes', () => {
    const wrapper = shallow(
      <input
        accept='image/*'
        type='file'
        id='marker'
        name='marker'
        style={{ display: 'none' }}
        onChange={userScreen.handleUpload}
      />
    )
    wrapper.find('input')
      .simulate('change', {target: {
        files: [new Blob(['../assets/hiro.png'], {type:'mime'})]
      }
    })
  })
})
