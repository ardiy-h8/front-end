import React, { Component } from 'react';
import { graphql } from 'react-apollo'
import gql from 'graphql-tag';

const decodeBase64Image = image => {
  const matches = image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

  if (!matches) return false
  return {
    mimetype: matches[1],
    buffer: Buffer.from(matches[2], 'base64')
  }
}

class App extends Component {
  state = {
    title: '',
    description: '',
    pages: 1,
    marker: '',
    imgMarker: 'asdasd',
    object3d: ''
  }

  handleFile(event) {
    const files = event.target.files

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = event => {
        const data = decodeBase64Image(event.target.result)
        if (data) {
          this.setState({marker: event.target.result})
        } else {
          this.setState({object3d: event.target.result})
        }
      }
      reader.readAsDataURL(files[i]);
    }
  }

  handleUpload() {
    const { title, description, pages, marker, imgMarker, object3d } = this.state
    console.log(this.state)

    this.props
      .mutate({
        variables: { title, description, pages, marker, imgMarker, object3d }
      })
      .then(({ data }) => console.log('got data', data))
      .catch(err => console.log('got error', err))
  }

  render() {
    return (
      <div>
        <input
          placeholder='Title'
          onChange={e => this.setState({title: e.target.value})}
        />
        <input
          placeholder='Description'
          onChange={e => this.setState({description: e.target.value})}
        />
        <br />
        <input
          style={{display: 'none'}}
          type='file'
          accept='image/*'
          onChange={this.handleFile.bind(this)}
          ref={input => this.cover = input}
        />
        <input
          style={{display: 'none'}}
          type='file'
          accept='xml/*'
          onChange={this.handleFile.bind(this)}
          ref={input => this.dae = input}
        />

        <button onClick={() => this.cover.click()}>Add image</button>
        <button onClick={() => this.dae.click()}>Add dae</button>
        <button onClick={this.handleUpload.bind(this)}>Upload file</button>
      </div>
    );
  }
}

const query = gql`
  mutation createObject3D(
    $title: String!,
    $description: String!,
    $pages: Int!,
    $marker: String!,
    $imgMarker: String!,
    $object3d: String!
  ) {
    createObject3D (
      title: $title,
      description: $description,
      pages: $pages,
      marker: $marker,
      img_marker: $imgMarker,
      object3d: $object3d
    ) {
      id title description pages marker img_marker object3d
    }
  }
`

export default graphql(query)(App);
