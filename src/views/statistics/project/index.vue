<template>
  <div>project view</div>
</template>

<script>
export default {
  name: 'ProjectView',
  mounted() {
    const projectId = this.$route.query.id
    this.getProjectStatistics(projectId)
  },
  methods: {
    getProjectStatistics(projectId) {
      console.log(projectId)
    }
  }
}
</script>

<style scoped>

</style>
