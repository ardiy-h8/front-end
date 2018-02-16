import React, { Component } from 'react'
import isEqual from 'lodash.isequal'
import { Button } from 'material-ui'
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace'
import { connect } from 'react-redux'

import SketchRenderer from './SketchRenderer'
import MoveControl from './MoveControl'
import MarkerSearch from './MarkerSearch'
import ObjectTips from './ObjectTips'
import { input_data_object as addObject } from '../redux/actions/detailCoverActions'

class Sketch extends Component {
  constructor() {
    super()
    this.state = {
      showTips: true,
      markerFound: false,
      coord: {
        x: 0,
        z: 0
      },
      rotation: 0,
      scale: {
        x: 0.5,
        y: 0.5,
        z: 0.5
      }
    }
    this.shouldComponentUpdate = this.shouldComponentUpdate.bind(this)
    this.handleTranslateChange = this.handleTranslateChange.bind(this)
    this.handleZoomChange = this.handleZoomChange.bind(this)
    this.handleRotationChange = this.handleRotationChange.bind(this)
    this.handleHideTips = this.handleHideTips.bind(this)
    this.handleMarkerFound = this.handleMarkerFound.bind(this)
  }

  shouldComponentUpdate(nextProps, state) {
    return !isEqual(state, this.state)
  }

  componentWillMount() {
    this.props.getMarker.map(marker => {
      marker.object3d.map(object3d => {
        object3d.id == this.props.match.params.id
          ? this.props.addDetailObject({
              pattern: object3d.marker,
              dae: object3d.object3d
            })
          : ''
      })
    })
  }

  handleTranslateChange({ x, z }) {
    this.setState({ coord: { x, z } })
  }

  handleZoomChange({ x, y, z }) {
    this.setState({ scale: { x, y, z } })
  }
  handleRotationChange(rotation) {
    this.setState({ rotation })
  }

  handleHideTips() {
    this.setState({ showTips: false })
  }

  handleMarkerFound() {
    this.setState({ markerFound: true })
  }

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
        {!markerFound && <MarkerSearch style={styles.MarkerSearch} />}
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
        {markerFound &&
          this.state.showTips && (
            <ObjectTips onHide={() => this.handleHideTips()} />
          )}
        <Button
          variant="fab"
          aria-label="back"
          color="secondary"
          style={styles.back}
          onClick={() => (window.location.href = '/')}>
          <KeyboardBackspace />
        </Button>
      </div>
    )
  }
}

const styles = {
  navigation: {
    top: 56
  },
  back: {
    zIndex: 1000,
    position: 'absolute',
    left: '1em',
    top: '1em'
  },
  MarkerSearch: {
    position: 'absolute',
    bottom: '5rem',
    left: 0,
    right: 0,
    textAlign: 'center',
    padding: 'auto auto'
  }
}

const mapStateToProps = state => ({
  getMarker: state.detailCoverReducers.cover
})

const mapDispatchToProps = dispatch => {
  return {
    addDetailObject: payload => dispatch(addObject(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sketch)
