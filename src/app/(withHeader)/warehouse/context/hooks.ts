import { useContext } from 'react'
import SearchContext from './context'

export const useStore = () => {
  const { state, dispatch } = useContext(SearchContext)

  return { state, dispatch }

}