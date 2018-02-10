import React, { Component } from 'react'
import { loginWithGoogle, loginWithFacebook } from '../helpers/auth'
import { firebaseAuth } from '../config/constants'
import { Button, Grid, Paper } from 'material-ui'

const firebaseAuthKey = 'firebaseAuthInProgress'
const appTokenKey = 'appToken'

class LoginScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      splashScreen: false
    }
    // this.handleGooleLogin = this.handleGooleLogin.bind(this)
  }
  handleGoogleLogin () {
    loginWithGoogle().catch(err => {
      alert(err)
      localStorage.removeItem(firebaseAuth)
    })
    localStorage.setItem(firebaseAuthKey, '1')
  }
  handleFacebookLogin () {
    loginWithFacebook().catch(err => {
      alert(err)
      localStorage.removeItem(firebaseAuth)
      localStorage.setItem(firebaseAuthKey, '1')
    })
  }
  componentWillMount () {
    if (localStorage.getItem(appTokenKey)) {
      this.props.history.push('/home')
      return
    }
    firebaseAuth().onAuthStateChanged(user => {
      if (user) {
        console.log('User signed in: ', JSON.stringify(user))
        localStorage.removeItem(firebaseAuthKey)
        localStorage.setItem(appTokenKey, user.uid)
        this.props.history.push('/home')
      }
    })
  }
  render () {
    return (
      <div style={styles.root}>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <div style={styles.bg}></div>
            <Paper style={styles.paper}>
              <div>
                <img src="./assets/logo.png" alt='logo' style={styles.logo}/>
              </div>
              <div>
                <Button
                  style={styles.btnGoogle}
                  variant='raised'
                  onClick={() => this.handleGoogleLogin()}
                >
                  <i className='fab fa-google' style={{ marginRight: 30 }} />
                  Login With Google
                </Button>
              </div>
              <div>
                <Button
                  style={styles.btnFacebook}
                  variant='raised'
                  onClick={() => this.handleFacebookLogin()}
                >
                  <i
                    className='fab fa-facebook-f'
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
    display: 'flex',
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
    filter: 'blur(5px)',
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

export default LoginScreen
