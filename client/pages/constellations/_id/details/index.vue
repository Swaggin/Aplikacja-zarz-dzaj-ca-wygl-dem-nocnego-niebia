<template>
  <div class="container">
    <NavHeader :activeIndex="3" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Constellations', 'url': '/constellations' },
      { 'label': constellation.name, 'url': `/constellations/${$route.params.id}/add`, active: true },
    ]" />

    <a href="/constellations" class="add">
      <i class="fa-solid fa-arrow-left"></i>
      Go back
    </a><br />

    <h1>Details - {{ constellation.name }}</h1>
    <table>
      <thead>
      <tr>
        <th class="id">ID</th>
        <th>Nazwa</th>
        <th>Opis</th>
        <th>Widoczność</th>
        <th>Data utworzenia</th>
        <th>Data zaktualizowania</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td class="id">{{ constellation.id }}</td>
        <td>{{ constellation.name }}</td>
        <td>{{ constellation.description }}</td>
        <td>{{ constellation.visible }}</td>
        <td>{{ parseDate(constellation.created_at) }}</td>
        <td>{{ parseDate(constellation.updated_at) }}</td>
      </tr>
      </tbody>
    </table>
    <br /><br />
    <h1>Gwiazdy w konstelacji {{ constellation.name }}</h1>
    <table v-if="current.length > 0">
      <thead>
      <tr>
        <th class="id">ID</th>
        <th>Nazwa</th>
        <th>Opis</th>
        <th>Widoczność</th>
        <th>Data utworzenia</th>
        <th>Data zaktualizowania</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(star, index) in current"
        :key="index"
        :class="{ 'row-even': index % 2 === 0, 'row-odd': index % 2 !==0}"
      >
        <td class="id">{{ star.id }}</td>
        <td>{{ star.name }}</td>
        <td>{{ star.description }}</td>
        <td>{{ star.visible }}</td>
        <td>{{ parseDate(star.created_at) }}</td>
        <td>{{ parseDate(star.updated_at) }}</td>
      </tr>
      </tbody>
    </table>
    <div class="empty" v-else>
      <i class="fa-regular fa-folder-open"></i>
      Brak przypisanych gwiazd.
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      constellation: {},
      constellationStars: [],
      stars: [],
      current: [],
    };
  },
  created() {
    this.constellation = this.getConstellationById(this.$route.params.id);
    this.stars = this.getStars().then(() => {
      this.constellationStars = this.getStarsByConstellationId(this.$route.params.id);
    });
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
    async getStars() {
      try {
        const response = await this.$axios.get('http://localhost:3001/v1/stars/');
        this.stars = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async getStarsByConstellationId(constellationId) {
      const response = await this.$axios.get(`http://localhost:3001/v1/constellations/${constellationId}/stars`);
      this.constellationStars = response.data;
      this.current = this.stars.filter((star) => this.constellationStars.some((cs) => cs.star_id === star.id));
    },
    parseDate(date) {
      const parsed = new Date(date);

      const day = parsed.getUTCDay() < 10 ? `0${parsed.getDay()}` : parsed.getDay();
      const month =  parsed.getMonth() < 10 ? `0${parsed.getMonth()}` : parsed.getMonth();
      const year =  parsed.getFullYear();

      const hour = parsed.getHours() < 10 ? `0${parsed.getHours()}` : parsed.getHours();
      const minute = parsed.getMinutes() < 10 ? `0${parsed.getMinutes()}` : parsed.getMinutes();
      const second = parsed.getSeconds() < 10 ? `0${parsed.getSeconds()}` : parsed.getSeconds();

      return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
    }
  },
};
</script>

<style scoped>

</style>
