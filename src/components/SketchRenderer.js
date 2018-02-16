/* globals THREE, requestAnimationFrame */
import React, { Component } from 'react'
import initializeRenderer from '../utils/initializeRenderer'
import { initializeArToolkit, getMarker } from '../utils/arToolkit'
import { connect } from 'react-redux'
import ColladaLoader from 'three-collada-loader-2'

export const sketchRendererFactory = ({
  THREE,
  initializeArToolkit,
  initializeRenderer,
  getMarker,
  requestAnimationFrame
}) => {
  const { Camera, Group, Scene } = THREE

  return class SketchRenderer extends Component {
    componentDidMount () {
      const {
        coordX,
        coordZ,
        scaleX,
        scaleY,
        scaleZ,
        rotation,
        onMarkerFound
      } = this.props

      const renderer = (this.renderer = initializeRenderer(this.canvas))

      const scene = new Scene()
      const camera = new Camera()
      scene.add(camera)

      const markerRoot = new Group()
      scene.add(markerRoot)
      const onRenderFcts = []
      const arToolkitContext = initializeArToolkit(
        renderer,
        camera,
        onRenderFcts
      )
      const marker = getMarker(
        arToolkitContext,
        markerRoot,
        this.props.objectReducers.pattern
      )

      marker.addEventListener('markerFound', onMarkerFound)

      // ColladaLoader(THREE)
      this.loader = new ColladaLoader()
      this.loader.options.convertUpAxis = true
      let that = this
      this.loader.load(this.props.objectReducers.dae, function (collada) {
        console.log(collada.scene)
        that.avatar = collada.scene
        // that.avatar.rotation.x = -Math.PI / 2 // -90°
        // that.avatar.rotation.z = rotation
        // that.avatar.position.x = coordX
        // that.avatar.position.z = coordZ
        // that.avatar.scale.x = scaleX
        // that.avatar.scale.y = scaleY
        that.avatar.needsUpdate = true
        scene.add(that.avatar)
        markerRoot.add(that.avatar)
      })
      var ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
      scene.add(ambientLight)
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
      directionalLight.position.set(1, 1, -1)
      scene.add(directionalLight)

      // render the scene
      onRenderFcts.push(function () {
        renderer.render(scene, camera)
      })

      // run the rendering loop
      var lastTimeMsec = null

      function animate (nowMsec) {
        // keep looping
        requestAnimationFrame(animate)
        // measure time
        lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
        const deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
        lastTimeMsec = nowMsec
        // call each update function
        onRenderFcts.forEach(onRenderFct => {
          onRenderFct(deltaMsec / 1000, nowMsec / 1000)
        })
      }
      requestAnimationFrame(animate)
    }

    componentWillUnmount () {
      this.renderer.dispose()
    }

    storeRef = node => {
      this.canvas = node
    }

    componentDidUpdate () {
      const { coordX, coordZ, scaleX, scaleY, scaleZ, rotation } = this.props
      this.avatar.position.x = coordX
      this.avatar.position.z = coordZ
      this.avatar.scale.x = scaleX
      this.avatar.scale.y = scaleY
      this.avatar.scale.z = scaleZ
      this.avatar.rotation.z = rotation
      this.avatar.needsUpdate = true
    }

    render () {
      return <canvas id='root' ref={this.storeRef} />
    }
  }
}

const mapStateToProps = state => ({
  objectReducers: state.objectReducers.objectReducers
})

export default connect(mapStateToProps)(
  sketchRendererFactory({
    THREE,
    initializeArToolkit,
    getMarker,
    initializeRenderer,
    requestAnimationFrame: requestAnimationFrame
  })
)
