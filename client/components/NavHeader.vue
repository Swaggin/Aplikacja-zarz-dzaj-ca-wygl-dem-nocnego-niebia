<template>
  <header class="header">
    <router-link :to="{ path: '/' }" class="header__link" :class="{ 'header__link--active': activeIndex === 0 }">
      <i class="fa-solid fa-gauge-high"></i>
      <span>Dashboard</span>
    </router-link>
    <router-link :to="{ path: '/config' }" class="header__link" :class="{ 'header__link--active': activeIndex === 1 }">
      <i class="fa-solid fa-gears"></i>
      <span>Configuration</span>
    </router-link>
    <router-link :to="{ path: '/stars' }" class="header__link" :class="{ 'header__link--active': activeIndex === 2 }">
      <i class="fa-solid fa-star"></i>
      <span>Stars</span>
    </router-link>
    <router-link :to="{ path: '/constellations' }" class="header__link" :class="{ 'header__link--active': activeIndex === 3 }">
      <i class="fa-solid fa-satellite"></i>
      <span>Constellations</span>
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

  @media (max-width: 768px) {
    .header {
      width: calc(100% - 2rem);
    }

    .header__link {
      width: 25%;
      text-align: center;
    }

    .header__link span {
      display: none;
    }
  }
</style>
