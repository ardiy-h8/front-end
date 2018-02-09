import firebase from 'firebase'

const config = {
  apiKey: 'AIzaSyD9bODFcd8NRnPdvXYQCIZaDR6eFGJf6d0',
  authDomain: 'ardy-57606.firebaseapp.com',
  databaseURL: 'https://ardy-57606.firebaseio.com'
}

firebase.initializeApp(config)

export const googleProvider = new firebase.auth.GoogleAuthProvider()
export const facebookProvider = new firebase.auth.FacebookAuthProvider()
export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth
