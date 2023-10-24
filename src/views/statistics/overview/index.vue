<template>
  <div class="overview">
    <div class="content">
      <div class="count-view">
        <el-row :gutter="20">
          <el-col :span="6">
            <count-card i-class="statistics-project" i-color="#7ad835" description="总项目数" :count="12"></count-card>
          </el-col>
          <el-col :span="6">
            <count-card i-class="statistics-case" i-color="#fa7d03" description="总用例数" :count="358"></count-card></el-col>
          <el-col :span="6">
            <count-card i-class="statistics-build" i-color="#4886ff" description="总执行次数" :count="159"></count-card></el-col>
          <el-col :span="6">
            <count-card i-class="statistics-rate" i-color="#ff484c" description="总体通过率" :count="81.20"></count-card></el-col>
        </el-row>
      </div>
      <div class="chart-view">
        <el-row :gutter="20">
          <el-col :span="16">
            <div class="chart-card" id="mainChart" style="height: 500px;max-width: 100%"></div>
          </el-col>
          <el-col :span="8">
            <div class="chart-card" id="chart1" style="height: 240px;max-width: 100%"></div>
            <div class="chart-card" id="chart2" style="height: 240px;max-width: 100%; margin-top: 20px"></div>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="margin-top: 20px">
          <el-col :span="12">
            <div class="chart-card" id="chart3" style="height: 500px;max-width: 100%"></div>
          </el-col>
          <el-col :span="12">
            <div class="chart-card" id="chart4" style="height: 500px;max-width: 100%"></div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import CountCard from "@/views/statistics/components/CountCard";
import { fetchCaseInfo, fetchBuildInfo } from "@/api/statistics";

export default {
  name: 'Overview',
  components: {
    CountCard,
  },
  data() {
    return {
    }
  },
  mounted() {
    this.$nextTick(() =>{
      this.loadAllCharts()
    })
  },
  methods: {
    loadAllCharts() {
      const that = this
      const mainChart = this.$echarts.init(document.getElementById('mainChart'))
      const chart1 = this.$echarts.init(document.getElementById('chart1'))
      const chart2 = this.$echarts.init(document.getElementById('chart2'))
      const chart3 = this.$echarts.init(document.getElementById('chart3'))
      const chart4 = this.$echarts.init(document.getElementById('chart4'))
      mainChart.showLoading()
      chart1.showLoading()
      chart2.showLoading()
      chart3.showLoading()
      chart4.showLoading()
      axios.all([fetchCaseInfo(), fetchBuildInfo()]).then(
        axios.spread((r1, r2) => {
          console.log(r1)
          console.log(r2)
          that.setMainChart(mainChart, [], [])
          that.setChart1(chart1, [], [])
          that.setChart2(chart2, [], [])
          that.setChart3(chart3, [], [])
          that.setChart4(chart4, [], [])
        })
      )
    },
    setMainChart(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '项目总览'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: '用例总数',
            type: 'bar',
            data: yData
          },
          {
            name: '执行次数',
            type: 'bar',
            data: [23, 24, 18, 25, 27, 28, 25]
          },
          {
            name: '平均通过率',
            type: 'bar',
            data: [26, 21, 15, 28, 25, 28, 21]
          },
        ]
      })
    },
    setChart1(chartObj, xData, yData) {
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
    setChart2(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '执行频次'
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
    setChart3(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '数据示例'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: '数据',
            type: 'bar',
            data: yData
          }
        ]
      })
    },
    setChart4(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [23, 24, 18, 25, 27, 28, 25]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '数据示例'
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: '数据',
            type: 'bar',
            data: yData
          }
        ]
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.overview {
  width: 100%;
  height: 100%;
  .content {
    padding: 0 5px;
    .count-view {
      margin-bottom: 15px;
    }
    .chart-view {
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
      }
    }
  }
}
</style>
