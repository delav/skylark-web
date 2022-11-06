<template>
  <div class="case-entity" id="entity" @click.right="cancelCopyEntities" @click.left="pasteEntities">
    <div class="entity-grid">
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
      v-on:keyup.delete="deleteEntities"
    >
      <template #item="{ element, index }">
        <div class="single-entity" :style="entityStyle(element)" @click="selectEntity(element, index)">
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
      selectedEntities: [],
      keyboardOnKey: '',
      isCopyFlag: false,
      copiedEntities: [],
    }
  },
  watch: {
    nodeData: {
      handler() {
        const nodeType = this.$store.state.tree.detailType
        if (nodeType === 1) {
          this.caseEntities = this.nodeData
        }
      },
      deep: true,
    }
  },
  created() {
    this.addKeyboardEvent()
  },
  computed: {
    nodeData() {
      return this.$store.state.tree.nodeData
    },
    keywordDict() {
      return this.$store.state.entity.keywordsObject
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
        }
      }
    },
    selectEntity(entityItem, index) {
      if (this.isCopyFlag) {
        this.pasteEntities(index)
      } else {
        if (this.keyboardOnKey === 'shift') {
          if (this.selectedEntities !== []) {
            let startIndex = this.caseEntities.findIndex((item) => item['uuid'] === this.selectedEntities[0]['uuid'])
            this.selectedEntities = this.caseEntities.slice(startIndex, index+1)
          }
        } else if (this.keyboardOnKey === 'ctrl') {
          if (this.selectedEntities.findIndex((item) => item['uuid'] === entityItem['uuid']) === -1) {
            this.selectedEntities.push(entityItem)
          }
        } else {
          this.selectedEntities = [entityItem]
        }
        this.$store.commit('entity/SET_CURRENT_ENTITY', entityItem)
      }
    },
    copyEntities() {
      const selectedEntities = this.$store.state.entity.selectedEntities
      if (selectedEntities !== []) {
        this.copiedEntities = JSON.parse(JSON.stringify(selectedEntities))
        this.$store.commit('entity/SET_CASE_CHANGE', true)
        this.$store.commit('entity/SET_SELECTED_ENTITIES', [])
        const body = document.querySelector('#case-entity')
        body.style.cursor= 'copy'
        body.oncontextmenu = this.cancelCopyEntities
        this.$message.success('复制成功，编辑区域内右键取消')
      }
    },
    pasteEntities(index) {
      this.copiedEntities.unshift(index, 0)
      Array.prototype.splice.apply(this.caseEntities, this.copyEntities)
      this.isCopyFlag = false
      this.copiedEntities = []
      this.$store.commit('entity/SET_CASE_CHANGE', true)
      const body = document.querySelector('#case-entity')
      body.style.cursor= 'auto'
    },
    cancelCopyEntities() {
      this.isCopyFlag = false
      this.copiedEntities = []
      const body = document.querySelector('#case-entity')
      body.style.cursor= 'auto'
    },
    deleteEntities() {
      let inputFlag = false
      let oInputs = document.querySelectorAll('input')
      for (let ele of oInputs) {
        if (ele === document.activeElement) {
          inputFlag = true
        }
      }
      this.inputStatus = inputFlag
      if (!inputFlag) {
        for (let i = this.selectedContent.length - 1; i >= 0; i--) {
          let delItem = this.selectedContent[i]
          let delIndex = delItem.sort - 1
          this.caseEntities.splice(delIndex, 1)
          // console.log(JSON.stringify(copyCaseContent))
        }
        // this.caseContent = copyCaseContent
        for (let i = 0; i < this.caseEntities.length; i++) {
          this.caseEntities[i]['sort'] = i + 1
        }
        // console.log(this.caseContent)
        // 用例内容变化
        this.caseChange = true
        this.selectedContent = []
        this.initKeywordParams()
      }
    },
    getKeywordAttrByEntityId(attr, kid) {
      return this.keywordDict[kid][attr]
    },
    entityStyle(entityItem) {
      if (this.selectedEntities.findIndex((item) => item['uuid'] === entityItem['uuid']) !== -1) {
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
  border-bottom: 1px solid #dcdcdc;
  .entity-grid {
    width:100%;
    height:100%;
    //padding: 5px;
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
    height: 100%;
    width: 100%;
    user-select: none;
    position: absolute;
    //padding: 5px;
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
