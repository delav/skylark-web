<template>
  <div class="case-detail">
    <div class="infos">
      <case-config />
      <case-entity />
    </div>
    <div class="resize-h" id="resize-y">
      <svg-icon icon-class="more-indicator" class="ellipsis-icon"></svg-icon>
    </div>
    <div class='arguments' id="args">
      <entity-args />
    </div>
  </div>
</template>

<script>
// import { dragHController } from '@/utils/resize'
import SvgIcon from '@/components/SvgIcon'
import CaseEntity from './components/CaseEntity'
import EntityArgs from './components/EntityArgs'
import CaseConfig from './components/CaseConfig'

export default {
  name: 'Case',
  components: {
    SvgIcon,
    CaseEntity,
    EntityArgs,
    CaseConfig,
  },
  mounted() {
    // dragHController('entity', 'args', 'resize-y')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
$resizeHeight: 5px;

.case-detail {
  width: 100%;
  height: 100%;
  position: relative;
  .infos {
    width: 100%;
    height: 60%;
    position: relative;
    overflow-y: auto;
  }
  .arguments {
    width: 100%;
    height: calc(40% - #{$resizeHeight});
    position: relative;
    overflow-y: auto;
  }
  .resize-h {
    cursor: row-resize;
    position: relative;
    background-color: #d6d6d6;
    width: 100%;
    height: $resizeHeight;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
    &:hover {
      color: #444444;
    }
    .ellipsis-icon {
      width: 30px;
      height: 20px;
      position: relative;
      left: 48%;
      transform: translateY(-38%);
      transition: opacity 0.3s ease 0s, transform 0.3s ease 0s;
    }
  }
}
</style>
