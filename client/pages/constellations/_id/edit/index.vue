
<template>
  <div class="container">
    <NavHeader :activeIndex="3" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Constellations', 'url': '/constellations' },
      { 'label': 'Edit', 'url': `/constellations/${$route.params.id}/edit` },
      { 'label': constellation.name, 'url': `/constellations/${$route.params.id}/edit`, active: true },
    ]" />

    <a href="/constellations" class="add">
      <i class="fa-solid fa-arrow-left"></i>
      Go back
    </a><br />

    <form method="PUT" class="form" @submit.prevent="onSubmit">
      <h1>Edit {{ constellation.name }}</h1>
      <h3>Name</h3>
      <input :placeholder="constellation.name" type="text" v-model="form.name" name="name" />

      <h3>Description</h3>
      <textarea :placeholder="constellation.description" v-model="form.description" name="description"></textarea>

      <h3>Image URL</h3>
      <input :placeholder="constellation.image_url" type="text" v-model="form.image_url" name="imageUrl" />

      <h3>Visible</h3>
      <input type="checkbox" v-model="form.visible" name="visible" />
      <br />

      <form method="POST" class="form" @submit.prevent="addStar" ref="addform">
        <h3>Add stars</h3>
        <br />
        <select v-model="add.id" name="star">
          <option v-for="(item, index) in empty" :key="index" :value="item.id">
            {{ item.name }}
          </option>
        </select>
        <button type="submit">Add star</button>
      </form>
      <h3>Stars in constellation</h3>
      <table>
        <thead>
        <tr>
          <th class="id">ID</th>
          <th class="name">Name</th>
          <th class="actions">Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="star in stars" :key="star.id">
          <td class="id">
            {{ star.id }}
          </td>
          <td class="name">
            {{ star.name }}</td>
          <td class="actions">
            <button @click="deleteStar(star.id)">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>

        </tbody>
      </table>
      <br />
      <button type="submit" class="add">
        <i class="fa-solid fa-floppy-disk"></i>
        Save
      </button>
    </form>

    <div class="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      constellation: {},
      message: null,
      form: {
        name: null,
        description: null,
        image_url: null,
        visible: false,
      },
      add: {
        id: null,
      },
      remove: {
        id: null,
      },
      stars: [],
      empty: [],
      selectedStars: [],
    };
  },
  computed: {
    getSelectedStars() {
      return localStorage.getItem('selectedStars') || [];
    },
  },
  created() {
    this.constellation = this.getConstellationById(this.$route.params.id);

    this.getStars().then((res) => {
      this.getStarsWithoutConstellation(this.$route.params.id);
    });
  },
  methods: {
    async getConstellationById(constellationId) {
      await this.$axios
      .get(`http://localhost:3001/v1/constellations/${constellationId}`)
      .then((res) => {
        this.constellation = res.data[0];
      })
      .catch((error) => console.error(error));
    },
    async getStarsByConstellationId(constellationId) {
      try {
        const response = await this.$axios.get(`http://localhost:3001/v1/constellations/${constellationId}/stars`);
        return response.data;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    async getStars() {
      try {
        const response = await this.$axios.get('http://localhost:3001/v1/stars/');

        response.data.forEach((item) => {
          if (item.id !== this.constellation.id) this.empty.push(item);
          else this.stars.push(item);
        });
      } catch (error) {
        console.error(error);
      }
    },
    // TODO: refactor
    async getStarsWithoutConstellation(constellationId) {
      try {
        const response = await this.$axios.get(`http://localhost:3001/v1/constellations/${constellationId}/stars`);
        const constellationStars = response.data;
        const starsWithConstellationResponse = await this.$axios.get('http://localhost:3001/v1/star_constellation');
        const starsResponse = await this.$axios.get('http://localhost:3001/v1/stars');
        const stars = starsResponse.data;

        this.stars = stars.filter((star) => {
          return constellationStars.some((cs) => cs.star_id === star.id);
        });

        const starsWithoutConstellation = starsResponse.data.filter((star) => {
          return !starsWithConstellationResponse.data.some((sc) => sc.star_id === star.id);
        });

        this.empty = starsWithoutConstellation;
      } catch (error) {
        console.error(error);
      }
    },
    async getStarById(starId) {
      await this.$axios
      .get(`http://localhost:3001/v1/stars/${starId}`)
      .then((res) => {
        return res.data[0];
      })
      .catch((error) => console.error(error));
    },
    async onSubmit(e) {
      e.preventDefault();
      e.stopPropagation();

      const data = {
        id: this.constellation.id,
        name: this.form.name || this.constellation.name,
        description: this.form.description || this.constellation.description,
        imageUrl: this.form.image_url || this.constellation.image_url,
        visible: this.form.visible ? 1 : 0 || this.constellation.visible,
        stars: this.stars || [],
      };

      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        if (key === 'stars') {
          value.forEach((starId) => {
            formData.append('stars[]', starId);
          });
        } else {
          formData.append(key, value);
        }
      }

      await this.$axios
        .put('http://localhost:3001/v1/constellations', formData)
        .then((res) => {
          this.message = res.data;
        })
        .catch((error) => console.error(error));
    },
    async addStar(e) {
      try {
        await this.$axios.post(`http://localhost:3001/v1/constellations/${this.add.id}/${this.constellation.id}`);
        await this.$axios.get(`http://localhost:3001/v1/stars/${this.add.id}/`).then((res) => {
          this.stars.push(res.data[0]);
          this.$refs.addform.reset();

          const empty = this.empty.filter((item) => {
            return item.id !== this.add.id;
          });

          this.empty = empty;
        });
      } catch (error) {
        console.error(error);
      }
    },
    async deleteStar(starId) {
      try {
        await this.$axios.delete(`http://localhost:3001/v1/constellations/${this.constellation.id}/${starId}`);

        const star = this.stars.filter((item) => item.id === starId);
        this.empty.push(star[0]);

        this.stars = this.stars.filter((star) => star.id !== starId);
      } catch (error) {
        console.error(error);
      }},
  }
};
</script>

<style scoped>

</style>
