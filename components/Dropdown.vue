<template>
  <div id="dropdown" class="dropdown row">
    <div
      v-for="city in cities"
      :key="city.key"
      class="col-md-1 col-4 text-center city-name city-choose"
    >
      <div
        :class="
          city.key === $route.params.city ? 'current-city city-div' : 'city-div'
        "
        @click="handleCityClick(city.key)"
      >
        <img :src="city.img" :class="`city-img ${city.key}`" />
        <p>{{ city.name }}</p>
      </div>
      <div v-if="city.key === $route.params.city">
        <p class="current-text">Current City</p>
      </div>
    </div>
  </div>
</template>

<script>
import constants from '~/constants'
export default {
  data() {
    return {
      cities: constants.CITIES
    }
  },
  mounted() {
    window.addEventListener('click', this.handleOutsideClick)
  },
  destroyed() {
    window.removeEventListener('click', this.handleOutsideClick)
  },
  methods: {
    handleOutsideClick(e) {
      // ignore if arrow is clicked
      if (e.target.closest('#arrow')) {
        return
      }

      if (!e.target.closest('#dropdown')) {
        this.$emit('closeDropdown')
      }
    },
    handleCityClick(city) {
      this.$emit('changeCity', city)
    }
  }
}
</script>

<style scoped>
.dropdown {
  position: fixed;
  width: 88%;
  border: 1px solid black;
  background-color: white;
  z-index: 1;
  top: 70px;
  left: 75px;
  border-radius: 5px;
}
.city-name {
  font-size: 14px;
  margin-top: 15px;
  cursor: pointer;
}
.city-img {
  box-sizing: border-box;
  height: 30px;
  padding-top: 4px;
}
.city-choose {
  box-sizing: border-box;
  width: 9.09%;
  padding: 1% 1% 3%;
  height: 98px;
}
.srinagar {
  width: 55px;
  height: auto;
  padding-top: 12px;
}
.current-city {
  border: 0.75px solid rgb(147, 137, 143);
  box-sizing: border-box;
  height: 55px;
}
.current-text {
  font-size: 12px;
}
a {
  text-decoration: none;
  color: black;
}
@media only screen and (max-width: 768px) {
  .dropdown {
    left: 15px;
    width: 100%;
    height: 100%;
  }
}
</style>
