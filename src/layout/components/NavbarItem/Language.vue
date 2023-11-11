<template>
  <div class="language">
    <el-dropdown trigger="hover" :command="changeLanguage">
      <span>
        {{ $t('Navbar._language') }}
        <el-icon><ArrowDown /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in langList"
            :key="index"
            @click.native="changeLanguage(item.value)"
          >
            <span>{{item.label}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script>

export default {
  name: 'Language',
  data() {
    return {
      langList: [
        { label: '中文', value: 'CN' },
        { label: 'English', value: 'US' },
      ]
    }
  },
  methods: {
    changeLanguage(val) {
      if (this.$i18n.locale === val) {
        return
      }
      this.$i18n.locale = val
      this.$store.commit('user/SET_LANG', val)
    },
  }
}
</script>

<style scoped>

</style>
