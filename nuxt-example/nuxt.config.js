export default {
  // Thanks to Pooya Parsa for the awesome Nuxt Axios module
  // Note that @nuxtjs/axios is automatically required by yamlin
  axios: {
    // Thanks to Ben Howdle for the amazing API testing service
    baseURL: 'https://reqres.in/'
  },
  // By default, yamlful will look for .yml files in Nuxt's srcDir
  modules: ['yamlful-nuxt']
}
