<template>
  <div>
    <div ref="headerComponent" class="row header-container">
      <div class="col-2 ham-menu" style="text-align: center;">
        <font-awesome-icon :icon="['fas', 'bars']" />
      </div>
      <div class="col-lg-9 col-8 left-side">
        <div @click="$router.back()" class="back-btn">
          <font-awesome-icon :icon="['fas', 'chevron-left']" />
        </div>
        <div class="logo">
          <nuxt-link to="/">
            <img src="../assets/so_logo.svg" />
          </nuxt-link>
        </div>
        <div class="city-names">{{ cityName }}</div>
        <div id="arrow" @click="toggleDropdown">
          <font-awesome-icon :icon="['fas', 'chevron-down']" />
        </div>
      </div>
      <div class="col-lg-3 col-2 right-side">
        <label class="switch-wrap">
          <input ref="darkModeSwitch" @click="toggleDarkMode" type="checkbox" />
          <div class="switch"></div>
        </label>
        <div class="write-a-post">Write A Post</div>
        <div class="search">
          <font-awesome-icon :icon="['fas', 'search']" />
        </div>
      </div>
    </div>
    <transition name="fade">
      <Dropdown
        v-if="showDropdown"
        v-on:closeDropdown="toggleDropdown"
        v-on:changeCity="changeCity"
      />
    </transition>
  </div>
</template>
<script>
import Dropdown from './Dropdown'
import constants from '~/constants'

export default {
  components: {
    Dropdown
  },
  data() {
    return {
      city: this.$route.params.city,
      showDropdown: false,
      isDark: false
    }
  },
  computed: {
    cityName() {
      const city = constants.CITIES.find((c) => c.key === this.city)
      return city ? city.name : 'Delhi'
    }
  },
  watch: {
    $route: {
      handler() {
        this.city = this.$route.params.city
      }
    }
  },
  mounted() {
    this.initialHeaderOffset = this.$refs.headerComponent.offsetTop

    window.addEventListener('scroll', this.handleScroll)

    this.handleScroll()
    this.isDark = localStorage.getItem('theme') === 'dark'
    this.$refs.darkModeSwitch.checked = this.isDark
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    toggleDarkMode() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      if (this.isDark) {
        document.body.classList.add('dark-theme')
      } else {
        document.body.classList.remove('dark-theme')
      }
    },
    changeCity(city) {
      this.toggleDropdown()
      this.$router.push(`/${city}`)
    },
    handleScroll() {
      if (window.pageYOffset <= this.initialHeaderOffset) {
        this.$refs.headerComponent.classList.remove('sticky')
        this.$emit('removePaddingTop')
      }
      if (window.pageYOffset > this.$refs.headerComponent.offsetTop) {
        this.$refs.headerComponent.classList.add('sticky')
        this.$emit('addPaddingTop')
      }
    }
  }
}
</script>

<style scoped>
.ham-menu {
  display: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.left-side {
  display: flex;
  align-self: center;
}
.right-side {
  display: flex;
  justify-content: space-evenly;
  align-self: center;
}
.header-container {
  width: 100%;
  z-index: 1;
  background-color: white;
  height: 70px;
  margin-right: 0px;
  margin-left: 0px;
  box-shadow: 0px 0px 3px 0 #000000;
  transition: background-color 0.25s ease-in;
}

body.dark-theme .header-container {
  background-color: #273142;
  box-shadow: 0px 0px 3px 0 lightgray;
  transition: background-color 0.25s ease-out;
}
.back-btn {
  cursor: pointer;
  width: 20px;
  height: 14px;
  position: relative;
  top: 10px;
}
body.dark-theme .back-btn {
  color: white;
}
.back-btn img {
  transform: rotate(180deg);
  height: 100%;
}
body.dark-theme .back-btn img {
  color: white;
}
.city-names {
  position: relative;
  left: 32px;
  align-self: center;
  font-size: 14px;
}
body.dark-theme .city-names {
  color: white;
}
#arrow {
  cursor: pointer;
  position: relative;
  left: 36px;
  top: 2px;
  align-self: center;
}
body.dark-theme #arrow {
  color: white;
}
#arrow img {
  width: 12px;
  height: 12px;
  transform: rotate(90deg);
}
.write-a-post {
  cursor: pointer;
  font-size: 14px;
  padding-top: 8px;
}
.write-a-post:hover {
  color: #686868;
}
body.dark-theme .write-a-post {
  color: white;
}
.search {
  cursor: pointer;
  position: relative;
  top: 7px;
}
body.dark-theme .search {
  color: white;
}
.search:hover {
  color: #686868;
}
.search img {
  width: 16px;
}
.logo {
  position: relative;
  left: 25px;
  height: 45px;
  width: 41px;
}
.logo img {
  height: 45px;
  cursor: pointer;
  width: 40px;
  object-fit: contain;
}
.sticky {
  position: fixed;
  top: 0;
}
.switch-wrap {
  position: relative;
  top: 5px;
  cursor: pointer;
  background: #15273b;
  padding: 7px;
  width: 38px;
  height: 26px;
  border-radius: 33.5px;
}
.switch-wrap input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}
.switch {
  height: 100%;
  display: grid;
  grid-template-columns: 0fr 1fr 1fr;
  transition: 0.2s;
}
.switch::after {
  content: '';
  border-radius: 50%;
  background: #ccc;
  grid-column: 2;
  transition: background 0.2s;
}
input:checked + .switch {
  grid-template-columns: 1fr 1fr 0fr;
}
input:checked + .switch::after {
  background-color: #52cf71;
}
@media only screen and (max-width: 768px) {
  .back-btn {
    display: none;
  }
  .write-a-post {
    display: none;
  }
  body.dark-theme .ham-menu {
    color: white;
  }
}
@media only screen and (min-width: 280px) and (max-width: 576px) {
  .ham-menu {
    display: block;
    align-self: center;
  }
  .switch-wrap {
    width: 70px;
    right: 20px;
    padding: 5px;
    height: 22px;
  }
  .search {
    top: 5px;
  }
  .left-side {
    justify-content: center;
  }
  .logo {
    left: -10px;
  }
  .city-names {
    left: -6px;
  }
  #arrow {
    left: 0px;
  }
  .right-side {
    text-align: center;
  }
}
@media only screen and (min-width: 577px) and (max-width: 768px) {
  .ham-menu {
    display: block;
    align-self: center;
  }
  .left-side {
    justify-content: center;
  }
  .logo {
    left: -10px;
  }
  .city-names {
    left: -6px;
  }
  #arrow {
    left: 0px;
  }
  .right-side {
    text-align: center;
  }
}
</style>
