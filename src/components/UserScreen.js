import React, { Component } from 'react'
import { TextField, Button } from 'material-ui'

import Navigation from './Navigation'
import Header from './Header'

const THREEx = THREEx || {}

THREEx.ArPatternFile = {}

THREEx.ArPatternFile.encodeImageUrl = (imageURL, onComplete) => {
  var image = new Image()
  image.onload = function () {
    var patternFileString = THREEx.ArPatternFile.encodeImage(image)
    onComplete(patternFileString)
  }
  image.src = imageURL
  image.onload()
}

THREEx.ArPatternFile.encodeImage = function (image) {
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  canvas.width = 16
  canvas.height = 16

  var patternFileString = ''
  for (
    var orientation = 0;
    orientation > -2 * Math.PI;
    orientation -= Math.PI / 2
  ) {
    context.save()
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.translate(canvas.width / 2, canvas.height / 2)
    context.rotate(orientation)
    context.drawImage(
      image,
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    )
    context.restore()

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    if (orientation !== 0) patternFileString += '\n'
    for (var channelOffset = 2; channelOffset >= 0; channelOffset--) {
      for (var y = 0; y < imageData.height; y++) {
        for (var x = 0; x < imageData.width; x++) {
          if (x !== 0) patternFileString += ' '

          var offset = y * imageData.width * 4 + x * 4 + channelOffset
          var value = imageData.data[offset]

          patternFileString += String(value).padStart(3)
        }
        patternFileString += '\n'
      }
    }
  }
  return patternFileString
}

THREEx.ArPatternFile.triggerDownload = (patternFileString, newUrl) => {

  var domElement = window.document.createElement('a')
  domElement.href = window.URL.createObjectURL(
    new Blob([patternFileString], { type: 'text/plain' })
  )
  domElement.download = 'pattern-marker.patt'
  document.body.appendChild(domElement)
  domElement.click()
  document.body.removeChild(domElement)
  console.log('donlot')
  var e = document.createElement('a')
  var href = newUrl
  e.setAttribute('href', href)
  e.setAttribute('download', 'image.png')
  document.body.appendChild(e)
  e.click()
  document.body.removeChild(e)
}

THREEx.ArPatternFile.buildFullMarker = function (innerImageURL, onComplete) {
  var whiteMargin = 0.1
  var blackMargin = 0.2
  var innerMargin = whiteMargin + blackMargin

  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  canvas.width = canvas.height = 512

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = 'black'
  context.fillRect(
    whiteMargin * canvas.width,
    whiteMargin * canvas.height,
    canvas.width * (1 - 2 * whiteMargin),
    canvas.height * (1 - 2 * whiteMargin)
  )

  context.fillStyle = 'white'
  context.fillRect(
    innerMargin * canvas.width,
    innerMargin * canvas.height,
    canvas.width * (1 - 2 * innerMargin),
    canvas.height * (1 - 2 * innerMargin)
  )

  var innerImage = new Image()
  innerImage.src = innerImageURL
  innerImage.onload = async function (e) {
    await context.drawImage(
      innerImage,
      innerMargin * canvas.width,
      innerMargin * canvas.height,
      canvas.width * (1 - 2 * innerMargin),
      canvas.height * (1 - 2 * innerMargin)
    )
    var imageUrl = canvas.toDataURL()
    onComplete(imageUrl)
  }
  innerImage.onload()
}

class UserScreen extends Component {
  constructor() {
    super()
    this.state = {
      imageResult: '', //Image base64 without border for patt file
      patternFileStr: '', //Pattern string for patt file
      patternImage: '' //Image with border to download
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.encode = this.encode.bind(this)
  }

  handleUpload(e) {
    var reader = new FileReader()

    var self = this
    reader.onloadend = function () {
      THREEx.ArPatternFile.buildFullMarker(reader.result, function onComplete(patternResult) {
        self.setState({
          imageResult: reader.result,
          patternImage: patternResult
        }, self.encode)
      })
    }
    reader.readAsDataURL(e.target.files[0])
  }
  encode () {

    let imageResult = this.state.imageResult
    var self = this
    THREEx.ArPatternFile.encodeImageUrl(imageResult, function onComplete(patternFileString) {
      self.setState({
        patternFileStr: patternFileString
      })
    })
  }

  handleDownload() {
    let patternImage = this.state.patternImage
    let patternFileStr = this.state.patternFileStr
    THREEx.ArPatternFile.triggerDownload(patternFileStr, patternImage)
  }

  render () {
    return (
      <div>
        <Header />
        <div style={styles.container}>
          <TextField
            id='title'
            label='Title'
            helperText='ex: Your Title'
            fullWidth
            margin='normal'
          />
          <TextField
            id='detail'
            label='Detail'
            helperText='ex: Description Detail'
            fullWidth
            margin='normal'
          />
          <input
            accept='image/*'
            type='file'
            id='marker'
            name='marker'
            style={{ display: 'none' }}
            onChange={this.handleUpload}
          />
          <label htmlFor='marker'>
            <Button
            variant='raised'
            component='span'
            syle={styles.button}>
              Marker Upload
            </Button>
          </label>
          <input
            type='file'
            id='object'
            placeholder='object'
            style={{ display: 'none' }}
          />
          <label htmlFor='object'>
            <br />
            <Button variant='raised' component='span' syle={styles.button}>
              Object Upload
            </Button>
          </label>
          <div>
            <br />
            <Button
              variant='raised'
              component='span'
              color='primary'
              syle={styles.button}
            >
              Save
            </Button>
            {(this.state.patternImage && this.state.patternFileStr) && <Button variant='raised'
            component='span'
            color='secondary' onClick={this.handleDownload}>download</Button>}
          </div>
        </div>
        <Navigation />
      </div>
    )
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginTop: 56,
    padding: '2em'
  },
  button: {
    padding: '0.75em'
  }
}

export default UserScreen
