import React, { Component } from 'react'
import isEqual from 'lodash.isequal'

import SketchRenderer from './SketchRenderer'
import MoveControl from './MoveControl'

class Sketch extends Component {
  state = {
    markerFound: false,
    coord: {
      x: 0,
      z: 0
    },
    rotation: 0,
    scale: {
      x: 1,
      y: 1,
      z: 1
    }
  }

  renderer = null

  shouldComponentUpdate(nextProps, state) {
    return !isEqual(state, this.state)
  }

  handleTranslateChange = ({ x, z }) => this.setState({ coord: { x, z } })

  handleZoomChange = ({ x, y, z }) => this.setState({ scale: { x, y, z } })

  handleRotationChange = rotation => this.setState({ rotation })

  handleMarkerFound = () => this.setState({ markerFound: true })

  render() {
    const {
      markerFound,
      coord: { x: coordX, z: coordZ },
      scale: { x: scaleX, y: scaleY, z: scaleZ },
      rotation
    } = this.state
    return (
      <div>
        <SketchRenderer
          coordX={coordX}
          coordZ={coordZ}
          scaleX={scaleX}
          scaleY={scaleY}
          scaleZ={scaleZ}
          rotation={rotation}
          onMarkerFound={this.handleMarkerFound}
        />
        {markerFound && (
          <MoveControl
            coordX={coordX}
            coordZ={coordZ}
            scaleX={scaleX}
            scaleY={scaleY}
            scaleZ={scaleZ}
            rotation={rotation}
            onTranslateChange={this.handleTranslateChange}
            onZoomChange={this.handleZoomChange}
            onRotationChange={this.handleRotationChange}
          />
        )}
      </div>
    )
  }
}

export default Sketch
