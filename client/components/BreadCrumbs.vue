<template>
  <div class="breadcrumbs">
    <a
      v-for="(item, index) in items"
      :key="index"
      :href="item.url"
      class="breadcrumbs__item"
      :class="{ 'breadcrumbs__item--active': item.active }"
    >
      {{ item.label }}
    </a>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  props: {
    items: {
      type: Array,
      default: () => [],
    }
  }
}
</script>

<style scoped>
  .breadcrumbs {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    margin-top: 2.4rem;
  }

  .breadcrumbs__item:not(:first-child)::before {
    content: '/';
    margin-right: 1rem;
  }

  .breadcrumbs__item--active {
    color: rgba(255, 255, 255, 0.75);
    pointer-events: none;
  }
</style>
