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
          console.log(r2.data)
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
          that.setChart5(chart5, [], [])
          that.setChart6(chart6, Object.keys(buildDurationRate), buildDurationRate)
          that.setChart7(chart7, [], [])
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
    setChart5(chartObj, xData, yData1, yData2) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData1 = [25, 4, 15, 30, 27, 28, 0]
      yData2 = [5, 26, 15, 0, 3, 2, 30]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '用例失败率(%)'
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
            data: yData1,
            type: 'bar',
            stack: 'x'
          },
          {
            data: yData2,
            type: 'bar',
            stack: 'x'
          }
        ]
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
    setChart7(chartObj, xData, yData) {
      xData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      yData = [220, 182, 191, 234, 290, 330, 310]
      chartObj.hideLoading()
      chartObj.setOption({
        title: {
          text: '用例执行耗时(s)'
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
