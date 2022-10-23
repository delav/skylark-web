<template>
  <div class="case-entity">
    <dl :class="selectedEntities.includes(entityData)? 'chosen':''">
      <dt>
        <img :src="entityData.image" alt="">
      </dt>
      <dd>{{entityData['ext_name']}}</dd>
      <dd>{{entityData['out_args']}}</dd>
    </dl>
  </div>
</template>

<script>
export default {
  name: 'CaseEntity',
  props: {
    entityData: {
      type: Object,
    },
    gripColumn: {
      type: Number,
    }
  },
  computed: {
    selectedEntities() {
      return this.$store.state.entity.selectedEntities
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.case-entity {
  user-select:none;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  min-height: auto;
  padding-top: 2px;
  dl{
    width: 100px;
    height: 100px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 10px 5px 5px 5px;
    margin: 0 0 2px 0;
    text-align: center;
    display: inline-block;
    background-color: #fff;
    &:hover{
      cursor: pointer;
    }
    dt{
      width: 100%;
      height: 30px;
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
</style>
