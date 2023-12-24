<template>
  <div class="overview">
    <div class="content">
      <div class="count-view">
        <el-row :gutter="20">
          <el-col :span="6">
            <count-card
              i-class="statistics-project"
              i-color="#7ad835"
              description="总项目数"
              :count="overviewData.projectCount"
            ></count-card>
          </el-col>
          <el-col :span="6">
            <count-card
              i-class="statistics-case"
              i-color="#fa7d03"
              description="总用例数"
              :count="overviewData.caseCount"
            ></count-card>
          </el-col>
          <el-col :span="6">
            <count-card
              i-class="statistics-build"
              i-color="#4886ff"
              description="总执行次数"
              :count="overviewData.buildCount"
            ></count-card>
          </el-col>
          <el-col :span="6">
            <count-card
              i-class="statistics-periodic"
              i-color="#ff484c"
              description="定时任务数"
              :count="overviewData.periodicCount"
            ></count-card>
          </el-col>
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
import { fetchOverview, fetchAllProjectInfo, fetchIncreaseInfo } from "@/api/statistics";

export default {
  name: 'Overview',
  components: {
    CountCard,
  },
  data() {
    return {
      overviewData: {
        projectCount: 0,
        caseCount: 0,
        buildCount: 0,
        periodicCount: 0
      }
    }
  },
  mounted() {
    this.getOverviewData()
    this.$nextTick(() =>{
      this.loadAllCharts()
    })
  },
  methods: {
    getOverviewData() {
      fetchOverview().then(response => {
        const data = response.data
        this.overviewData.projectCount = data['project_count']
        this.overviewData.caseCount = data['case_count']
        this.overviewData.buildCount = data['build_count']
        this.overviewData.periodicCount = data['periodic_count']
      })
    },
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
      axios.all([fetchAllProjectInfo(), fetchIncreaseInfo()]).then(
        axios.spread((r1, r2) => {
          const caseIncreaseInfo = r2.data['case_increase']
          const buildIncreaseInfo = r2.data['build_increase']
          const projectNameList = []
          const projectCaseList = []
          const projectBuildList = []
          for (let i = 0; i < r1.data.length; i++) {
            projectNameList.push(r1.data[i]['project_name'])
            projectCaseList.push(r1.data[i]['total_case'])
            projectBuildList.push(r1.data[i]['total_build'])
          }
          that.setMainChart(mainChart, projectNameList, projectCaseList, projectBuildList)
          that.setChart1(chart1, Object.keys(caseIncreaseInfo), Object.values(caseIncreaseInfo))
          that.setChart2(chart2, Object.keys(buildIncreaseInfo), Object.values(buildIncreaseInfo))
          that.setChart3(chart3, [], [])
          that.setChart4(chart4, [], [])
        })
      )
    },
    setMainChart(chartObj, xData, yData1, yData2) {
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
            data: yData1
          },
          {
            name: '执行次数',
            type: 'bar',
            data: yData2
          }
        ]
      })
    },
    setChart1(chartObj, xData, yData) {
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
    setChart2(chartObj, xData, yData) {
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
