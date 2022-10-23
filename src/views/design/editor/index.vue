<template>
  <div class="construct">
    <div class='project' id="left">
      <project-tree />
    </div>
    <div class="resize-left" id="resize-x1">
      <svg-icon icon-class="more-vertical" class="ellipsis-icon"></svg-icon>
    </div>
    <div class="detail" id="middle">
      <tree-detail />
    </div>
    <div class="resize-right" id="resize-x2"></div>
    <div class='keyword' id="right">
      <keyword-list />
    </div>
  </div>
</template>

<script>
import ProjectTree from './ProjectTree'
import TreeDetail from './TreeDetail'
import KeywordList from './KeywordList'
import SvgIcon from '@/components/SvgIcon'
import { setConstructWith, dragWController } from '@/utils/resize'

export default {
  name: 'Editor',
  components: {
    SvgIcon,
    ProjectTree,
    TreeDetail,
    KeywordList
  },
  mounted() {
    setConstructWith('25%', 'calc(75% - 258px)', '250px')
    dragWController('left', 'middle', 'resize-x1')
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";

.construct {
  width: 100%;
  height: calc(100% - #{$toolbarHeight});
  .project {
    height: 100%;
    float: left;
  }
  .detail {
    height: 100%;
    float: left;
  }
  .keyword {
    height: 100%;
    float: left;
  }
  .resize-left {
    cursor: col-resize;
    float: left;
    position: relative;
    background-color: $resizeBg;
    width: 5px;
    height: 100%;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
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
