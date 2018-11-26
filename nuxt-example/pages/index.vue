<template>
  <div>
    <p>Loaded with <b>$api.users.get(1)</b> in SSR context</p>
    <p class="code">{{ user }}</p>
    <button @click="loadTwo">
      Load <b>$api.users.get(2)</b> from client
    </button>
  </div>
</template>

<script>
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
</script>

<style>
.code {
  white-space: pre;
  font-family: monospace;
}
</style>
