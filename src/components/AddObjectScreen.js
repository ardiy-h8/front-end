import React, { Component } from 'react'
import { Button, Grid, Paper, ButtonBase, TextField } from 'material-ui'
import Card, { CardHeader, CardMedia, CardContent } from 'material-ui/Card'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import { input_data_object as addObject } from '../redux/actions/detailCoverActions'
import Navigation from './Navigation'
import Header from './Header'

const THREEx = THREEx || {}

THREEx.ArPatternFile = {}

THREEx.ArPatternFile.encodeImageUrl = (imageURL, onComplete) => {
  var image = new Image()
  image.onload = function() {
    var patternFileString = THREEx.ArPatternFile.encodeImage(image)
    onComplete(patternFileString)
  }
  image.src = imageURL
  image.onload()
}

THREEx.ArPatternFile.encodeImage = function(image) {
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

THREEx.ArPatternFile.triggerDownload = image => {
  var e = document.createElement('a')
  var href = image
  e.setAttribute('href', href)
  e.setAttribute('download', 'marker.png')
  document.body.appendChild(e)
  e.click()
  document.body.removeChild(e)
}

THREEx.ArPatternFile.buildFullMarker = function(innerImageURL, onComplete) {
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
  innerImage.onload = async function(e) {
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

class AddObjectScreen extends Component {
  constructor() {
    super()
    this.state = {
      title: '',
      description: '',
      imageResult: '', // Image base64 without border for patt file
      patternFileStr: '', // Pattern string for patt file
      patternImage: '', // Image with border to download
      object3d: '',
      pages: ''
    }
    this.handleUploadMarker = this.handleUploadMarker.bind(this)
    this.handleUploadObject = this.handleUploadObject.bind(this)
    this.handleDownload = this.handleDownload.bind(this)
    this.encode = this.encode.bind(this)
  }

  componentWillMount() {
    if (!localStorage.userData) {
      return this.props.history.push('/login')
    }
  }

  handleUploadMarker(e) {
    var reader = new FileReader()

    var self = this
    reader.onloadend = function() {
      THREEx.ArPatternFile.buildFullMarker(reader.result, function onComplete(
        patternResult
      ) {
        self.setState(
          {
            imageResult: reader.result,
            patternImage: patternResult
          },
          self.encode
        )
      })
    }
    reader.readAsDataURL(e.target.files[0])
  }

  handleUploadObject(e) {
    var reader = new FileReader()

    reader.onloadend = () => {
      this.setState({ object3d: reader.result })
    }
    reader.readAsDataURL(e.target.files[0])
  }

  encode() {
    let imageResult = this.state.imageResult
    var self = this
    THREEx.ArPatternFile.encodeImageUrl(imageResult, function onComplete(
      patternFileString
    ) {
      self.setState({
        patternFileStr: patternFileString
      })
    })
  }

  handleDownload() {
    let patternImage = this.state.patternImage
    THREEx.ArPatternFile.triggerDownload(patternImage)
  }

  handleClickSubmit() {
    const {
      title,
      description,
      patternFileStr,
      patternImage,
      object3d,
      pages
    } = this.state
    const mid = this.props.match.params.mid

    this.props
      .mutate({
        variables: {
          mid,
          title,
          description,
          pages,
          marker: patternFileStr,
          img_marker: patternImage,
          object3d
        }
      })
      .then(({ data }) => this.props.history.push('/'))
      .catch(err => console.error('gagal', err))
  }

  render() {
    var el = document.querySelector('app')
    return (
      <div style={styles.root}>
        <Header location={this.props.location.pathname} />
        <div style={styles.content}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <TextField
                    id="title"
                    label="Title"
                    helperText="ex: Your Title"
                    fullWidth
                    margin="normal"
                    value={this.state.title}
                    onChange={event =>
                      this.setState({ title: event.target.value })
                    }
                  />
                  <TextField
                    id="detail"
                    label="Detail"
                    helperText="ex: Description Detail"
                    fullWidth
                    margin="normal"
                    value={this.state.description}
                    onChange={event =>
                      this.setState({ description: event.target.value })
                    }
                  />
                  <TextField
                    id="pages"
                    label="Page"
                    helperText="ex: Page Number"
                    fullWidth
                    margin="normal"
                    value={this.state.pages}
                    onChange={event =>
                      this.setState({ pages: Number(event.target.value) })
                    }
                  />
                  <div
                    style={{
                      paddingTop: '1em',
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column'
                    }}>
                    <div>
                      <input
                        accept="image/*"
                        type="file"
                        id="marker"
                        name="marker"
                        style={{ display: 'none' }}
                        onChange={this.handleUploadMarker}
                      />
                      <label htmlFor="marker">
                        <Button
                          variant="raised"
                          component="span"
                          syle={styles.button}>
                          Marker Upload
                        </Button>
                      </label>
                    </div>
                    <div>
                      <input
                        type="file"
                        id="object"
                        placeholder="object"
                        style={{ display: 'none' }}
                        onChange={this.handleUploadObject}
                      />
                      <label htmlFor="object">
                        <br />
                        <Button
                          variant="raised"
                          component="span"
                          syle={styles.button}>
                          Object Upload
                        </Button>
                      </label>
                    </div>
                  </div>
                  <div
                    style={{
                      paddingTop: '4em',
                      display: 'flex',
                      justifyContent: 'center'
                    }}>
                    <div style={{ marginRight: 20 }}>
                      <Button
                        variant="raised"
                        component="span"
                        color="primary"
                        onClick={() => this.handleClickSubmit()}>
                        <i
                          className="fa fa-check-square-o"
                          style={{ marginRight: 10 }}
                        />
                        Save
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="raised"
                        component="span"
                        color="secondary"
                        onClick={() =>
                          this.setState({
                            title: '',
                            detail: '',
                            imageResult: '',
                            patternFileStr: '',
                            patternImage: ''
                          })
                        }>
                        <i
                          className="fa fa-window-close-o"
                          style={{ marginRight: 10 }}
                        />
                        Clear
                      </Button>
                    </div>
                  </div>
                  {this.state.patternFileStr && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        paddingTop: '1.2em'
                      }}>
                      <Button
                        variant="raised"
                        component="span"
                        color="secondary"
                        onClick={this.handleDownload}>
                        <i
                          className="fa fa-cloud-download"
                          style={{ marginRight: 10 }}
                        />
                        Download
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
        <Navigation />
      </div>
    )
  }
}

const styles = {
  root: {
    position: 'fixed',
    overflowY: 'Auto',
    overflowX: 'hidden',
    height: '100vh',
    top: 56,
    width: '100%',
    backgroundColor: '#eee'
  },
  navigation: {
    top: 56
  },
  content: {
    paddingBottom: 120
  },
  button: {
    paddingRight: '20px'
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addDetailObject: payload => dispatch(addObject(payload))
  }
}

const query = gql`
  mutation createObject3D(
    $mid: String!
    $title: String!
    $description: String!
    $pages: Int!
    $marker: String!
    $img_marker: String!
    $object3d: String!
  ) {
    createObject3D(
      mid: $mid
      title: $title
      description: $description
      pages: $pages
      marker: $marker
      img_marker: $img_marker
      object3d: $object3d
    ) {
      id
      mid
      title
      description
      pages
      marker
      img_marker
      object3d
    }
  }
`

const graphqlQuery = graphql(query)(AddObjectScreen)

export default connect(null, mapDispatchToProps)(graphqlQuery)
