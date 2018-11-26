import { resolve } from 'path'

export default {
  // Thanks to Pooya Parsa for the awesome Nuxt Axios module
  // Note that @nuxtjs/axios is automatically required by yamlin
  axios: {
    // Thanks to Ben Howdle for the amazing API testing service!
    baseURL: 'https://reqres.in'
  },
  modules: [
    resolve('..', 'nuxt')
  ]
}
