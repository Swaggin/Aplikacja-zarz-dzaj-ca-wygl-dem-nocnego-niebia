<template>
  <div class="">
    <router-link :to="{ path: '/stars' }">Go back</router-link>
    {{ $route.params.description }}
  </div>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>

</style>
