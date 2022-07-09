<template>
  <div class="app-container">
    <actionbar />
    <div class="container-box" id="c-box">
      <div class='left' id="d-left">
        <project-tree />
      </div>
      <div class="resize" id="lam" title="收缩侧边栏"></div>
      <div class="middle" id="d-middle">
        <edit-detail />
      </div>
      <div class="resize" id="ram" title="收缩侧边栏"></div>
      <div class='right' id="d-right">
        <keyword-list />
      </div>
    </div>
  </div>
</template>

<script>
import Actionbar from './components/Actionbar'
import ProjectTree from './components/ProjectTree'
import EditDetail from './components/EditDetail'
import KeywordList from './components/KeywordList'
import { dragController } from './components/mixins/resize'
export default {
  components: {
    Actionbar,
    ProjectTree,
    EditDetail,
    KeywordList
  },
  mounted() {
    dragController('c-box', 'd-left', 'd-middle', 'lam')
    dragController('c-box', 'd-middle', 'd-right', 'ram')
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;

  .container-box {
    width: 100%;
    height: 100%;

    .left {
      width: 25%;
      height: 100%;
      float: left;
    }

    .middle {
      width: 59%;
      height: 100%;
      float: left;
    }

    .right {
      width: 15%;
      height: 100%;
      float: left;
    }

    .resize {
      cursor: col-resize;
      float: left;
      position: relative;
      top: 45%;
      background-color: #d6d6d6;
      border-radius: 5px;
      width: 0.5%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      background-size: cover;
      background-position: center;
      font-size: 0.32rem;
      color: white;
    }
    .resize:hover {
      color: #444444;
    }
  }
}
</style>
