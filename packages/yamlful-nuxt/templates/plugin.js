
import Vuex from 'vuex'
import api from './api'

// extendStore adds methods to the Vuex Store
// Works for server and client-side requests
const extendStore = (ctx, obj) => {
  Object.keys(obj).forEach((key) => {
    // Note that all apps that use Vuex.Store in the
    // same global namespace will receive these methods
    Vuex.Store.prototype[key] = obj[key]
  })
}

// inject() makes a property available
// in Nuxt's context and Vue pages
export default (ctx, inject) => {
  const $api = api(ctx.$axios)
  extendStore(ctx, { $api })
  ctx.$api = $api
  inject('api', $api)
}
