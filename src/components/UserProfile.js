import React, { Component } from 'react'
import Card, { CardContent } from 'material-ui/Card'
import { Button, Grid, Avatar, IconButton } from 'material-ui'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList'
import DeleteIcon from 'material-ui-icons/DeleteForever'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

import Navigation from './Navigation'
import Header from './Header'
import { modifyCover, changeNumber } from '../redux/actions/detailCoverActions'

class UserPofile extends Component {
  componentWillMount () {
    if (!localStorage.userData) {
      return this.props.history.push('/login')
    }
  }
  handleClickLogut () {
    localStorage.clear()
    this.props.changeNumber(0)
    this.props.history.push('/')
  }
  handleClickDelete (id) {
    this.props
      .mutate({
        variables: { id }
      })
      .then(res => {
        let newCover = this.props.fetchCover.filter(
          newData => newData.id !== id
        )
        this.props.modifyCover(newCover)
      })
      .catch(err => console.error(err))
  }

  render () {
    const fetchCover = this.props.fetchCover.filter(
      newData => newData.email === this.props.userProfile.email
    )
    return (
      <div style={styles.root}>
        <Header location={this.props.location.pathname} />
        <div style={{ width: '100%' }}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card style={styles.profile}>
                <CardContent style={styles.row}>
                  <Avatar
                    alt={this.props.userProfile.email}
                    src={this.props.userProfile.avatar}
                    style={styles.avatar}
                  />

                  <p style={{ fontSize: 20, color: 'white' }}>
                    {this.props.userProfile.email}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <div>
                      <Button
                        variant='raised'
                        component='span'
                        color='default'
                        onClick={() => this.handleClickLogut()}
                      >
                        Logout
                        <i
                          className='fa fa fa-sign-out'
                          style={{ paddingLeft: 10 }}
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
        {!fetchCover.length &&
          <div>
            <p>No magazines yet</p>
            <Button
              variant='raised'
              component='span'
              color='secondary'
              onClick={() => {
                this.props.changeNumber(4)
                this.props.history.push('/add-magazine')
              }}
            >
              Create Magazine
            </Button>
          </div>}
        <div style={styles.content}>
          <GridList cellHeight={260} style={styles.gridList}>
            {fetchCover.map((cover, index) => {
              return (
                <GridListTile key={index}>
                  <Link
                    to={`/content/${cover.title}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src={cover.imagePreviewUrl}
                      width={'100%'}
                      height={'100%'}
                      alt={cover.title}
                    />
                  </Link>
                  <GridListTileBar
                    style={{ paddingLeft: 10 }}
                    title={cover.title}
                    actionIcon={
                      <IconButton
                        style={styles.icon}
                        onClick={() => this.handleClickDelete(cover.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              )
            })}
          </GridList>
        </div>
        <Navigation style={styles.navigation} history={this.props.history} />
      </div>
    )
  }
}

const styles = {
  root: {
    position: 'fixed',
    overflowY: 'Auto',
    overflowX: 'hidden',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    height: '100vh',
    top: 56,
    width: '100%',
    backgroundColor: '#eee'
  },
  gridList: {
    padding: '0 2em',
    width: 400,
    height: 510
  },
  icon: {
    color: 'white',
    marginRight: 10
  },
  profile: {
    background: '#1488CC' /* fallback for old browsers */,
    background: '-webkit-linear-gradient(to right, #2B32B2, #1488CC)' /* Chrome 10-25, Safari 5.1-6 */,
    background: 'linear-gradient(to right, #2B32B2, #1488CC)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  },
  content: {
    paddingTop: 5,
    paddingBottom: 120,
    paddingLeft: '0.42em',
    paddingRight: '0.42em'
  },
  navigation: {
    top: 56
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: 10,
    width: 150,
    height: 150
  }
}

const mapDispatchToProps = dispatch => ({
  modifyCover: cover => dispatch(modifyCover(cover)),
  changeNumber: page => dispatch(changeNumber(page))
})

const mapStateToProps = state => {
  return {
    fetchCover: state.detailCoverReducers.cover,
    userProfile: state.detailCoverReducers.user
  }
}

const query = gql`
  mutation deleteMagazine($id: String!) {
    deleteMagazine(id: $id) {
      id
    }
  }
`

const graphqlQuery = graphql(query)(UserPofile)

export default connect(mapStateToProps, mapDispatchToProps)(graphqlQuery)
