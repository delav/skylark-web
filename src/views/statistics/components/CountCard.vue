<template>
  <div class="count-card">
    <div class="card-body">
      <div class="card-icon">
        <svg-icon :style="styleIcon" :icon-class="iClass"></svg-icon>
      </div>
      <div class="card-data">
        <p class="desc">{{description}}</p>
        <p class="data">{{count}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from "@/components/SvgIcon";

export default {
  name: 'CountCard',
  components: {
    SvgIcon,
  },
  props: {
    iClass: String,
    iColor: String,
    description: String,
    count: [String, Number]
  },
  computed: {
    styleIcon() {
      return {
        fontSize: '32px',
        color: this.iColor
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.count-card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, .08);
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, .12);
  .card-body {
    padding: 20px 25px;
    display: flex;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
    align-items: center;
    .card-icon {
      padding: 0 15px;
    }
    .card-data {
      flex: 0 0 auto;
      width: auto;
      max-width: 100%;
      padding: 0 15px;
      .desc {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #6c757d;
      }
      .data {
        margin: 0;
        font-size: 32px;
        color: #060606;
      }
    }
  }
}
</style>
