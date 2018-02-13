const initialState = {
  user: {},
  cover: []
}

const detailCoverReducers = (state = initialState, { type, payload }) => {
  switch (type) {
    case 'GET_USER':
      return { ...state, user: payload.user }
    case 'FETCH_MAGAZINES':
      return { ...state, cover: payload.magazines }
    case 'ADD_DETAIL_COVER':
      return { ...state, cover: state.cover.concat(payload.cover) }
    case 'MODIFY_COVER':
      return { ...state, cover: payload.cover }
    default:
      return state
  }
}

export default detailCoverReducers
