
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

It uses a simple pattern to determine _function arguments_ and _HTTP parameters_, so that methods that use `PUT` or `POST` get a payload and others don't, while always preserving the URL parameters defined in each YAML-defined endpoint. The above YAML file can be used to generate a snippet like this:

```js
const sample = {
  get: (id, subId) => {
    return client.get(`/resource/${id}/subresource/${subId}`)
  },
  create: (id, post) {
    return client.post(`/resource/${id}/subresource`)
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
of the time. However, when you have a huge API with dozens of different resources, 
more streamlined YAML configuration makes it easier to maintain it while dealing 
with constant change. **yamlful** was born by identifying these key simple patterns 
when connecting JavaScrit methods to JSON HTTP APIs.

# Nuxt.js module

Bundled with this package is a [Nuxt.js][1] module (`yamlful/nuxt`) that uses 
yamful to generate similar code, integrating itself to [@nuxtjs/axios][2] 
and exposing API methods to Vue pages. See the `example` directory for a 
sample Nuxt yamlful app.

```js
import { yamlful } from 'yamlful/nuxt'

export default {
  // Thanks to Pooya Parsa for the awesome Nuxt Axios module
  // Note that @nuxtjs/axios is automatically required by yamlin
  axios: {
    // Thanks to Ben Howdle for the amazing API testing service
    baseURL: 'https://reqres.in/'
  },
  // By default, yamlful will look for .yml files in Nuxt's srcDir
  modules: [ yamlful ]
}
```

Modules and extensions for other frameworks can be implemented using the main exported function in the `yamful` package. PRs are very much welcome.

## Raw methods

You can also inline JavaScript in YAML for defining raw methods:

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

See the [API template][3] used for the Nuxt module.

[1]: https://nuxtjs.org
[2]: https://github.com/nuxt-community/axios-module
[3]: https://github.com/nuxt-community/axios-module
