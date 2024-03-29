<template>
  <div class="case-entity" id="entity">
    <div id="et-grid" class="entity-grid">
      <div class="small-grid" v-for="n in 100" :key="n">
        <span>{{n}}</span>
      </div>
    </div>
    <draggable
      id="et-case"
      v-model="caseEntities"
      :group="dragSetting"
      item-key="id"
      animation="300"
      class="entity-info"
      ghost-class="custom-ghost"
      drag-class="custom-drag"
      @add="entityChange"
      @update="entityChange"
      @click.left="clickOutOfEntity"
    >
      <template #item="{ element, index }">
        <entity-item :entity-data="element" @click="clickEntity(element, index)" />
      </template>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { guid } from "@/utils/other";
import { deepCopy } from "@/utils/dcopy";
import { setCursorStyle } from "@/utils/hover";
import EntityItem from "@/views/design/editor/tree-detail/case/components/EntityItem";

export default {
  name: 'CaseEntity',
  components: {
    draggable,
    EntityItem,
  },
  data() {
    return {
      dragSetting: {
        name: 'kws',
        pull: false,
        put: true,
      },
      caseEntities: [],
      keyboardOnKey: '',
    }
  },
  watch: {
    '$store.state.entity.syncEntityFlag': {
      handler() {
        this.caseEntities = this.$store.state.entity.caseEntities
      },
      immediate: true
    },
    caseEntities: {
      handler() {
        this.$store.commit('entity/SET_CASE_ENTITIES', this.caseEntities)
      },
      deep: true,
    }
  },
  mounted() {
    this.addKeyboardEvent()
  },
  unmounted() {
    this.removeKeyboardEvent()
  },
  methods: {
    addKeyboardEvent() {
      document.onkeydown = (e) => {
        setKeyStatus(e.keyCode, true)
      }
      document.onkeyup = (e) => {
        setKeyStatus(e.keyCode, false)
      }
      const that = this
      const setKeyStatus = (keyCode, status) => {
        switch (keyCode) {
          case 16:
            that.keyboardOnKey = status ? 'shift' : ''
            break
          case 17:
            that.keyboardOnKey = status ? 'ctrl' : ''
            break
          case 46:
            if (status) {
              that.deleteEntity()
            }
            break
          // case 67:
          //   if (status && that.keyboardOnKey === 'ctrl') {
          //     that.copyEntity()
          //   }
          //   break
        }
      }
    },
    removeKeyboardEvent() {
      document.onkeydown = null
      document.onkeyup = null
    },
    entityChange() {
      this.$store.commit('entity/SET_ENTITY_CHANGE', true)
    },
    clickOutOfEntity() {
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length === 0) return
      this.pasteEntity(copiedEntities, this.caseEntities.length)
    },
    clickEntity(entityItem, index) {
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length !== 0) {
        this.pasteEntity(copiedEntities, index)
      } else {
        this.selectEntity(entityItem, index)
      }
    },
    selectEntity(entityItem, index) {
      let selectedEntities = this.$store.state.entity.selectedEntities
      if (this.keyboardOnKey === 'shift') {
        if (selectedEntities.length === 0) {
          selectedEntities = [entityItem]
        } else {
          let startIndex = this.caseEntities.findIndex((item) => item.uuid === selectedEntities[0].uuid)
          if (startIndex > index) {
            [index, startIndex] = [startIndex, index]
          }
          selectedEntities = this.caseEntities.slice(startIndex, index+1)
        }
      } else if (this.keyboardOnKey === 'ctrl') {
        if (selectedEntities.findIndex((item) => item.uuid === entityItem.uuid) === -1) {
          selectedEntities.push(entityItem)
        }
      } else {
        selectedEntities = [entityItem]
      }
      this.$store.commit('entity/SET_CURRENT_ENTITY', entityItem)
      this.$store.commit('entity/SET_SELECTED_ENTITIES', selectedEntities)
    },
    copyEntity() {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities.length === 0) return
      this.$store.commit('entity/SET_COPY_ENTITIES', selectedEntities)
      setCursorStyle(['et-case'], 'copy')
      // const body = document.querySelector('#entity')
      document.oncontextmenu = this.cancelCopyEntity
      this.$message.success('复制成功，单击鼠标右键取消')
    },
    cancelCopyEntity() {
      document.oncontextmenu = function () {
        document.oncontextmenu = function () { return true }
        return false
      }
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length === 0) return
      this.$store.commit('entity/SET_COPY_ENTITIES', [])
      setCursorStyle(['et-case'], 'auto')
    },
    pasteEntity(copiedEntities, index) {
      copiedEntities = deepCopy(copiedEntities)
      for (let i = 0; i < copiedEntities.length; i++) {
        copiedEntities[i]['uuid'] = guid()
      }
      copiedEntities.unshift(index, 0)
      Array.prototype.splice.apply(this.caseEntities, copiedEntities)
      this.entityChange()
      this.$store.commit('entity/SET_COPY_ENTITIES', [])
      setCursorStyle(['et-case'], 'auto')
    },
    deleteEntity() {
      for (let ele of document.querySelectorAll('input')) {
        if (ele === document.activeElement) return
      }
      const selectedEntities = this.$store.state.entity.selectedEntities
      this.caseEntities = this.caseEntities.filter((item1) => !selectedEntities.some((item2) => item1.uuid === item2.uuid))
      this.entityChange()
      this.$store.commit('entity/SET_CURRENT_ENTITY', {})
      this.$store.commit('entity/SET_SELECTED_ENTITIES', [])
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.module.scss";

.case-entity {
  width: 100%;
  height: calc(100% - 49px);
  position: relative;
  box-sizing: border-box;
  .entity-grid {
    width: 100%;
    height: 100%;
    padding-left: 10px;
    user-select: none;
    .small-grid {
      float: left;
      width: $entityGridWidth;
      height: $entityGridHeight;
      border: 1px dashed #d3d3d3;
      //border-bottom: 2px dashed #D3D3D3;
      text-align: center;
      line-height: calc(#{$entityGridHeight} - 2px);
      position: relative;
      color: #A9A9A9;
      i{
        position: absolute;
        right: -15px;
        top: 0;
        font-size: 30px;
        color: #d3d3d3;
      }
      &:last-child i:last-child{
        font-size: 0
      }
    }
  }
  .entity-info {
    height: 100%;
    width: 100%;
    user-select: none;
    position: absolute;
    padding-left: 10px;
    top: 0;
    left: 0;
    z-index: 10;
    font-size: 0;
  }
}
.custom-ghost {
  background-color: #8ee5f3;
}
.custom-drag {
  background-color: #ebeef5;
}
</style>
