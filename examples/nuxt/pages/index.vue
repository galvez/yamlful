<template>
  <div>
    <p>Loaded with <b>$api.users.get(1)</b> preloaded in SSR</p>
    <p>{{ user }}</p>
    <button @click="loadTwo">
      Load <b>$api.users.get(2)</b> from the client
    </button>
  </div>
</template>

<script>
export default {
  async asyncData ({ $api }) {
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
      const response = await this.$api.users.get(2)
      this.user = response.data
    }
  }
}
</script>

<style>
p {
  white-space: pre;
  font-family: monospace
}
</style>
