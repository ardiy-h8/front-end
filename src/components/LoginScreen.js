import React, { Component } from 'react'
import { Button, Grid, Paper } from 'material-ui'
import { connect } from 'react-redux'

import { getUser } from '../redux/actions/detailCoverActions'
import { loginWithGoogle, loginWithFacebook } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'

const firebaseAuthKey = 'firebaseAuthInProgress'
const appTokenKey = 'appToken'

class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      splashScreen: false
    }
    // this.handleGooleLogin = this.handleGooleLogin.bind(this)
  }

  handleGoogleLogin() {
    loginWithGoogle().catch(err => {
      alert(err)
      localStorage.removeItem(firebaseAuth)
    })
    localStorage.setItem(firebaseAuthKey, '1')
  }

  handleFacebookLogin() {
    loginWithFacebook().catch(err => {
      alert(err)
      localStorage.removeItem(firebaseAuth)
      localStorage.setItem(firebaseAuthKey, '1')
    })
  }

  componentWillMount() {
    if (localStorage.getItem('userData')) {
      return this.props.history.push('/')
    }

    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        let objUserData = {
          email: user.email,
          avatar: user.photoURL
        }
        localStorage.removeItem(firebaseAuthKey)
        localStorage.setItem('userData', JSON.stringify(objUserData))
        this.props.history.push('/')
        this.props.getUser({
          email: user.email,
          avatar: user.photoURL
        })
      }
    })
  }

  render() {
    return (
      <div style={styles.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <div style={styles.bg} />
            <Paper style={styles.paper}>
              <div>
                <img src="./assets/logo.png" alt="logo" style={styles.logo} />
              </div>
              <div>
                <Button
                  style={styles.btnGoogle}
                  variant="raised"
                  onClick={() => this.handleGoogleLogin()}>
                  <i className="fab fa-google" style={{ marginRight: 30 }} />
                  Login With Google
                </Button>
              </div>
              <div>
                <Button
                  style={styles.btnFacebook}
                  variant="raised"
                  onClick={() => this.handleFacebookLogin()}>
                  <i
                    className="fab fa-facebook-f"
                    style={{ marginRight: 30 }}
                  />
                  Login With Facebook
                </Button>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </div>
    )
  }
}

const styles = {
  root: {
    display: 'flex'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    zIndex: 9999
  },
  bg: {
    position: 'fixed',
    background: `url('./assets/login-bg.jpg') no-repeat center center fixed`,
    backgroundSize: 'cover',
    height: '100%',
    width: '100%',
    filter: 'blur(5px)'
  },
  btnGoogle: {
    marginTop: 20,
    width: 300,
    backgroundColor: '#EA4335',
    textAlign: 'left',
    color: 'white'
  },
  btnFacebook: {
    marginTop: 20,
    width: 300,
    backgroundColor: '#3b5998',
    color: 'white'
  },
  logo: {
    width: 180,
    position: 'relative'
  }
}

const mapDispatchToProps = dispatch => ({
  getUser: user => dispatch(getUser(user))
})

export default connect(null, mapDispatchToProps)(LoginScreen)
