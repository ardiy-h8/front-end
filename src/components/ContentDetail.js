import React, { Component } from 'react'
import Card, {
  CardMedia,
  CardContent,
  CardActions
} from 'material-ui/Card'
import {
  Button,
  Grid,
  Avatar,
  Divider,
  ListItemSecondaryAction,
  IconButton
} from 'material-ui'
import List, {
  ListItem,
  ListItemText,
} from 'material-ui/List'
import DeleteIcon from 'material-ui-icons/Delete'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Navigation from './Navigation'
import Header from './Header'
import { modifyCover } from '../redux/actions/detailCoverActions'

class ContentDetail extends Component {
  handleDelete (id) {
    this.props
      .mutate({
        variables: { id }
      })
      .then(res => {
        let newCover = this.props.fetchCover.map(cover => {
          return {
            ...cover,
            object3d: cover.object3d.filter(newData => newData.id !== id)
          }
        })
        this.props.modifyCover(newCover)
      })
      .catch(err => console.error(err))
  }

  render () {
    const data = this.props.fetchCover
    let filterCover = data.filter(
      newData =>
        newData.title.toLocaleLowerCase() ===
        this.props.match.params.name.toLocaleLowerCase()
    )
    return (
      <div style={styles.root}>
        <Header location={this.props.location.pathname} />
        <div style={styles.content}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card>
                <CardMedia
                  style={styles.media}
                  image={filterCover[0].imagePreviewUrl}
                  title={filterCover[0].title}
                />
                <CardContent>
                  <List component='nav'>
                    {filterCover[0].object3d.length
                      ? filterCover[0].object3d.map((object, index) => {
                        return (
                          <div key={index}>

                            <ListItem>

                              <Avatar
                                alt='Eric Hoffman'
                                src={object.img_marker}
                                />
                              <Link
                                to={`/sketch/${object.id}`}
                                style={{ textDecoration: 'none' }}
                                >
                                <ListItemText
                                  inset
                                  primary={
                                      object.pages + ' - ' + object.title
                                    }
                                  secondary={object.description}
                                  />

                              </Link>
                              {filterCover[0].email ===
                                  this.props.userProfile.email &&
                                  <ListItemSecondaryAction>
                                    <IconButton
                                      aria-label='Delete'
                                      color='secondary'
                                      onClick={() =>
                                        this.handleDelete(object.id)}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </ListItemSecondaryAction>}
                            </ListItem>
                            <Divider />
                          </div>
                        )
                      })
                      : 'No objects yet'}
                  </List>
                </CardContent>
                {filterCover[0].email === this.props.userProfile.email &&
                  <CardActions>
                    <div style={styles.button}>
                      <Link
                        to={`/add-object/${filterCover[0].id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Button variant='raised' color='primary'>
                          Add Marker
                        </Button>
                      </Link>
                    </div>
                  </CardActions>}
              </Card>
            </Grid>
          </Grid>
          <Navigation style={styles.navigation} history={this.props.history} />
        </div>
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
  media: {
    height: 300
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto'
  }
}

const mapStateToProps = state => {
  return {
    fetchCover: state.detailCoverReducers.cover,
    userProfile: state.detailCoverReducers.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    modifyCover: cover => dispatch(modifyCover(cover))
  }
}

const query = gql`
  mutation deleteObject3D($id: String!) {
    deleteObject3D(id: $id) {
      id
    }
  }
`

const graphqlQuery = graphql(query)(ContentDetail)

export default connect(mapStateToProps, mapDispatchToProps)(graphqlQuery)
