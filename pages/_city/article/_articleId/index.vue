<template>
  <div>
    <SingleArticle
      :isMainArticle="true"
      v-on:articleReadDone="handleArticleReadDone"
      :article="article"
      :isPrevDisabled="true"
      :isNextDisabled="!relatedArticles"
      :nextArticle="nextArticle()"
      @topCrossedUp="handleTopCrossedUp"
      @topCrossedDown="handleTopCrossedDown"
      @bottomCrossedUp="handleBottomCrossedUp"
      @bottomCrossedDown="handleBottomCrossedDown"
    />
    <div v-if="loading">
      <Loader />
    </div>
    <div
      v-else-if="relatedArticles"
      v-for="(r, idx) in relatedArticles"
      :key="idx"
    >
      <SingleArticle
        :article="r"
        :isNextDisabled="idx === relatedArticles.length - 1"
        :nextArticle="nextArticle(true, idx)"
        :prevArticle="prevArticle(idx)"
        @topCrossedUp="handleTopCrossedUp"
        @topCrossedDown="handleTopCrossedDown"
        @bottomCrossedUp="handleBottomCrossedUp"
        @bottomCrossedDown="handleBottomCrossedDown"
      />
    </div>
  </div>
</template>

<script>
import SingleArticle from '~/components/SingleArticle'
import Loader from '~/components/Loader'

export default {
  components: {
    SingleArticle,
    Loader
  },
  data() {
    return {
      loading: false,
      article: null,
      relatedArticles: null,
      selectedArticle: null
    }
  },
  computed: {
    title() {
      const { title } = this.selectedArticle
      return title
    }
  },
  async asyncData({ params, $axios, error }) {
    try {
      const { city, articleId } = params
      // undefiend is for token!
      const resp = await $axios.get(
        `/articles/fetchArticle/${city}/${articleId}/undefined`
      )
      return { article: resp.data, selectedArticle: resp.data.data.articleData }
    } catch (err) {
      console.error(err)
      error({ statusCode: 404, message: 'Not Found!' })
    }
  },
  created() {
    this.$nuxt.$on('pushState', this.handlePushState)
  },
  beforeDestroy() {
    this.$nuxt.$off('pushState')
    window.removeEventListener('scroll', this.handleScroll)
    // window.onpopstate = null
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    // window.onpopstate = this.handlePopState
  },
  middleware: 'cityCheck',
  methods: {
    handlePopState() {
      window.location.reload(true)
      // const { pathname } = window.location
      // const articleId = pathname.split('/')[pathname.split('/').length - 1]
      // if (
      //   articleId !== this.article.data.articleData._id &&
      //   !this.relatedArticles?.find((r) => r.data.articleData._id === articleId)
      // ) {
      // } else {
      //   $('html, body').animate(
      //     {
      //       scrollTop: document.querySelector(
      //         `.single-article[data-id="${articleId}"]`
      //       ).offsetTop
      //     },
      //     800
      //   )
      // }
    },
    getArticleContainer(id) {
      return document.querySelector(`.single-article[data-id="${id}"]`)
    },
    handleTopCrossedUp(_id) {
      const article = this.getArticleContainer(_id)
      const nextBtn = article.getElementsByClassName(
        'right-column-container'
      )[0]
      const prevBtn = article.getElementsByClassName('left-column-container')[0]

      nextBtn.classList.add('sticky-right')

      prevBtn.classList.add('sticky-right')
    },
    handleTopCrossedDown(_id) {
      const article = this.getArticleContainer(_id)
      const nextBtn = article.getElementsByClassName(
        'right-column-container'
      )[0]
      const prevBtn = article.getElementsByClassName('left-column-container')[0]

      nextBtn.classList.remove('sticky-right')

      prevBtn.classList.remove('sticky-right')
    },
    handleBottomCrossedUp(_id) {
      const article = this.getArticleContainer(_id)
      const nextBtn = article.getElementsByClassName(
        'right-column-container'
      )[0]
      const prevBtn = article.getElementsByClassName('left-column-container')[0]

      nextBtn.classList.remove('sticky-right')
      nextBtn.classList.add('stick-to-bottom')

      prevBtn.classList.remove('sticky-right')
      prevBtn.classList.add('stick-to-bottom')
    },
    handleBottomCrossedDown(_id) {
      const article = this.getArticleContainer(_id)
      const nextBtn = article.getElementsByClassName(
        'right-column-container'
      )[0]
      const prevBtn = article.getElementsByClassName('left-column-container')[0]

      nextBtn.classList.add('sticky-right')
      nextBtn.classList.remove('stick-to-bottom')
      prevBtn.classList.add('sticky-right')
      prevBtn.classList.remove('stick-to-bottom')
    },
    nextArticle(isRelatedArticle = false, index) {
      if (!this.relatedArticles) {
        return {}
      }
      if (isRelatedArticle) {
        const nextarticle = this.relatedArticles[index + 1]
        return nextarticle
          ? {
              _id: nextarticle.data.articleData._id,
              title: nextarticle.data.articleData.title
            }
          : {}
      }

      return {
        _id: this.relatedArticles[0].data.articleData._id,
        title: this.relatedArticles[0].data.articleData.title
      }
    },
    prevArticle(index) {
      if (!this.relatedArticles) return ''

      if (index >= 1) {
        return {
          _id: this.relatedArticles[index - 1].data.articleData._id,
          title: this.relatedArticles[index - 1].data.articleData.title
        }
      }
      return {
        _id: this.article.data.articleData._id,
        title: this.article.data.articleData.title
      }
    },
    handlePushState({ city, article }) {
      if (this.article.data.articleData._id === article) {
        this.selectedArticle = this.article.data.articleData
      } else {
        const relArticle = this.relatedArticles?.find(
          (r) => r.data.articleData._id === article
        )
        if (relArticle) {
          this.selectedArticle = relArticle?.data?.articleData
        }
      }
    },
    handleScroll() {
      const articles = Array.from(document.querySelectorAll('.single-article'))
      const ratios = []
      for (const article of articles) {
        const { width, top, bottom } = article.getBoundingClientRect()
        const articleWidth = width
        let articleHeight
        if (top <= 0) {
          if (bottom > window.innerHeight) {
            articleHeight = window.innerHeight
          } else {
            articleHeight = bottom
          }
        } else if (top > 0 && top <= window.innerHeight) {
          articleHeight = window.innerHeight - top
        } else {
          articleHeight = 0
        }

        const viewPortArea = window.innerHeight * window.innerWidth
        const articleArea = articleWidth * articleHeight
        ratios.push(articleArea / viewPortArea)
      }
      const maxRatio = Math.max(...ratios)
      const maxRatioIndex = ratios.indexOf(maxRatio)

      const { pathname } = window.location
      const articleId = pathname.split('/')[pathname.split('/').length - 1]
      const city = pathname.split('/')[1]
      if (maxRatioIndex === 0) {
        if (articleId !== this.article.data.articleData._id) {
          this.changeURL(this.article.data.articleData._id, city)
        }
      } else if (maxRatioIndex !== -1) {
        // eslint-disable-next-line no-lonely-if
        if (
          articleId !==
          this.relatedArticles[maxRatioIndex - 1].data.articleData._id
        ) {
          this.changeURL(
            this.relatedArticles[maxRatioIndex - 1].data.articleData._id,
            city
          )
        }
      }
    },
    changeURL(id, city) {
      window.history.replaceState({}, null, `/delhi/article/${id}`)
      this.$nuxt.$emit('pushState', { city, article: id })
    },
    async handleArticleReadDone() {
      if (this.relatedArticles || this.loading) return
      // fetch more related articles
      const { categories, publishDate, _id } = this.article.data.articleData
      const { city } = this.$route.params
      this.loading = true
      const resp2 = await this.$axios.post(
        'https://soapi.in:3001/feed/relatedFeeds',
        {
          city,
          batchSize: 3,
          publishedDate: publishDate,
          categories,
          _id
        }
      )
      const relatedArticleArr = resp2.data.data.articles.map((a) => {
        const pub = resp2.data.data.publishers.find(
          (p) => p.username === a.createdBy
        )
        return {
          data: {
            articleData: a,
            publisherData: pub
          }
        }
      })
      this.relatedArticles = relatedArticleArr
      this.loading = false
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
