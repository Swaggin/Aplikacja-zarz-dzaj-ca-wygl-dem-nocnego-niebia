<template>
  <div class="">
    <router-link :to="{ path: '/stars' }">Go back</router-link>
    <br />
    <form method="POST" class="form" @submit.prevent="onSubmit">
      <h1>Add star</h1>
      <h2>Name</h2>
      <input :placeholder="star.name" type="text" v-model="form.name" name="name" />

      <h2>Description</h2>
      <textarea :placeholder="star.description" v-model="form.description" name="description"></textarea>

      <h2>Image URL</h2>
      <input :placeholder="star.image_url" type="text" v-model="form.image_url" name="imageUrl" />

      <h2>Visible</h2>
      <input type="checkbox" v-model="form.visible" name="visible" />
      <br />
      <button type="submit">Save</button>
    </form>
    <div class=""></div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      star: {},
      message: null,
      form: {
        name: null,
        description: null,
        image_url: null,
        visible: false,
      }
    };
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      e.stopPropagation();

      const data = {
        name: this.form.name || this.star.name,
        description: this.form.description || this.star.description,
        imageUrl: this.form.image_url || this.star.image_url,
        visible: this.form.visible ? 1 : 0 || this.star.visible,
      };

      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
      }

      await this.$axios
        .post('http://localhost:3001/v1/stars', formData)
        .then((res) => {
          this.$router.push({ path: '/stars' })
        })
        .catch((error) => console.error(error));
    },
  }
};
</script>

<style scoped>

</style>
