<template>
  <div class="container">
    <NavHeader :activeIndex="2" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Stars', 'url': '/stars', active: true },
    ]" />

    <div class="add add-star">
      <i class="fa-solid fa-plus"></i>
      <a href="/stars/add">Dodaj gwiazdę</a>
    </div>

    <h1>Lista Gwiazd</h1>

    <table v-if="stars.length > 0" >
      <thead>
      <tr>
        <th class="id">ID</th>
        <th class="name">Nazwa</th>
        <th class="actions">Akcje</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(star, index) in stars" :key="star.id" :class="{ 'row-even': index % 2 === 0, 'row-odd': index % 2 !==0}">
        <td class="id">{{ star.id }}</td>
        <td class="name">
          <a :href="`/stars/${star.id}`">
            {{ star.name }}
          </a>
        </td>
        <td class="actions">
          <div class="actions-items">
            <router-link
              :to="{ path: `/stars/${star.id}/edit`}"
            >
              <i class="fas fa-pencil-alt"></i>
            </router-link>

            <router-link :to="{
              path: `/stars/${star.id}/details`}"
            >
              <i class="fas fa-search"></i>
            </router-link>

            <button @click="deleteStar(star.id)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      stars: [],
    };
  },
  components: [
    'NavHeader'
  ],
  beforeMount() {
    this.getStars();
  },
  methods: {
    async deleteStar(starId) {
      await this.$axios
      .delete(`http://localhost:3001/v1/stars/${starId}`)
      .then((res) => {
        this.stars = this.getStars();
      })
      .catch((error) => console.error(error));
    },
    async getStars() {
      await this.$axios
      .get('http://localhost:3001/v1/stars')
      .then((res) => {
        this.stars = res.data;
      })
      .catch((error) => console.error(error));
    },
  },
};
</script>

<style scoped>

</style>
