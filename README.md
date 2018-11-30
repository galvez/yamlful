
**yamlful** is a utility for **HTTP client code generation** from YAML:

```yaml
sample:
  - method: get
    get: /resource/:id/subresource/:subId
  - method: create
    post: /resource/:id/subresource
  - method: update
    put: /resource/:id/subresource/:subId
  - method: remove
    delete: myresource/
```

It uses a simple pattern to determine _function arguments_ and _HTTP parameters_, so that methods that use `PUT` or `POST` get a payload and others don't, while preserving the URL parameters in each YAML-defined endpoint.

The above YAML file can be used to generate a snippet like this:

```js
const sample = {
  get: (id, subId) => {
    return client.get(`/resource/${id}/subresource/${subId}`)
  },
  create: (id, payload) {
    return client.post(`/resource/${id}/subresource`, payload)
  },
  update: (id, subId, payload) {
    return client.put(`/resource/${id}/subresource/${subId}`, payload)
  },
  remove: (id) => {
    return client.delete(`myresource/${id}`)
  }
```

# Motivation

Boilerplate JavaScript for exposing HTTP API client methods is pretty simple most 
of the time. 

However, when you have a huge API with dozens of different resources, more 
streamlined YAML configuration makes it easier to maintain it while dealing with 
constant change. **yamlful** was born by identifying these key simple patterns 
when connecting JavaScrit methods to JSON HTTP APIs.

# Nuxt.js module

Bundled in this repository is a [Nuxt.js][1] module (`yamlful-nuxt`) that uses 
`yamlful` to generate similar code, integrating itself to [@nuxtjs/axios][2] 
and exposing API methods to Vue pages.

```sh
npm install yamful-nuxt --save
```

In `nuxt.config.js`:

```js
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
```

In `pages/index.vue`:

```js
export default {
  async asyncData ({ $api }) {
    // $api available in SSR context
    const response = await $api.users.get(1)
    return {
      user: response.data
    }
  },
  data: () => ({
    user: {}
  }),
  methods: {
    async loadTwo() {
      // this.$api available in the client context
      const response = await this.$api.users.get(2)
      this.user = response.data
    }
  }
}
```

## Raw methods

The Nuxt.js module also allows you to inline JavaScript in YAML for defining raw methods:

**Input**:

```
  - method: custom
    raw: |
      (customParam) => {
      	client.get(`/customresource/${customParam}`)
      }
```

**Output**:

```
  custom: (customParam) => {
    client.get(`/customresource/${customParam}`)
  }
```

Note that `client` is used to [inject][3] Nuxt's axios instance.

See the [API template][4] used for the Nuxt module.

# Other frameworks

Modules and extensions for other frameworks can be implemented using the main exported function in the `yamlful` package. PRs are very much welcome.

[1]: https://nuxtjs.org
[2]: https://github.com/nuxt-community/axios-module
[3]: https://blog.lichter.io/posts/organize-and-decouple-your-api-calls-in-nuxtjs
[4]: https://github.com/galvez/yamlful/blob/master/packages/yamlful-nuxt/templates/api.js
