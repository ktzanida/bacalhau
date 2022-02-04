import { useSelector } from 'react-redux'
import routerSelectors from '../store/selectors/router'
import routes from '../router/routes'
import findRoute from '../router/utils/findRoute'

const useRoute = () => {
  const route = useSelector(routerSelectors.route)
  return findRoute(routes, route.name)
}

export default useRoute