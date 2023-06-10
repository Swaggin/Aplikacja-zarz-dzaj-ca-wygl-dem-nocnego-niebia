<template>
  <router-link :to="{ path: `/${endpoint}/${id}` }" class="itemTile">
    <div class="itemTile__content">
      <div class="itemTile__name">{{ name }}</div>
      <div class="itemTile__description">{{ formatDescription }}</div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'ItemTile',
  props: {
    id: {
      type: Number,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    endpoint: {
      type: String,
      default: null,
    },
  },
  computed: {
    formatDescription() {
      return this.description.length > 64 ? `${this.description.slice(0, 64)}...` : this.description;
    }
  },
  methods: {
    getImageUrl(url) {
      return `../img/${url}`;
    },
  },
}
</script>

<style scoped>
  .itemTile {
    color: black;
    transition: all 0.2s;
  }

  .itemTile:hover {
    transform: translateY(-0.4rem);
  }

  .itemTile__content {
    padding: 0.8rem 1.6rem 1.6rem;
  }

  .itemTile__name {
    font-size: 2.4rem;
    font-weight: 600;
    line-height: 1.5;
  }

  .itemTile__description {
    font-size: 1.6rem;
    font-weight: 300;
    line-height: 1.5;
  }
</style>
