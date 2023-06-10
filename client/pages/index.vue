<template>
  <div class="container">
    <NavHeader :activeIndex="0" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
    ]" />

    <h1>Dashboard</h1>
    <h2>Stars:</h2><br />

    <div class="tiles">
      <ItemTile
        v-for="(star, index) in stars"
        :key="index"
        :id="star.id"
        :name="star.name"
        :description="star.description"
        :url="star.image_url"
        endpoint="stars"
        class="tile"
      />
    </div>


    <h2>Constellations:</h2><br />

    <div class="tiles">
      <ItemTile
        v-for="(constellation, index) in constellations"
        :key="index"
        :id="constellation.id"
        :name="constellation.name"
        :description="constellation.description"
        :url="constellation.image_url"
        endpoint="constellations"
        class="tile"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'IndexPage',
  components: [
    'ItemTile',
    'NavHeader',
  ],
  data() {
    return {
      stars: [],
      constellations: [],
    };
  },
  async fetch() {
    this.stars = await fetch(
      'http://localhost:3001/v1/stars'
    ).then(res => res.json());

    this.constellations = await fetch(
      'http://localhost:3001/v1/constellations'
    ).then(res => res.json());
  },
};
</script>
