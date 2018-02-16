const initialState = {
  user: {},
  cover: [],
  page: 0
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
    case 'CHANGE_PAGE':
      return { ...state, page: payload.page }
    default:
      return state
  }
}

export default detailCoverReducers
