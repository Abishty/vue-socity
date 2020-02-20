<template>
  <div>
    <div class="row">
      <div class="col-lg-9">
        <h1>Left</h1>
      </div>
      <div class="col-lg-3">
        <div>
          <div>
            <h1>SELECT CITY</h1>
          </div>
          <div>
            <div v-for="city in cities" :key="city.key">
              <nuxt-link :to="city.key">
                <p>{{ city.name }}</p>
                <img :src="city.img" style="width: 50px; height: 50px;" />
              </nuxt-link>
            </div>
          </div>
        </div>
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
  }
}
</script>
