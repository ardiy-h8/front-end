import {
  firebaseAuth,
  googleProvider,
  facebookProvider
} from '../config/constants'

export const loginWithGoogle = () => {
  return firebaseAuth().signInWithPopup(googleProvider)
}

export const loginWithFacebook = () => {
  return firebaseAuth().signInWithPopup(facebookProvider)
}

function authenticate (promise) {
  return promise
    .then(result => {
      let token = result.credential.accessToken
      let user = result.user

      localStorage.setItem('firebaseUser', JSON.stringify(result))
      return Promise.resolve(result)
    })
    .catch(error => {
      let errCode = error.code
      let errMsg = error.message
      let email = error.email
      let credential = error.credential
      alert('failed firebase login' + error)
      return Promise.reject('err')
    })
}

function loginWithFirebase (provider) {
  return firebaseAuth().signInWithPopup(provider)
}

export const logout = () => firebaseAuth().signOut()
