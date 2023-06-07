<template>
  <div class="config-page">
    <form method="POST" class="form" @submit.prevent="onSubmit">
      <h1>Configuration Page</h1>
      <h2>Cloudiness Level</h2>

      <input
        type="range"
        v-model="config.cloudinessLevel"
        name="cloudinessLevel"
        min="0"
        max="10"
        step="1"
      />
      <p>Selected Cloudiness Level: {{ $store.state.cloudinessLevel }}</p>

      <h2>Moon Phase</h2>
      <input
        type="range"
        v-model="config.moonPhase"
        name="moonPhase"
        min="0"
        max="10"
        step="1"
      />
      <p>Selected Moon Phase: {{ $store.state.moonPhase }}</p>

      <h2>Precipitation Type</h2>
      <select v-model="config.precipitationType" name="precipitationType">
        <option value="none">None</option>
        <option
          :disabled="config.cloudinessLevel == 0"
          value="rain"
        >
          Rain
        </option>
        <option
          :disabled="config.cloudinessLevel == 0"
          value="snow"
        >
          Snow
        </option>
        <option
          :disabled="config.cloudinessLevel <= 5"
          value="hail"
        >
          Hail
        </option>
      </select>
      <p>Selected Precipitation Type: {{ $store.state.precipitationType }}</p>

      <h2>Fog Level</h2>
      <input
        type="range"
        v-model="config.fogLevel"
        name="fogLevel"
        min="0"
        max="10"
        step="1"
      />
      <p>Selected Fog Density: {{ $store.state.fogLevel }}</p>

      <button @click="onSubmit">Save</button>
    </form>

    <div class="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: 'ConfigurationPage',
  data() {
    return {
      config: {
        cloudinessLevel: this.$store.state.cloudinessLevel,
        moonPhase: this.$store.state.precipitationType,
        precipitationType: this.$store.state.precipitationType,
        fogLevel: this.$store.state.fogLevel,
      },
      message: '',
    };
  },
  beforeMount() {
    this.$store.commit('SET_SKY', {
      cloudinessLevel: localStorage.getItem('cloudinessLevel') || null,
      moonPhase: localStorage.getItem('moonPhase') || null,
      precipitationType: localStorage.getItem('precipitationType') || null,
      fogLevel: localStorage.getItem('fogLevel') || null,
    });
  },
  methods: {
    async onSubmit(e) {
      e.preventDefault();
      e.stopPropagation();

      const data = {
        cloudinessLevel: this.config.cloudinessLevel,
        moonPhase: this.config.moonPhase,
        precipitationType: this.config.precipitationType,
        fogLevel: this.config.fogLevel,
      };

      const formData = new FormData();

      for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
        localStorage.setItem(key, value);
      }

      await this.$axios
        .put('http://localhost:3001/v1/sky', formData)
        .then((res) => {
          this.message = res.data;

          this.$store.commit('SET_SKY', data);
        })
        .catch((error) => console.error(error));
    }
  },
};
</script>

<style scoped>
.config-page {
  width: 100%;
}
</style>
