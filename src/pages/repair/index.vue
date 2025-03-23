<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 筛选选项
const timeOptions = [
  { text: '最近一周', value: 'week' },
  { text: '最近一月', value: 'month' },
  { text: '最近三月', value: 'three_months' },
  { text: '全部', value: 'all' },
]

const statusOptions = [
  { text: '已处理', value: '已处理' },
  { text: '未处理', value: '未处理' },
  { text: '已验收', value: '已验收' },
  { text: '已过期', value: '已过期' },
  { text: '全部', value: 'all' },
]

const typeOptions = [
  { text: '一般', value: '一般' },
  { text: '重要', value: '重要' },
  { text: '紧急', value: '紧急' },
  { text: '全部', value: 'all' },
]

const otherOptions = [
  { text: '默认排序', value: 'default' },
  { text: '时间升序', value: 'time_asc' },
  { text: '时间降序', value: 'time_desc' },
]

// 当前选中的筛选值
const timeValue = ref('all')
const statusValue = ref('all')
const typeValue = ref('all')
const otherValue = ref('default')

// 懒加载相关
const loading = ref(false)
const finished = ref(false)
const repairList = ref([
  {
    title: '农肥有限公司配电室/康丰农肥低压进线柜 低压进线发生C相过压',
    status: ['已处理', '未处理', '已验收', '已过期'],
    company: '公司or车间名称',
    time: '2025-03-19 13:00:00',
    level: '一般',
  },
  {
    title: '农肥有限公司配电室/康丰农肥低压进线柜 低压进线发生C相过压',
    status: ['已处理', '未处理', '已验收', '已过期'],
    company: '公司or车间名称',
    time: '2025-03-19 13:00:00',
    level: '重要',
  },
  {
    title: '农肥有限公司配电室/康丰农肥低压进线柜 低压进线发生C相过压',
    status: ['已处理', '未处理', '已验收', '已过期'],
    company: '公司or车间名称',
    time: '2025-03-19 13:00:00',
    level: '紧急',
  },
  {
    title: '农肥有限公司配电室/康丰农肥低压进线柜 低压进线发生C相过压',
    status: ['已处理', '未处理', '已验收', '已过期'],
    company: '公司or车间名称',
    time: '2025-03-19 13:00:00',
    level: '一般',
  },
  {
    title: '农肥有限公司配电室/康丰农肥低压进线柜 低压进线发生C相过压',
    status: ['已处理', '未处理', '已验收', '已过期'],
    company: '公司or车间名称',
    time: '2025-03-19 13:00:00',
    level: '一般',
  },
])

// 获取标签背景色
function getStatusClass(status: string) {
  switch (status) {
    case '已处理':
      return 'text-wrapper_2'
    case '未处理':
      return 'text-wrapper_3'
    case '已验收':
      return 'text-wrapper_4'
    case '已过期':
      return 'text-wrapper_5'
    default:
      return ''
  }
}

// 获取优先级标签样式
function getLevelClass(level: string) {
  switch (level) {
    case '一般':
      return 'bg-emerald-500'
    case '重要':
      return 'bg-amber-500'
    case '紧急':
      return 'bg-red-500'
    default:
      return 'bg-emerald-500'
  }
}

// 模拟加载更多数据
function onLoad() {
  // 异步更新数据
  setTimeout(() => {
    if (repairList.value.length >= 15) {
      // 数据全部加载完成
      finished.value = true
      return
    }

    // 添加新的测试数据，保持与现有数据结构一致
    const newItems = [
      {
        title: '电机维修工单',
        status: ['pending'],
        company: '农肥有限公司配电室',
        time: '2023-05-20',
        level: 'high',
      },
      {
        title: '电路检修工单',
        status: ['processing'],
        company: '化工厂变电站',
        time: '2023-05-21',
        level: 'medium',
      },
    ]

    repairList.value = [...repairList.value, ...newItems]

    // 加载状态结束
    loading.value = false
  }, 1000)
}

// 点击工单项跳转到详情页
function navigateToDetail(item) {
  router.push({
    name: 'repairDetail',
    query: {
      id: item.time, // 使用time作为临时id
      title: item.title,
    },
  })
}
</script>

<template>
  <div>
    <!-- Vant筛选下拉菜单 -->
    <van-dropdown-menu class="filter-dropdown" active-color="#4dbea8">
      <van-dropdown-item v-model="timeValue" :options="timeOptions" title="时间" />
      <van-dropdown-item v-model="statusValue" :options="statusOptions" title="状态" />
      <van-dropdown-item v-model="typeValue" :options="typeOptions" title="类型" />
      <van-dropdown-item v-model="otherValue" :options="otherOptions" title="排序" />
    </van-dropdown-menu>

    <!-- 工单列表 -->
    <div class="repair-list-container">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div class="repair-list">
          <div
            v-for="(item, index) in repairList"
            :key="index"
            class="relative mt-15 list-item flex-col"
            @click="navigateToDetail(item)"
          >
            <span class="text_5 font_3 self-start">{{ item.title }}</span>
            <div class="group_5 flex-col self-stretch">
              <div class="group_6 flex-row">
                <div
                  v-for="(status, sIndex) in item.status" :key="sIndex"
                  :class="[getStatusClass(status), sIndex > 0 ? 'ml-16' : '']"
                  class="flex-col items-center justify-start"
                >
                  <span
                    :class="[
                      status === '已处理' ? 'font_4 text_6'
                      : status === '未处理' ? 'font_5'
                        : status === '已验收' ? 'font_6 text_7'
                          : 'font_7 text_8',
                    ]"
                  >{{ status }}</span>
                </div>
              </div>
              <div class="group_7 flex-row items-center justify-between">
                <span class="text_9 font_8">{{ item.company }}</span>
                <span class="text_10 font_9">{{ item.time }}</span>
              </div>
            </div>
            <div class="pos text-wrapper flex-col items-center justify-start" :class="getLevelClass(item.level)">
              <span class="text_4 font_2">{{ item.level }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'repair',
  meta: {
    title: '维修中心',
    i18n: 'layouts.repair'
  },
}
</route>

<style scoped>
/* 修复列表容器定位 */
.repair-list-container {
  max-height: calc(100vh - 108px - 50px); /* 减去顶部标题栏和过滤栏的高度以及底部TabBar的高度 */
  overflow-y: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  background-color: #f7f8fa;
}

/* Vant下拉菜单样式 */
.filter-dropdown {
  position: fixed;
  top: 46px;
  left: 0;
  right: 0;
  z-index: 10;
}

:deep(.van-dropdown-menu__bar) {
  box-shadow: none;
  background-color: #fff;
  height: 50px;
}

:deep(.van-dropdown-menu__item) {
  justify-content: center;
  font-family: SourceHanSansCN;
  font-size: 1rem;
  color: #595959;
}

:deep(.van-dropdown-menu__title--active) {
  color: #4dbea8;
}

/* 新增列表样式 */
.mt-15 {
  margin-top: 0.94rem;
}
.list {
  padding-bottom: 0.94rem;
}
.list-item {
  padding: 0.88rem 0.88rem 0.5rem;
  background-color: #ffffff;
  border-radius: 0.63rem;
  cursor: pointer;
  transition: background-color 0.2s;
}
.list-item:first-child {
  margin-top: 0;
}
.list-item:hover,
.list-item:active {
  background-color: #f5f5f5;
}
.font_3 {
  font-size: 0.88rem;
  font-family: SourceHanSansCN;
  line-height: 1.06rem;
  color: #000000;
}
.text_5 {
  width: 14.75rem;
}
.group_5 {
  margin-top: 1.88rem;
}
.group_6 {
  padding: 0 0.13rem 0.81rem;
  border-bottom: solid 0.063rem #dedede;
  display: flex;
  flex-direction: row;
}
.text-wrapper_2 {
  padding: 0.25rem 0;
  background-color: #e3faf8;
  border-radius: 0.33rem;
  width: 2.5rem;
  height: 1.19rem;
}
.font_4 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #4dbea8;
}
.text_6 {
  line-height: 0.58rem;
}
.text-wrapper_3 {
  padding: 0.25rem 0;
  background-color: #fdf3ec;
  border-radius: 0.33rem;
  width: 2.5rem;
  height: 1.19rem;
}
.font_5 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #dd7c36;
}
.text-wrapper_4 {
  padding: 0.25rem 0;
  background-color: #eff8ff;
  border-radius: 0.33rem;
  width: 2.5rem;
  height: 1.19rem;
}
.font_6 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #5685c1;
}
.text_7 {
  line-height: 0.59rem;
}
.text-wrapper_5 {
  padding: 0.25rem 0;
  background-color: #fff0f0;
  border-radius: 0.33rem;
  width: 2.5rem;
  height: 1.19rem;
}
.font_7 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #e03838;
}
.text_8 {
  line-height: 0.58rem;
}
.group_7 {
  margin-right: 0.88rem;
  padding-top: 0.63rem;
  display: flex;
}
.font_8 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #474747;
}
.text_9 {
  line-height: 0.58rem;
}
.font_9 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.75rem;
  color: #ababab;
}
.text_10 {
  width: 5.38rem;
}
.text-wrapper {
  padding: 0.38rem 0;
  border-radius: 0rem 0.63rem 0rem 0.63rem;
  width: 3.31rem;
}
.pos {
  position: absolute;
  right: 0;
  top: 0;
}
.font_2 {
  font-size: 0.88rem;
  font-family: SourceHanSansCN;
  line-height: 0.75rem;
  color: #ffffff;
}
.text_4 {
  line-height: 0.81rem;
}
.ml-16 {
  margin-left: 16px;
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.flex-col {
  display: flex;
  flex-direction: column;
}
.justify-between {
  justify-content: space-between;
}
.items-center {
  align-items: center;
}
.justify-start {
  justify-content: flex-start;
}
.self-start {
  align-self: flex-start;
}
.self-stretch {
  align-self: stretch;
}
</style>
