<template>
  <div class="design-box" id="c-box">
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
</template>

<script>
import ProjectTree from './DesignEditor/ProjectTree'
import EditDetail from './DesignEditor/EditDetail'
import KeywordList from './DesignEditor/KeywordList'
import { dragController } from './DesignEditor/resize'
export default {
  name: "DesignArea",
  components: {
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
.design-box {
  width: 100%;
  height: calc(100% - 28px);

  .left {
    width: 25%;
    height: 100%;
    float: left;
  }

  .middle {
    width: 55%;
    height: 100%;
    float: left;
  }

  .right {
    height: 100%;
    float: left;
  }

  .resize {
    cursor: col-resize;
    float: left;
    position: relative;
    background-color: #d6d6d6;
    width: 3px;
    height: 100%;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
  }
  .resize:hover {
    color: #444444;
  }
}
</style>
