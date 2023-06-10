<template>
  <div class="container">
    <NavHeader :activeIndex="2" />

    <BreadCrumbs :items="[
      { 'label': 'Dashboard', 'url': '/' },
      { 'label': 'Stars', 'url': '/Stars' },
      { 'label': 'Add', 'url': `/constellations/add`, active: true },
    ]" />

    <a href="/constellations" class="add">
      <i class="fa-solid fa-arrow-left"></i>
      Go back
    </a><br />

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
      <button @click="$emit('show-message')" type="submit" class="add">
        <i class="fa-solid fa-floppy-disk"></i>
        Save
      </button>
    </form>
    <div v-if="showMessage" class="message-box">
      {{ message }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      showMessage: false,
      star: {},
      message: '',
      form: {
        name: null,
        description: null,
        image_url: null,
        visible: false,
      }
    };
  },
  mounted() {
    this.$root.$on('show-message', this.displayMessage);
  },
  beforeDestroy() {
    this.$root.$off('show-message', this.displayMessage);
  },
  methods: {
    displayMessage(message) {
      this.message = message;
      this.showMessage = true;

      setTimeout(() => {
        this.showMessage = false;
        this.message = '';
      }, 2000);
    },
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
          this.message = `Created star: ${this.form.name}`;
          this.showMessage = true;
          this.$nextTick(() => {
            setTimeout(() => {
              this.showMessage = false;
              this.$router.replace({ path: '/stars' });
            }, 3000);
          });
        })
        .catch((error) => console.error(error));
    },
  }
};
</script>

<style>
.message-box {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
