<template>
  <div class="case-detail">
    <div class="information" id="infos">
      <keyword-config v-if="isKeyword" />
      <case-config v-else />
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
import { dragHController } from "@/utils/resize";
import NODE from "@/constans/node";
import SvgIcon from "@/components/SvgIcon";
import CaseEntity from "@/views/design/editor/tree-detail/case/components/CaseEntity";
import EntityArgs from "@/views/design/editor/tree-detail/case/components/EntityArgs";
import CaseConfig from "@/views/design/editor/tree-detail/case/components/CaseConfig";
import KeywordConfig from "@/views/design/editor/tree-detail/case/components/KeywordConfig";

export default {
  name: 'Case',
  components: {
    SvgIcon,
    CaseEntity,
    EntityArgs,
    CaseConfig,
    KeywordConfig,
  },
  computed: {
    isKeyword() {
      return this.$store.state.tree.nodeCategory === NODE.NodeCategory.KEYWORD
    }
  },
  mounted() {
    dragHController('infos', 'args', 'resize-y')
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";
$resizeHeight: 5px;

.case-detail {
  width: 100%;
  height: 100%;
  position: relative;
  .information {
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
    background-color: $resizeBg;
    width: 100%;
    height: $resizeHeight;
    background-size: cover;
    background-position: center;
    font-size: 0.32rem;
    color: white;
    .ellipsis-icon {
      width: 30px;
      height: 18px;
      position: relative;
      left: 48%;
      transform: translateY(-38%);
      transition: opacity 0.3s ease 0s, transform 0.3s ease 0s;
    }
  }
}
</style>
