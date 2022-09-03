<template>
  <div class="construct">
    <div class='project' id="left">
      <project-tree />
    </div>
    <div class="resize-left" id="resize-x">
      <svg-icon icon-class="more-vertical" class="ellipsis-icon"></svg-icon>
    </div>
    <div class="detail" id="middle">
      <case-detail />
    </div>
    <div class="resize-right"></div>
    <div class='keyword'>
      <keyword-list />
    </div>
  </div>
</template>

<script>
import ProjectTree from './DesignEditor/ProjectTree.vue'
import CaseDetail from './DesignEditor/CaseDetail'
import KeywordList from './DesignEditor/KeywordList'
import { dragWController } from '@/utils/resize'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'DesignArea',
  components: {
    SvgIcon,
    ProjectTree,
    CaseDetail,
    KeywordList
  },
  mounted() {
    dragWController('left', 'middle', 'resize-x')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";

.construct {
  width: 100%;
  height: calc(100% - #{$toolbarHeight});
  .project {
    width: 25%;
    height: 100%;
    float: left;
  }
  .detail {
    width: calc(75% - 258px);
    height: 100%;
    float: left;
  }
  .keyword {
    width: 250px;
    height: 100%;
    float: left;
  }
  .resize-left {
    cursor: col-resize;
    float: left;
    position: relative;
    background-color: #d6d6d6;
    width: 5px;
    height: 100%;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
    &:hover {
      color: #444444;
    }
    .ellipsis-icon {
      width: 20px;
      height: 30px;
      position: relative;
      top: 48%;
      transform: translateX(-38%);
      transition: opacity 0.3s ease 0s, transform 0.3s ease 0s;
    }
  }
  .resize-right {
    float: left;
    position: relative;
    background-color: #d6d6d6;
    width: 2px;
    height: 100%;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
  }
}
</style>
