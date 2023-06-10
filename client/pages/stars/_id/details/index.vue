<template>
  <div class="container">
    <NavHeader :activeIndex="2" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Stars', 'url': '/Stars' },
      { 'label': 'Details', 'url': `/constellations/${star.name}/details`, active: true },
      { 'label': star.name, 'url': `/constellations/${star.name}/details`, active: true },
    ]" />

    <a href="/constellations" class="add">
      <i class="fa-solid fa-arrow-left"></i>
      Go back
    </a><br />

    <h1>Details - {{ star.name }}</h1>
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
        <td class="id">{{ star.id }}</td>
        <td>{{ star.name }}</td>
        <td>{{ star.description }}</td>
        <td>{{ star.visible }}</td>
        <td>{{ parseDate(star.created_at) }}</td>
        <td>{{ parseDate(star.updated_at) }}</td>
      </tr>
      </tbody>
    </table><br /><br />

    <h1>Konstelacja {{ constellation[0]?.name }}</h1>
    <table v-if="constellation.length > 0">
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
        :class="{ 'row-even': index % 2 === 0, 'row-odd': index % 2 !==0}"
      >
        <td class="id">{{ constellation[0]?.id }}</td>
        <td>{{ constellation[0]?.name }}</td>
        <td>{{ constellation[0]?.description }}</td>
        <td>{{ constellation[0]?.visible }}</td>
        <td>{{ parseDate(constellation[0]?.created_at) }}</td>
        <td>{{ parseDate(constellation[0]?.updated_at) }}</td>
      </tr>
      </tbody>
    </table>
    <div class="empty" v-else>
      <i class="fa-regular fa-folder-open"></i>
      Brak przypisanej konstelacji.
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      star: {},
      constellation: {},
    };
  },
  created() {
    this.star = this.getStarById(this.$route.params.id);
    this.constellation = this.getConstellationByStarId1(this.$route.params.id);
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
    async getConstellationByStarId1(starId) {
      try {
        const response = await this.$axios
          .get(`http://localhost:3001/v1/stars/${starId}/constellation`);

        const { data } = response;
        const { constellation_id: id } = data[0]

        const constellationResponse = await this.$axios
          .get(`http://localhost:3001/v1/constellations/${id}`);

        this.constellation = constellationResponse.data;
      } catch (error) {
        console.error(error);
      }
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
