import axios from 'axios'

export const getUser = user => ({
  type: 'GET_USER',
  payload: { user }
})

const url = 'http://localhost:3001/graphql'
const queryAllMagazines = `
  query {
    allMagazines {
      id title cover object3d
    }
  }
`
const payloadAllMagazines = {
  method: 'POST',
  headers: {
    Accept: 'application/graphql',
    'Content-Type': 'application/graphql'
  },
  body: queryAllMagazines
}

export const fetchAllMagazines = () => async (dispatch, getState) => {
  try {
    const response = await axios.post(url, {
      query: `
      query {
        allMagazines {
          id title imagePreviewUrl object3d {
            id mid title description pages marker img_marker object3d
          }
        }
      }
    `
    })

    const { data: { data: { allMagazines } } } = response
    dispatch(getAllMagazines(allMagazines))
  } catch (err) {
    console.error(err)
  }
}

const getAllMagazines = magazines => ({
  type: 'FETCH_MAGAZINES',
  payload: { magazines }
})

export const input_data_detail_cover = cover => {
  return (dispatch, getState) => {
    dispatch({
      type: 'ADD_DETAIL_COVER',
      payload: { cover }
    })
  }
}

export const modifyCover = cover => ({
  type: 'MODIFY_COVER',
  payload: { cover }
})

export const input_data_object = object => {
  return (dispatch, getState) => {
    dispatch({
      type: 'ADD_OBJECT',
      payload: { object }
    })
  }
}
