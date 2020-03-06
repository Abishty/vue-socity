<template>
  <div class="overFXN">
    <Header
      v-if="isHomeroute()"
      @addPaddingTop="addPaddingTop"
      @removePaddingTop="removePaddingTop"
    />
    <div ref="mainBodyWrapper" class="main-body-wrapper">
      <nuxt />
    </div>
  </div>
</template>

<script>
import Header from '~/components/Header'

export default {
  components: {
    Header
  },
  data() {
    return {
      isHome: false
    }
  },
  methods: {
    isHomeroute() {
      this.isHome = this.$route.name === 'index'
      return !this.isHome
    },
    addPaddingTop() {
      this.$refs.mainBodyWrapper.classList.add('pt-75')
    },
    removePaddingTop() {
      this.$refs.mainBodyWrapper.classList.remove('pt-75')
    }
  }
}
</script>
