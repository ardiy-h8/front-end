import React, { Component } from 'react'
import Card, { CardHeader, CardMedia, CardContent } from 'material-ui/Card'
import {
  Button,
  Grid,
  Paper,
  ButtonBase,
  Avatar,
  Typography,
  IconButton
} from 'material-ui'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList'
import Subheader from 'material-ui/List/ListSubheader'
import InfoIcon from 'material-ui-icons/Info'
import DeleteIcon from 'material-ui-icons/DeleteForever'

import Navigation from './Navigation'
import Header from './Header'

class UserPofile extends Component {
  componentWillMount () {
    if (!localStorage.userData) {
      return this.props.history.push('/login')
    }
  }
  handleClickLogut () {
    localStorage.clear()
  }
  handleClickDelete () {
    console.log('delete')
  }

  render () {
    const fetchCover = this.props.fetchCover
    return (
      <div style={styles.root}>
        <Header location={this.props.location.pathname} />
        <div style={{ width: '100%' }}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <Card style={styles.profile}>
                <CardContent style={styles.row}>
                  <Avatar
                    alt='Remy Sharp'
                    src='https://www.bigmouthvoices.com/profile_picture/large/default-profile_picture.jpg'
                    style={styles.avatar}
                  />

                  <p style={{ fontSize: 20, color: 'white' }}>
                    Joko Sampurno Widodo
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <div>
                      <Button variant='raised' component='span' color='default'>
                        Logout
                        <i
                          className='fa fa fa-sign-out'
                          style={{ paddingLeft: 10 }}
                          onClick={() => this.handleClickLogut()}
                        />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
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
                    <GridListTileBar
                      style={{ paddingLeft: 10 }}
                      title={cover.title}
                      actionIcon={
                        <IconButton
                          style={styles.icon}
                          onClick={() => this.handleClickDelete()}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    />
                  </Link>
                </GridListTile>
              )
            })}
          </GridList>
        </div>
        <Navigation style={styles.navigation} />
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
    color: 'white'
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

const mapStateToProps = state => {
  return {
    fetchCover: state.detailCoverReducers.cover
  }
}

export default connect(mapStateToProps)(UserPofile)
