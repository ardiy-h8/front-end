import React, { Component } from 'react'
import isEqual from 'lodash.isequal'
import { Button } from 'material-ui'
import KeyboardBackspace from 'material-ui-icons/KeyboardBackspace'
import { connect } from 'react-redux'

import canvas from '../utils/initializeRenderer'
import SketchRenderer from './SketchRenderer'
import MoveControl from './MoveControl'
import MarkerSearch from './MarkerSearch'
import ObjectTips from './ObjectTips'

var cancelAnimationFrame =
  navigator.cancelAnimationFrame || navigator.mozCancelAnimationFrame

class Sketch extends Component {
  constructor () {
    super()
    this.state = {
      pattern: '',
      dae: '',
      showTips: true,
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
  }

  shouldComponentUpdate (nextProps, state) {
    return !isEqual(state, this.state)
  }

  componentDidMount() {
    this.props.getMarker.filter(marker => {
      marker.id === this.props.match.params.id &&
        this.setState({
          pattern: marker.marker,
          dae: marker.object3d
        })
    })
  }

  goBack () {
    window.location.reload()
    this.props.history.push('/home')
  }

  handleTranslateChange ({ x, z }) {
    this.setState({ coord: { x, z } })
  }

  handleZoomChange ({ x, y, z }) {
    this.setState({ scale: { x, y, z } })
  }
  handleRotationChange (rotation) {
    this.setState({ rotation })
  }

  handleHideTips () {
    this.setState({ showTips: false })
  }

  handleMarkerFound () {
    this.setState({ markerFound: true })
  }

  render () {
    const {
      pattern,
      dae,
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
          pattern={{}}
          dae={dae}
        />
        {!markerFound && <MarkerSearch style={styles.MarkerSearch} />}
        {markerFound &&
          <MoveControl
            coordX={coordX}
            coordZ={coordZ}
            scaleX={scaleX}
            scaleY={scaleY}
            scaleZ={scaleZ}
            rotation={rotation}
            onTranslateChange={() => this.handleTranslateChange()}
            onZoomChange={() => this.handleZoomChange()}
            onRotationChange={() => this.handleRotationChange()}
          />}
        {markerFound &&
          this.state.showTips &&
          <ObjectTips onHide={() => this.handleHideTips()} />}
        <Button
          variant='fab'
          aria-label='back'
          color='secondary'
          style={styles.back}
          onClick={() => (window.location.href = '/')}
        >
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

export default connect(mapStateToProps)(Sketch)
