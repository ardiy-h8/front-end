import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import GridList, { GridListTile, GridListTileBar } from 'material-ui/GridList'

import {
  fetchAllMagazines,
  getUser,
  modifyCover
} from '../redux/actions/detailCoverActions'
import Navigation from './Navigation'
import Header from './Header'

class HomeScreen extends Component {
  componentWillMount() {
    this.props.fetchAllMagazines()
    let objUserData = localStorage.userData
    if (objUserData) {
      objUserData = JSON.parse(objUserData)
      this.props.getUser(objUserData)
    } else {
      this.props.getUser({ email: '' })
    }
  }

  handleDelete(id) {
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

  render() {
    const fetchCover = this.props.fetchCover

    return (
      <div style={styles.root}>
        <Header location={this.props.location.pathname} />
        <div style={styles.content}>
          <GridList cellHeight={260} style={styles.gridList}>
            {fetchCover.map((cover, index) => {
              return (
                <GridListTile key={index}>
                  <Link
                    to={`/content/${cover.title}`}
                    style={{ textDecoration: 'none' }}>
                    <img
                      src={cover.imagePreviewUrl}
                      width={'100%'}
                      height={'100%'}
                      alt={cover.title}
                    />
                    <GridListTileBar
                      style={{ paddingLeft: 10 }}
                      title={cover.title}
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
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#eee'
  },
  gridList: {
    padding: '0 2em',
    width: 400,
    height: 510
  },
  content: {
    paddingBottom: 120,
    paddingTop: 63,
    paddingLeft: '0.42em',
    paddingRight: '0.42em'
  },
  media: {
    height: 300
  },
  navigation: {
    top: 56
  }
}

const mapStateToProps = state => ({
  fetchCover: state.detailCoverReducers.cover
})

const mapDispatchToProps = dispatch => ({
  fetchAllMagazines: () => dispatch(fetchAllMagazines()),
  getUser: user => dispatch(getUser(user)),
  modifyCover: cover => dispatch(modifyCover(cover))
})

const query = gql`
  mutation deleteMagazine($id: String!) {
    deleteMagazine(id: $id) {
      id
    }
  }
`

const graphqlQuery = graphql(query)(HomeScreen)

export default connect(mapStateToProps, mapDispatchToProps)(graphqlQuery)
