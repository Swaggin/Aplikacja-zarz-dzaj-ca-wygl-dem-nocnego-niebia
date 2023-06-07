<template>
  <div>
    <h1>Index Page</h1>
    <h2>Stars:</h2>
    <ul>
      <li v-for="star in stars" :key="star.id">
        {{ star }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      stars: [],
    };
  },
  async fetch() {
    this.stars = await fetch(
      'http://localhost:3001/v1/stars'
    ).then(res => res.json());
  },
};
</script>
