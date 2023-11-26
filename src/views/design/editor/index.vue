<template>
  <div class="construct">
    <div class="drag-area" id="left-and-middle">
      <div class='project' id="left">
        <project-tree />
      </div>
      <div class="resize-left" id="resize-x1">
        <svg-icon icon-class="more-vertical" class="ellipsis-icon"></svg-icon>
      </div>
      <div class="detail" id="middle">
        <tree-detail />
      </div>
    </div>
    <div class="resize-right" id="resize-x2"></div>
    <div class='keyword' id="right">
      <keyword-list />
    </div>
  </div>
</template>

<script>
import ProjectTree from "@/views/design/editor/project-tree";
import TreeDetail from "@/views/design/editor/tree-detail";
import KeywordList from "@/views/design/editor/keyword-list";
import SvgIcon from "@/components/SvgIcon";
import { addDragWController, addResizeDetector } from "@/utils/resize";

export default {
  name: 'Editor',
  components: {
    SvgIcon,
    ProjectTree,
    TreeDetail,
    KeywordList
  },
  mounted() {
    addResizeDetector('left', 'middle')
    addDragWController('left', 'middle', 'left-and-middle', 'resize-x1')
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.construct {
  width: 100%;
  height: calc(100% - #{$toolbarHeight});
  .drag-area {
    height: 100%;
    width: calc(100% - #{$keywordWidth} - #{$rightResizeWidth});
    float: left;
    .project {
      height: 100%;
      width: $treeDefaultWidth;
      float: left;
    }
    .detail {
      height: 100%;
      width: calc(100% - #{$treeDefaultWidth} - #{$leftResizeWidth});
      float: left;
      overflow: hidden;
    }
    .resize-left {
      cursor: col-resize;
      float: left;
      position: relative;
      background-color: $resizeBg;
      width: $leftResizeWidth;
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
        transform: translateX(-37%);
        transition: opacity 0.3s ease 0s, transform 0.3s ease 0s;
      }
    }
  }
  .keyword {
    height: 100%;
    float: left;
    width: $keywordWidth;
    overflow: hidden;
  }
  .resize-right {
    float: left;
    position: relative;
    background-color: $resizeBg;
    width: $rightResizeWidth;
    height: 100%;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
  }
}
</style>
