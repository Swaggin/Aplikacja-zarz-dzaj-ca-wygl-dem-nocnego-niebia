<template>
  <header class="header">
    <router-link :to="{ path: '/' }" class="header__link" :class="{ 'header__link--active': activeIndex === 0 }">
      <i class="fa-solid fa-gauge-high"></i>
      Dashboard
    </router-link>
    <router-link :to="{ path: '/config' }" class="header__link" :class="{ 'header__link--active': activeIndex === 1 }">
      <i class="fa-solid fa-gears"></i>
      Configuration
    </router-link>
    <router-link :to="{ path: '/stars' }" class="header__link" :class="{ 'header__link--active': activeIndex === 2 }">
      <i class="fa-solid fa-star"></i>
      Stars
    </router-link>
    <router-link :to="{ path: '/constellations' }" class="header__link" :class="{ 'header__link--active': activeIndex === 3 }">
      <i class="fa-solid fa-satellite"></i>
      Constellations
    </router-link>
  </header>
</template>

<script>
export default {
  name: 'NavHeader',
  props: {
    activeIndex: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style scoped>
  .header {
    width: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    border-radius: 0 0 1rem 1rem;
    overflow: hidden;
  }

  .header__link {
    color: black;
    font-weight: 700;
    display: block;
    padding: 1.6rem 2.4rem;
    transition: all 0.2s;
  }

  .header__link:hover {
    background-color: #7B2CBF;
    color: white;
  }

  .header__link--active {
    background-color: #7B2CBF;
    color: white;
  }
</style>
