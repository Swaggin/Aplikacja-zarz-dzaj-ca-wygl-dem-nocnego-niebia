<template>
  <div class="container">
    <NavHeader :activeIndex="3" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Stars', 'url': '/stars' },
      { 'label': $route.params.name, 'url': `/stars/${$route.params.id}`, active: true },
    ]" />

    <a href="/constellations" class="add">
      <i class="fa-solid fa-arrow-left"></i>
      Go back
    </a><br />

    <div class="columns">
      <div class="column">
        <h1 class="title title-icon">
          {{ star.name }}
          <a :href="`/stars/${star.id}/edit`">
            <i class="fas fa-pencil-alt"></i>
          </a>
        </h1>
        <p>{{ star.description }}</p>
      </div>
      <div class="column">
        <img
          :src="getImageUrl(star.image_url)"
          alt="image"
          class="image"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      star: {},
    }
  },
  created() {
    this.star = this.getStarById(this.$route.params.id);
  },
  methods: {
    async getStarById(starId) {
      try {
        const response = await this.$axios.get(`http://localhost:3001/v1/stars/${starId}`);
        this.star = response.data[0];
      } catch (error) {
        console.error(error);
      }
    },
    getImageUrl(name) {
      return `../img/${name}`;
    }
  },
}
</script>

<style scoped>

</style>
