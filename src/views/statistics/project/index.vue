<template>
  <div class="project-statistics">
    <div class="content">
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="16">
          <div class="chart-card" id="pro-chart1" style="height: 500px;max-width: 100%"></div>
        </el-col>
        <el-col :span="8">
          <div class="chart-card" id="pro-chart2" style="height: 240px;max-width: 100%"></div>
          <div class="chart-card" id="pro-chart3" style="height: 240px;max-width: 100%; margin-top: 20px"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="12">
          <div class="chart-card" id="pro-chart4" style="height: 500px;max-width: 100%"></div>
        </el-col>
        <el-col :span="12">
          <div class="chart-card" id="pro-chart5" style="height: 500px;max-width: 100%"></div>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom: 20px">
        <el-col :span="12">
          <div class="chart-card" id="pro-chart6" style="height: 500px;max-width: 100%"></div>
        </el-col>
        <el-col :span="12">
          <div class="chart-card" id="pro-chart7" style="height: 500px;max-width: 100%"></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { fetchBuildInfo, fetchCaseInfo } from "@/api/statistics";

export default {
  name: 'ProjectView',
  mounted() {
    this.$nextTick(() =>{
      this.loadAllCharts()
    })
  },
  methods: {
    loadAllCharts() {
      const that = this
      const chart1 = this.$echarts.init(document.getElementById('pro-chart1'))
      const chart2 = this.$echarts.init(document.getElementById('pro-chart2'))
      const chart3 = this.$echarts.init(document.getElementById('pro-chart3'))
      const chart4 = this.$echarts.init(document.getElementById('pro-chart4'))
      const chart5 = this.$echarts.init(document.getElementById('pro-chart5'))
      const chart6 = this.$echarts.init(document.getElementById('pro-chart6'))
      const chart7 = this.$echarts.init(document.getElementById('pro-chart7'))
      chart1.showLoading()
      chart2.showLoading()
      chart3.showLoading()
      chart4.showLoading()
      chart5.showLoading()
      chart6.showLoading()
      chart7.showLoading()
      axios.all([fetchCaseInfo(), fetchBuildInfo()]).then(
        axios.spread((r1, r2) => {
          console.log(r1)
          console.log(r2)
          that.setChart1(chart1, [], [])
          that.setChart2(chart2, [], [])
          that.setChart3(chart3, [], [])
          that.setChart4(chart4, [], [])
          that.setChart5(chart5, [], [])
          that.setChart6(chart6, [], [])
          that.setChart7(chart7, [], [])
        })
      )
    },
    setChart1(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '总体信息'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line'
          }
        ]
      })
    },
    setChart2(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [
        {
          value: 335,
          name: 'TEST'
        },
        {
          value: 234,
          name: 'UAT'
        },
        {
          value: 1548,
          name: 'STAG'
        }
      ]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '环境执行比例'
        },
        series: [
          {
            type: 'pie',
            data: yData
          }
        ]
      })
    },
    setChart3(chartObj, xData, yData) {
      xData = ['BR', 'CO', 'SG', 'MY', 'CL', 'ID', 'PH']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '地区执行次数'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            type: 'bar',
            data: yData
          }
        ]
      })
    },
    setChart4(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [89, 84, 89, 94, 92, 88, 86]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '通过率趋势'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          data: ['BR', 'ID', 'CO', 'MY', 'PH', 'SG'],
          icon: 'rect'
        },
        series: [
          {
            name: 'BR',
            data: yData,
            type: 'line'
          },
          {
            name: 'ID',
            data: [99, 94, 89, 91, 96, 89, 96],
            type: 'line'
          },
          {
            name: 'CO',
            data: [94, 74, 99, 84, 92, 78, 89],
            type: 'line'
          },
          {
            name: 'MY',
            data: [81, 79, 89, 84, 82, 88, 86],
            type: 'line'
          },
          {
            name: 'PH',
            data: [90, 60, 85, 74, 78, 80, 95],
            type: 'line'
          },
          {
            name: 'SG',
            data: [76, 75, 76, 93, 96, 83, 99],
            type: 'line'
          }
        ]
      })
    },
    setChart5(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '新增用例'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: yData,
            type: 'line'
          }
        ]
      })
    },
    setChart6(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '项目执行耗时'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          data: ['BR', 'ID', 'CO', 'MY', 'PH', 'SG'],
          icon: 'rect'
        },
        series: [
          {
            name: 'BR',
            data: yData,
            type: 'line'
          },
          {
            name: 'ID',
            data: [99, 94, 89, 91, 96, 89, 96],
            type: 'line'
          },
          {
            name: 'CO',
            data: [94, 74, 99, 84, 92, 78, 89],
            type: 'line'
          },
          {
            name: 'MY',
            data: [81, 79, 89, 84, 82, 88, 86],
            type: 'line'
          },
          {
            name: 'PH',
            data: [90, 60, 85, 74, 78, 80, 95],
            type: 'line'
          },
          {
            name: 'SG',
            data: [76, 75, 76, 93, 96, 83, 99],
            type: 'line'
          }
        ]
      })
    },
    setChart7(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [220, 182, 191, 234, 290, 330, 310]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '用例执行耗时'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {},
        series: [
          {
            data: yData,
            type: 'scatter'
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.project-statistics {
  width: 100%;
  height: 100%;
  .content {
    padding: 0 5px;
    .chart-card {
      position: relative;
      display: flex;
      flex-direction: column;
      min-width: 0;
      word-wrap: break-word;
      background-color: #fff;
      background-clip: border-box;
      border: 1px solid rgba(0, 0, 0, .08);
      border-radius: 5px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, .12);
      padding: 5px;
      .card-body {
        padding: 20px 25px;
        display: flex;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
        align-items: center;
      }
    }
  }
}
</style>
