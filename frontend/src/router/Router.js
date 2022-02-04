import React from 'react'
import { useSelector } from 'react-redux'
import Route from './Route'
import RouteContext from './RouteContext'
import Loading from '../components/system/Loading'

import routerSelectors from '../store/selectors/router'

import Layout from 'pages/Layout'
import Home from 'pages/Home'

const Router = ({

}) => {
  const route = useSelector(routerSelectors.route)

  if(!route) {
    return (
      <Loading />
    )
  }
  return (
    <RouteContext.Provider value={ route.name }>
      <Layout
        size="small"
      >
        <Route segment="notfound" exact>
          <NotFound />
        </Route>
        <Route segment="home" exact>
          <Home />
        </Route>
      </Layout>
    </RouteContext.Provider>
  )
}

export default Router
