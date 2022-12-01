<template>
  <div class="case-entity" id="entity">
    <div class="entity-grid" @click.left="clickGrid">
      <div class="small-grid" v-for="n in 100" :key="n">
        <span>{{n}}</span>
      </div>
    </div>
    <draggable
      id="case-entity"
      v-model="caseEntities"
      :group="dragSetting"
      item-key="id"
      class="entity-info"
      ghost-class="ghost"
      chosen-class="chosen"
      @add="entityChange"
      @update="entityChange"
    >
      <template #item="{ element, index }">
        <div class="single-entity" :style="entityStyle(element)" @click="clickEntity(element, index)">
          <dl>
            <dt>
              <img :src="getKeywordAttrByEntityId('image', element['keyword_id'])" alt="">
            </dt>
            <dd>{{getKeywordAttrByEntityId('ext_name', element['keyword_id'])}}</dd>
            <dd>{{element['output_args']}}</dd>
          </dl>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script>
import { guid } from '@/utils/other'

export default {
  name: 'CaseEntity',
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
    '$store.state.tree.nodeData': {
      handler(value) {
        const nodeType = this.$store.state.tree.detailType
        if (nodeType === 1) {
          this.caseEntities = value
        }
      },
      deep: true,
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
  computed: {
    keywordDict() {
      return this.$store.state.keyword.keywordsObject
    },
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
              that.deleteEntities()
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
    clickGrid() {
      console.log('点击小格子')
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length === 0) return
      this.pasteEntities(this.caseEntities.length)
    },
    clickEntity(entityItem, index) {
      const copiedEntities = this.$store.state.entity.copiedEntities
      if (copiedEntities.length !== 0) {
        this.pasteEntities(index)
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
          let startIndex = this.caseEntities.findIndex((item) => item['uuid'] === selectedEntities[0]['uuid'])
          selectedEntities = this.caseEntities.slice(startIndex, index+1)
        }
      } else if (this.keyboardOnKey === 'ctrl') {
        if (selectedEntities.findIndex((item) => item['uuid'] === entityItem['uuid']) === -1) {
          selectedEntities.push(entityItem)
        }
      } else {
        selectedEntities = [entityItem]
      }
      this.$store.commit('entity/SET_CURRENT_ENTITY', entityItem)
      this.$store.commit('entity/SET_SELECTED_ENTITIES', selectedEntities)
    },
    pasteEntities(index) {
      let copiedEntities = this.$store.state.entity.selectedEntities
      copiedEntities = [].concat(JSON.parse(JSON.stringify(copiedEntities)))
      for (let i = 0; i < copiedEntities.length; i++) {
        copiedEntities[i]['uuid'] = guid()
      }
      copiedEntities.unshift(index, 0)
      Array.prototype.splice.apply(this.caseEntities, copiedEntities)
      this.$store.commit('entity/SET_COPY_ENTITIES', [])
      const body = document.querySelector('#entity')
      body.style.cursor= 'auto'
    },
    deleteEntities() {
      for (let ele of document.querySelectorAll('input')) {
        if (ele === document.activeElement) return
      }
      const selectedEntities = this.$store.state.entity.selectedEntities
      this.caseEntities = this.caseEntities.filter((item1) => !selectedEntities.some((item2) => item1.id === item2.id))
      this.$store.commit('entity/SET_CURRENT_ENTITY', {})
    },
    getKeywordAttrByEntityId(attr, kid) {
      return this.keywordDict[kid][attr]
    },
    entityStyle(entityItem) {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities.findIndex((item) => item['uuid'] === entityItem['uuid']) !== -1) {
        return 'background: #dfe1e5'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.case-entity {
  width: 100%;
  height: calc(100% - 49px);
  position: relative;
  box-sizing: border-box;
  .entity-grid {
    width:100%;
    height:100%;
    padding-left: 10px;
    user-select: none;
    .small-grid {
      float: left;
      width: 104px;
      height: 104px;
      border: 1px dashed #D3D3D3;
      //border-bottom: 2px dashed #D3D3D3;
      text-align: center;
      line-height: 102px;
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
    //height: 100%;
    //width: 100%;
    user-select: none;
    position: absolute;
    padding-left: 10px;
    top: 0;
    left: 0;
    z-index: 10;
    font-size: 0;
    .single-entity {
      width: 100px;
      height: 100px;
      margin: 2px;
      overflow: hidden;
      display: inline-block;
      background-color: #fff;
      cursor: pointer;
      dl{
        text-align: center;
        dt{
          width:100%;
          height:30px;
          img{
            display: inline-block;
            width:30px;
            height:30px;
          }
        }
        dd{
          font-size: 12px;
          margin-top: 2px;
          margin-left: 0;
        }
      }
    }
  }
  .ghost {
    background-color: #008489;
  }
  .chosen {
    background-color: #9a6e3a;
  }
}
</style>
