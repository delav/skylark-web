<template>
  <div class="case-detail">
    <div class="headers"></div>
    <div class="entities" id="entity" @click.right="cancelCopyEntities" @click.left="pasteEntities">
      <div class="entity-grid">
        <div class="small-grid" v-for="n in 100" :key="n">
          <span>{{n}}</span>
        </div>
      </div>
      <div class="entity-info">
<!--        <template>-->
<!--          <draggable v-model="caseEntities" id="editArea" :group="entityGroup">-->
<!--            <dl v-for="(item, index) in caseEntities" :key="index"-->
<!--                :class="selectedEntities.includes(item)? 'chosen':''"-->
<!--                :style="isInt(index, gripColumn)? 'margin-left:2px':'margin-left:6px'"-->
<!--                @click="clickEntity(selectedEntities, item)">-->
<!--              <dt>-->
<!--                <img :src="getInfoByKeywordId(item.keyword, 'image')" alt="">-->
<!--              </dt>-->
<!--              <dd>{{getInfoByKeywordId(item.keyword, 'alias')}}</dd>-->
<!--              <dd>{{item['out_args']}}</dd>-->
<!--            </dl>-->
<!--          </draggable>-->
<!--        </template>-->
      </div>
    </div>
    <div class="resize-h" id="resize-y">
      <svg-icon icon-class="more-indicator" class="ellipsis-icon"></svg-icon>
    </div>
    <div class='parameters' id="param">bottom</div>
  </div>
</template>

<script>
import { dragHController } from '@/utils/resize'
import SvgIcon from '@/components/SvgIcon'
// import draggable from 'vuedraggable'
export default {
  name: 'CaseDetail',
  components: {
    SvgIcon,
    // draggable
  },
  data () {
    return {
      caseEntities: [],
      keywordList: [],
      selectedEntities: [],
      gripColumn: 0,
      entityGroup: {
        name: 'entity', //组名entity
        pull: false, //是否允许拖出当前组
        put: true, //是否允许拖入当前组
      }
    }
  },
  mounted() {
    dragHController('entity', 'param', 'resize-y')
    // window.onresize = () => {
    //   this.calcNum()
    // }
    // this.calcNum()
  },
  beforeUnmount() {
    // window.onresize = null
  },
  methods: {
    clickEntity(caseArray, item) {
      console.log(item)
      console.log(caseArray)
    },
    isInt(num1, num2) {
      // console.log((num1 / num2) - Math.floor(num1 / num2) === 0)
      return ((num1 / num2) - Math.floor(num1 / num2)) === 0
    },
    calcNum () {
      let oContainer = document.querySelector('.entity-grid')
      let oChild = document.querySelector('.entity-grid .small-grid')
      this.gripColumn = Math.floor(oContainer.clientWidth / oChild.clientWidth)
    },
    getInfoByKeywordId (keywordId, field) {
      let keywords = this.keywordList
      for (let i = 0; keywords.length; i++) {
        let item = keywords[i]
        if (item.id === keywordId) {
          return item[field]
        }
      }
      return ''
    },
    cancelCopyEntities() {},
    pasteEntities() {}
  }
}
</script>

<style lang="scss" scoped>
.case-detail {
  width: 100%;
  height: 100%;
  position: relative;

  .headers {
    height: 40px;
    border-bottom: 2px dashed #222222;
  }

  .entities {
    width: 100%;
    height: 60%;
    position: relative;
    box-sizing: border-box;
    border-bottom:1px solid #dcdcdc;
    .entity-grid {
      width:100%;
      height:100%;
      overflow-x: auto;
      .small-grid {
        float: left;
        width: 104px;
        height: 104px;
        border-right: 2px dashed #D3D3D3;
        border-bottom: 2px dashed #D3D3D3;
        text-align: center;
        line-height: 100px;
        position: relative;
        color: #A9A9A9;
        i{
          position: absolute;
          right: -15px;
          top:0;
          font-size: 30px;
          color:#D3D3D3;
        }
        &:last-child i:last-child{
          font-size: 0
        }
      }
    }

    .entity-info {
      overflow-x: auto;
      -moz-user-select:none;
      -webkit-user-select:none;
      -ms-user-select:none;
      user-select:none;
      position: absolute;
      top:0;
      left: 0;
      z-index: 1;
      /*width:100%;*/
      min-height: auto;
      padding-top:2px;
      dl{
        width: 100px;
        height: 100px;
        overflow: hidden;
        box-sizing: border-box;
        padding: 10px 5px 5px 5px;
        margin: 0 0 2px 0;
        text-align: center;
        display: inline-block;
        background-color:#fff;
        &:hover{
          cursor: pointer;
        }
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
  .parameters {
    width: 100%;
    height: calc(40% - 5px - 40px);
    position: relative;
  }

  .resize-h {
    cursor: row-resize;
    position: relative;
    background-color: #d6d6d6;
    width: 100%;
    height: 5PX;
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
