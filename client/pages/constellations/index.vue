<template>
  <div class="container">
    <NavHeader :activeIndex="3" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Constellations', 'url': '/constellations', active: true },
    ]" />

    <div class="add add-constellation">
      <i class="fa-solid fa-plus"></i>
      <a href="/constellations/add">Dodaj konstelację</a>
    </div>
    <h1>Lista Konstelacji</h1>
    <table v-if="constellations.length > 0" >
      <thead>
      <tr>
        <th class="id">ID</th>
        <th class="name">Nazwa</th>
        <th class="actions">Akcje</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(constellation, index) in constellations"
        :key="constellation.id"
        :class="{ 'row-even': index % 2 === 0, 'row-odd': index % 2 !==0}"
      >
        <td class="id">{{ constellation.id }}</td>
        <td class="name">
          <a :href="`/constellations/${constellation.id}`">
            {{ constellation.name }}
          </a>
        </td>
        <td class="actions">
          <div class="actions-items">
            <router-link :to="{
            path: `/constellations/${constellation.id}/edit`
          }">
              <i class="fas fa-pencil-alt"></i>
            </router-link>
            <router-link :to="{
              path: `/constellations/${constellation.id}/details`
            }">
              <i class="fas fa-search"></i>
            </router-link>
            <button @click="deleteConstellation(constellation.id)">
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
      constellations: [],
    };
  },
  components: [
    'NavHeader'
  ],
  beforeMount() {
    this.getConstellations();
  },
  methods: {
    async deleteConstellation(constellationId) {
      console.log(constellationId);

      await this.$axios
      .delete(`http://localhost:3001/v1/constellations/${constellationId}`)
      .then((res) => {
        this.constellations = this.getConstellations();
      })
      .catch((error) => console.error(error));
    },
    async getConstellations() {
      await this.$axios
      .get('http://localhost:3001/v1/constellations')
      .then((res) => {
        this.constellations = res.data;
      })
      .catch((error) => console.error(error));
    },
  },
};
</script>

<style scoped>

</style>
