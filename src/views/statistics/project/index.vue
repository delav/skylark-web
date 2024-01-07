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
import { fetchProjectRecordInfo, fetchProjectBuildInfo } from "@/api/statistics";

export default {
  name: 'ProjectView',
  mounted() {
    this.$nextTick(() =>{
      const projectId = this.$route.query.id
      this.loadProjectCharts(projectId)
    })
  },
  watch: {
    '$route.query.id': {
      handler(val) {
        this.loadProjectCharts(val)
      }
    }
  },
  methods: {
    loadProjectCharts(projectId) {
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
      axios.all([fetchProjectRecordInfo(projectId), fetchProjectBuildInfo(projectId)]).then(
        axios.spread((r1, r2) => {
          const projectEnvRate = r1.data['env_rate']
          const projectRegionRate = r1.data['region_rate']
          const caseIncreaseInfo = r1.data['case_rate']
          const envRateObjMap = Object.entries(projectEnvRate).map(
            ([key, value]) => ({ name: key, value: value })
          )
          const buildPassRate = r2.data['pass_rate']
          const buildDurationRate = r2.data['duration_rate']
          that.setChart1(chart1, Object.keys(buildPassRate), buildPassRate)
          that.setChart2(chart2, envRateObjMap)
          that.setChart3(chart3, Object.keys(projectRegionRate), Object.values(projectRegionRate))
          that.setChart4(chart4, Object.keys(caseIncreaseInfo), Object.values(caseIncreaseInfo))
          that.setChart5(chart5, r2.data['case_ratio'])
          that.setChart6(chart6, Object.keys(buildDurationRate), buildDurationRate)
          that.setChart7(chart7, r2.data['case_duration'])
        })
      ).catch(() => {
        chart1.hideLoading()
        chart2.hideLoading()
        chart3.hideLoading()
        chart4.hideLoading()
        chart5.hideLoading()
        chart6.hideLoading()
        chart7.hideLoading()
      })
    },
    setChart1(chartObj, xData, dataObj) {
      chartObj.hideLoading()
      const seriesList = Object.entries(dataObj).map(
        ([key, value]) => ({ name: key, data: value, type: 'line' })
      )
      chartObj.setOption({
        title: {
          text: '执行通过率(%)'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value',
          max: 100
        },
        legend: {
          data: xData,
          icon: 'rect'
        },
        series: seriesList
      })
    },
    setChart2(chartObj, data) {
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '环境执行比例'
        },
        series: [
          {
            type: 'pie',
            data: data
          }
        ]
      })
    },
    setChart3(chartObj, xData, yData) {
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
          type: 'value',
          minInterval: 1
        },
        series: [
          {
            data: yData,
            type: 'line'
          }
        ]
      })
    },
    setChart5(chartObj, dataList) {
      chartObj.hideLoading()
      const xData = []
      const yDataObj = {Passed: [], Failed: [], Skipped: []}
      for (let i = 0; i < dataList.length; i++) {
        xData.push(dataList[i]['name'])
        yDataObj.Passed.push(dataList[i]['values'][0])
        yDataObj.Failed.push(dataList[i]['values'][1])
        yDataObj.Skipped.push(dataList[i]['values'][2])
      }
      const seriesList = Object.entries(yDataObj).map(
        ([key, value]) => ({ name: key.toString(), data: value, type: 'bar', stack: 'x' })
      )
      chartObj.setOption({
        title: {
          text: '用例失败占比'
        },
        xAxis: {
          data: xData,
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        legend: {},
        series: seriesList
      })
    },
    setChart6(chartObj, xData, dataObj) {
      chartObj.hideLoading()
      const seriesList = Object.entries(dataObj).map(
        ([key, value]) => ({ name: key, data: value, type: 'line' })
      )
      chartObj.setOption({
        title: {
          text: '项目执行耗时(s)'
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        legend: {
          data: xData,
          icon: 'rect'
        },
        series: seriesList
      })
    },
    setChart7(chartObj, dataList) {
      chartObj.hideLoading()
      const xData = []
      const yData = []
      for (let i = 0; i < dataList.length; i++) {
        xData.push(dataList[i]['name'])
        yData.push(dataList[i]['values'])
      }
      chartObj.setOption({
        title: {
          text: '用例平均耗时(s)'
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {},
        series: [
          {
            name: '执行耗时',
            data: yData,
            type: 'bar',
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
