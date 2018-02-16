import React from 'react'

import App from '../App'
import HomeScreen from '../components/HomeScreen'
import './__setupTest__.js'
import { MemoryRouter } from 'react-router-dom';


describe('error route', () => {
  it('should redirect to 404 NotFoundPage ', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/random']}>
        <App />
      </MemoryRouter>
    )
    expect(wrapper.find(HomeScreen)).toHaveLength(0)
    expect(wrapper.find(NotFoundPage)).toHaveLength(1)
  })

  it('should not redirect to 404 NotFoundPage', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(wrapper.find(HomeScreen)).toHaveLength(1)
    expect(wrapper.find(NotFoundPage)).toHaveLength(0)
  })
})

