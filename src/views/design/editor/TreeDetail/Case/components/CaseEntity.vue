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
import { guid } from '@/utils/other'
import { deepCopy } from '@/utils/dcopy'
import { setCursorStyle } from '@/utils/hover'
import EntityItem from './EntityItem'

export default {
  name: 'CaseEntity',
  components: {
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
      }
    },
    caseEntities: {
      handler() {
        this.$store.commit('entity/SET_CASE_ENTITIES', this.caseEntities)
      },
      deep: true,
    }
  },
  created() {
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
      border: 1px dashed #D3D3D3;
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
        color: #D3D3D3;
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
</style>
