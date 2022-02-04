import Promise from 'bluebird'
import transitionPath from 'router5-transition-path'
import findRoutes from '../utils/findRoutes'

/*

  trigger actions when routes become active

*/
const triggerRoute = (routes) => (router, dependencies) => async (toState, fromState, done) => {
  const {
    toActivate,
    toDeactivate,
  } = transitionPath(toState, fromState)
  const { store } = dependencies

  const activeRoutes = findRoutes(routes, toActivate)
  const deactiveRoutes = findRoutes(routes, toDeactivate)

  const activeTriggers = activeRoutes.reduce((all, route) => {
    if(!route.triggers) return all
    if(!route.triggers.activate) return all
    return all.concat([route.triggers.activate])
  }, [])

  const deactiveTriggers = deactiveRoutes.reduce((all, route) => {
    if(!route.triggers) return all
    if(!route.triggers.deactivate) return all
    return all.concat([route.triggers.deactivate])
  }, [])

  deactiveTriggers.forEach(trigger => trigger(store, fromState.params))

  // we block on the activate triggers so things are loaded before the
  // route transitions
  await Promise.each(activeTriggers, async activeTrigger => {
    await activeTrigger(store, toState.params)
  })

  done()
}

export default triggerRoute