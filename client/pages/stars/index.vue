<template>
  <div>
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
      <tr v-for="star in stars" :key="star.id">
        <td class="id">{{ star.id }}</td>
        <td class="name">{{ star.name }}</td>
        <td class="actions">
          <router-link :to="{
            path: `/stars/${star.id}/edit`
          }">Edytuj</router-link>
          <button @click="deleteStar(star.id)">Usuń</button>
          <router-link :to="{
            path: `/stars/${star.id}/details`
          }">Szczegóły</router-link>
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
  beforeMount() {
    this.getStars();
  },
  methods: {
    editStar(starId) {
      // Logika edycji gwiazdy
      console.log('Edytuj gwiazdę o ID:', starId);
    },
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
table {
  width: 40%;
  color: white;
  border-collapse: collapse;
}

a {
  color: white;
  text-decoration: none;
}

a:hover {
  color: navajowhite;
}

th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

th {
  color: black;
}

.id {
  width: 10%;
  text-align: left;
}

.name {
  width: 60%;
  text-align: left;
}

.actions {
  width: 30%;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
