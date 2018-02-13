const initialState = {
  objectReducers: null
}

const objectReducers = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_OBJECT':
      return { ...state, objectReducers: action.payload.object }
    default:
      return state
  }
}

export default objectReducers
