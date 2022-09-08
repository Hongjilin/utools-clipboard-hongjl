<template>
  <div class="nav-search">
    <input v-model="searchInput" id="nav-search-input" type="text" :placeholder="'🔎 筛选剪切板内容'" />
  </div>
</template>

<script>
// 不能使用 export default
module.exports = {
  data() {
    return {
      searchInput: ''
    };
  },
  mounted() {
  },
  watch: {
    //监听，给父组件传参，将输入框内容传出，用以筛选
    searchInput: {
      handler(val) {
        this.$emit('change-search-input', val)
      }
    },
  },
  methods: {

  }
};
</script>
