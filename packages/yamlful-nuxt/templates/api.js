
export default (client) => ({<%
  for (const resource in options.api) { %><%= `\n  ${resource}` %>: {
  <% for (const method of options.api[resource]) {
    if ('raw' in method) { %>
    <%= method.name %>: <%= method.raw %>,<% } else { %>
    <%= method.name %>: (<%= method.args %>) => {
      return client.<%= method.verb %>(<%= method.endpoint %><%= method.params %>)
    },<% } %><% } %>
  },<% } %>
})
