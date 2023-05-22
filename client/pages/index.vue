<template>
  <div>
    {{ stars }}
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
      'http://localhost:3001/stars/5'
    ).then(res => res.json())
  },
};
</script>
