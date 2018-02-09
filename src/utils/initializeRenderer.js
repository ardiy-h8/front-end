/* globals THREE */
const { Color, WebGLRenderer } = THREE

export default canvas => {
  const renderer = new WebGLRenderer({ alpha: true, canvas })

  renderer.setClearColor(new Color('lightgrey'), 0)
  window.addEventListener('resize', onWindowResize, false)
  function onWindowResize () {
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
  renderer.domElement.style.position = 'absolute'
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.domElement.style.top = '0px'
  renderer.domElement.style.left = '0px'

  return renderer
}
