import React, { Component } from 'react'
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
  // copy image on canvas
  var canvas = document.createElement('canvas')
  var context = canvas.getContext('2d')
  canvas.width = 16
  canvas.height = 16

  // document.body.appendChild(canvas)
  // canvas.style.width = '200px'

  var patternFileString = ''
  for (
    var orientation = 0;
    orientation > -2 * Math.PI;
    orientation -= Math.PI / 2
  ) {
    // draw on canvas - honor orientation
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

    // get imageData
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height)
    // generate the patternFileString for this orientation
    if (orientation !== 0) patternFileString += '\n'
    // NOTE bgr order and not rgb!!! so from 2 to 0
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

//////////////////////////////////////////////////////////////////////////////
//    trigger download
//////////////////////////////////////////////////////////////////////////////

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

  //   // copy image on canvas
  context.fillStyle = 'black'
  context.fillRect(
    whiteMargin * canvas.width,
    whiteMargin * canvas.height,
    canvas.width * (1 - 2 * whiteMargin),
    canvas.height * (1 - 2 * whiteMargin)
  )

  //   // clear the area for innerImage (in case of transparent image)
  context.fillStyle = 'white'
  context.fillRect(
    innerMargin * canvas.width,
    innerMargin * canvas.height,
    canvas.width * (1 - 2 * innerMargin),
    canvas.height * (1 - 2 * innerMargin)
  )

  //   // display innerImage in the middle
  var innerImage = new Image()
  innerImage.src = innerImageURL
  innerImage.onload = async function (e) {
    // draw innerImage
    await context.drawImage(
      innerImage,
      innerMargin * canvas.width,
      innerMargin * canvas.height,
      canvas.width * (1 - 2 * innerMargin),
      canvas.height * (1 - 2 * innerMargin)
    )
    // context.drawImage(innerImage, 10, 10)
    var imageUrl = canvas.toDataURL()
    onComplete(imageUrl)
  }
  innerImage.onload()
}

class markerGenerator extends Component {
  constructor() {
    super()
    this.state = {
      readerResult: '',
      patternFileStr: '',
      img: ''
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.encode = this.encode.bind(this)
  }

  handleUpload(e) {
    var reader = new FileReader()

    var self = this
    reader.onloadend = function () {
      THREEx.ArPatternFile.buildFullMarker(reader.result, function onComplete(newUrl) {
        self.setState({
          readerResult: reader.result,
          img: newUrl
        }, self.encode)
      })
    }
    reader.readAsDataURL(e.target.files[0])
  }

  encode () {
    let newUrl = this.state.readerResult
    var self = this
    THREEx.ArPatternFile.encodeImageUrl(newUrl, function onComplete(patternFileString) {
      self.setState({
        patternFileStr: patternFileString
      })
    })
  }

  handleDownload() {
    let newUrl = this.state.img
    let patternHiro = this.state.patternFileStr
    THREEx.ArPatternFile.triggerDownload(patternHiro, newUrl)
  }

  render() {
    return (
      <div>
        <input type="file" name="upload" onChange={this.handleUpload} />
        <button onClick={this.handleDownload}>download</button>
      </div>
    )
  }
}

export default markerGenerator
