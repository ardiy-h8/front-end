import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

import detailCoverReducers from './reducers/detailCoverReducers'
import objectReducers from './reducers/objectReducers'

const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const reducers = combineReducers({
  detailCoverReducers,
  objectReducers
})

const middleware = applyMiddleware(thunk, logger)
const enhancer = composeEnchancers(middleware)
const store = createStore(reducers, enhancer)

export default store
