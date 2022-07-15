<template>
  <div class="design-box">
    <div class='project' id="left">
      <project-tree />
    </div>
    <div class="resize-l" id="resize-x">
      <svg-icon icon-class="more-vertical" class="ellipsis-icon"></svg-icon>
    </div>
    <div class="detail" id="middle">
      <edit-detail />
    </div>
    <div class="resize-r"></div>
    <div class='keyword'>
      <keyword-list />
    </div>
  </div>
</template>

<script>
import ProjectTree from './DesignEditor/ProjectTree'
import EditDetail from './DesignEditor/CaseDetail'
import KeywordList from './DesignEditor/KeywordList'
import { dragWController } from '@/utils/resize'
import SvgIcon from '@/components/SvgIcon'
export default {
  name: 'DesignArea',
  components: {
    SvgIcon,
    ProjectTree,
    EditDetail,
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
.design-box {
  width: 100%;
  height: calc(100% - 28px);

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

  .resize-l {
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
  .resize-r {
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
