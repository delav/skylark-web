<template>
  <div>group view</div>
</template>

<script>
export default {
  name: 'GroupView',
  mounted() {
    const groupId = this.$route.params.id
    this.getGroupStatistics(groupId)
  },
  methods: {
    getGroupStatistics(groupId) {
      console.log(groupId)
    }
  }
}
</script>

<style scoped>

</style>
