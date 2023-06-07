<template>
  <div class="">
    <router-link :to="{ path: '/stars' }">Go back</router-link>
    <br />
    <h1>Details - {{ star.name }}</h1>
    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>Nazwa</th>
        <th>Opis</th>
        <th>Widoczność</th>
        <th>Data utworzenia</th>
        <th>Data zaktualizowania</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>{{ star.id }}</td>
        <td>{{ star.name }}</td>
        <td>{{ star.description }}</td>
        <td>{{ star.visible }}</td>
        <td>{{ star.created_at }}</td>
        <td>{{ star.updated_at }}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      star: {},
    };
  },
  created() {
    this.star = this.getStarById(this.$route.params.id);
  },
  methods: {
    async getStarById(starId) {
      await this.$axios
      .get(`http://localhost:3001/v1/stars/${starId}`)
      .then((res) => {
        this.star = res.data[0];
      })
      .catch((error) => console.error(error));
    },
  }
};
</script>

<style scoped>

</style>
