import React from 'react'
import { Button, Grid, Paper } from 'material-ui'

import MarkerGenerator from '../components/MarkerGenerator'

import './__setupTest__.js'

var markerGenerator = new MarkerGenerator()

describe('marker generator', () => {
  it('should be defined', () => {
    expect(MarkerGenerator).toBeDefined()
  })

  it('should render button', () => {
    const tree = shallow(
      <div>
        <input type="file" name="upload" onChange={markerGenerator.handleUpload} />
        <button onClick={markerGenerator.handleDownload}>download</button>
      </div>
    )
    expect(tree).toMatchSnapshot()
  })
  
  it('input should changes', () => {
    const wrapper = shallow(
      <MarkerGenerator />
    )
    wrapper.find('input')
      .simulate('change', {target: {
        files: [new Blob(['../assets/hiro.png'], {type:'mime'})]
      }
    })
  })


  // it('Download btn should call mock function when button is clicked', () => {
  //   const mockFn = markerGenerator.handleDownload
  //   const tree = shallow(
  //     <button onClick={mockFn}>download</button>
  //   )
  //   tree.simulate('click')
  // })
})
