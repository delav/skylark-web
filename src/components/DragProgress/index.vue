<template>
  <div class="c-progress">
    <div class="c-progress-outer" :style="setProgressBgStyle" ref="progress">
      <div class="c-progress-inner" :style="setProgressStyle"></div>
      <div v-if="showSlider" class="c-progress-slider" ref="slider"
           :style="{border: `1px solid ${borderColor}`, width: `${sliderWidth}px`,height: `${sliderHeight}px`,left: `${sliderLeft}px`}"
      >
      </div>
    </div>
    <span v-if="showPerText">{{tempPercent}}%</span>
  </div>
</template>

<script>
const colorTable = {
  success: '#13ce66',
  fail: '#ff4949',
  warning: '#e6a23c',
  default: '#409EFF'
}
export default {
  name: 'DragProgress',
  props: {
    percent: {
      type: Number,
      default: 60
    },
    showSlider: {
      type: Boolean,
      default: true
    },
    showPerText: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 200
    },
    bgColor: {
      type: String,
      default: '#ebeef5'
    },
    progressColor: {
      type: String,
      default: '#409EFF'
    },
    sliderWidth: {
      type: Number,
      default: 10
    },
    sliderHeight: {
      type: Number,
      default: 20
    },
    max: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: colorTable.default
    }
  },
  data () {
    return {
      sliderLeft: 0, // 滑块相对父元素发x坐标
      progressWidth: 0, // 进度条当前的的宽度
      tempPercent: 0
    }
  },
  computed: {
    // 设置进度条的背景样式
    setProgressBgStyle () {
      return {
        background: this.bgColor,
        // 加上滑块的宽度
        width: `${this.width + this.sliderWidth}px`
      }
    },
    // 设置进度条的样式
    setProgressStyle () {
      const color = colorTable[this.type] || this.progressColor
      return {
        width: `${this.progressWidth}px`,
        background: color
      }
    },
    //滑块边框颜色
    borderColor(){
      return colorTable[this.type] || this.progressColor
    },
  },
  mounted () {
    this.sliderLeft = this.width / this.max * this.percent
    this.progressWidth = this.sliderLeft + this.sliderWidth // 滑块的x坐标加上滑块的宽度
    this.tempPercent = this.percent
    this.addListener()
  },
  methods: {
    addListener () {//注释掉滑块拖动
      const slider = this.$refs.slider
      const progress = this.$refs.progress
      let isClickSlider = false
      let distance = 0 // 滑块与点击坐标的绝对距离
      progress.onclick = (e) => {
        // 阻止事件冒泡
        if (e.target === slider) {
          return
        }
        let curX = progress.offsetLeft
        this.sliderLeft = e.offsetX - curX
        if (this.sliderLeft <= 0) {
          this.sliderLeft = 0
        }
        if (this.sliderLeft >= this.width) {
          this.sliderLeft = this.width
        }
        this._countCurPercent()
      }
      slider.onmousedown = (e) => {
        isClickSlider = true
        let curX = slider.offsetLeft
        distance = e.pageX - curX // 得出绝对距离
      }
      progress.onmousemove = (e) => {
        if (isClickSlider) {
          // 判断是否已经超出进度条的长度
          if ((e.pageX - distance) >= 0 && (e.pageX - distance) <= (this.width)) {
            this.sliderLeft = e.pageX - distance
            this._countCurPercent()
          }
        }
      }
      progress.onmouseup = () => {
        isClickSlider = false
      }
    },
    // 算出百分比
    _countCurPercent () {
      this.tempPercent = Math.ceil(parseInt(this.sliderLeft / this.width * this.max))//最大值56
      // this.progressWidth = this.sliderLeft + 20 // ⚪滑块
      this.progressWidth = this.sliderLeft + 10
      // 取整的时候宽度可能不为0，所以在0和100的时候也将宽度取整
      if (this.tempPercent <= 0) {
        this.progressWidth = 0
        this.sliderLeft = 0
      }
      if (this.tempPercent >= 100) {
        this.progressWidth = this.width + 20
        this.sliderLeft = this.width
      }
      this.$emit('percentChange', this.tempPercent)
    },
    // 监听父组件输入框变化
    handleParentChange(num){
      this.sliderLeft = num/this.max * this.width
      this.progressWidth = this.sliderLeft + 10
      if(num >= this.max){
        this.progressWidth = this.width + 20
        this.sliderLeft = this.width
      }

    }
  }
}
</script>

<style scoped lang="scss">
.c-progress {
  $width: 160px;
  $radius: 5px;
  display: flex;
  align-items: center;

  span {
    margin-left: 5px;
    font-size: 14px;
    color: #666;
  }

  .c-progress-outer {
    width: $width;
    height: 10px;
    border-radius: $radius;
    background: #ebeef5;
    position: relative;
    display: flex;
    align-items: center;

    .c-progress-inner {
      width: 100px;
      height: 10px;
      background: #409EFF;
      border-radius: $radius;
    }

    .c-progress-slider {
      width: 10px;
      height: 20px;
      border-radius: 5px;
      background: #fff;
      border: 1px solid #409EFF;
      position: absolute;
      z-index: 2;
      left: 10px;
      cursor: pointer;
    }
  }
}
</style>
