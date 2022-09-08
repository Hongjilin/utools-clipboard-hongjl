var vue = new Vue({
  components: {
    Home: httpVueLoader('./views/Home.vue'),
  },
  el: '#app',
  data: {
    list: [],
    homeKey:0,
  },
  mounted() {},
  methods: {
  },
})
