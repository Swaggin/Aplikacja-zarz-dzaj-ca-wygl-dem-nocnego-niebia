<template>
  <div class="container">
    <NavHeader :activeIndex="3" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Constellations', 'url': '/constellations' },
      { 'label': constellation.name, 'url': `/constellations/${$route.params.id}`, active: true },
    ]" />

    <a href="/constellations" class="add">
      <i class="fa-solid fa-arrow-left"></i>
      Go back
    </a><br />

    <div class="columns">
      <div class="column">
        <h1 class="title title-icon">
          {{ constellation.name }}
          <a :href="`/constellations/${constellation.id}/edit`">
            <i class="fas fa-pencil-alt"></i>
          </a>
        </h1>
        <p>{{ constellation.description }}</p>
      </div>
      <div class="column">
        <img
          :src="getImageUrl(constellation.image_url)"
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
      constellation: {},
    }
  },
  created() {
    this.constellation = this.getConstellationById(this.$route.params.id);
  },
  methods: {
    async getConstellationById(constellationId) {
      try {
        const response = await this.$axios.get(`http://localhost:3001/v1/constellations/${constellationId}`);
        this.constellation = response.data[0];
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
