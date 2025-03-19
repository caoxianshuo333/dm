<script setup lang="ts">
// 顶部筛选条件
const filterItems = ['时间', '状态', '类型', '类型']
const activeFilters = ref([false, false, false, false])

// 模拟维修工单数据
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
      return 'bg-emerald-100 text-emerald-600'
    case '未处理':
      return 'bg-amber-100 text-amber-600'
    case '已验收':
      return 'bg-blue-100 text-blue-600'
    case '已过期':
      return 'bg-red-100 text-red-600'
    default:
      return ''
  }
}

// 获取优先级标签样式
function getLevelClass(level: string) {
  switch (level) {
    case '一般':
      return 'bg-emerald-500 text-white'
    case '重要':
      return 'bg-amber-500 text-white'
    case '紧急':
      return 'bg-red-500 text-white'
    default:
      return 'bg-emerald-500 text-white'
  }
}
</script>

<template>
  <div>
    <!-- 自定义标题栏 - 覆盖系统NavBar -->
    <div class="fixed left-0 right-0 top-0 z-10 flex items-center justify-between bg-emerald-500 p-4 text-white">
      <div class="flex items-center">
        <van-icon name="arrow-left" size="24" />
        <h1 class="mx-auto flex-1 text-center text-xl font-bold">
          维修工列表
        </h1>
      </div>
      <van-icon name="ellipsis" size="24" />
    </div>

    <!-- 筛选栏 -->
    <div class="fixed left-0 right-0 top-[56px] z-10 flex border-b bg-white">
      <div
        v-for="(item, index) in filterItems"
        :key="index"
        class="flex flex-1 items-center justify-center py-3 text-center"
        @click="activeFilters[index] = !activeFilters[index]"
      >
        {{ item }}
        <van-icon
          :name="activeFilters[index] ? 'arrow-up' : 'arrow-down'"
          class="ml-1"
        />
      </div>
    </div>

    <!-- 工单列表 -->
    <div class="repair-list-container">
      <div
        v-for="(item, index) in repairList"
        :key="index"
        class="relative mb-3 rounded-lg bg-white p-4"
      >
        <!-- 优先级标签 -->
        <div
          class="absolute right-0 top-0 rounded-bl-lg rounded-tr-lg px-4 py-1 text-xs"
          :class="getLevelClass(item.level)"
        >
          {{ item.level }}
        </div>

        <!-- 工单标题 -->
        <div class="mb-3 pr-16 text-base font-medium">
          {{ item.title }}
        </div>

        <!-- 状态标签 -->
        <div class="mb-3 flex flex-wrap">
          <span
            v-for="(status, sIndex) in item.status"
            :key="sIndex"
            class="mb-1 mr-2 rounded-full px-3 py-1 text-xs"
            :class="getStatusClass(status)"
          >
            {{ status }}
          </span>
        </div>

        <!-- 底部信息 -->
        <div class="flex justify-between border-t pt-3 text-xs text-gray-500">
          <span>{{ item.company }}</span>
          <span>{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'repairDetail',
  meta: {
    title: '维修中心',
    i18n: 'layouts.repair'
  },
}
</route>

<style scoped>
/* 覆盖默认导航栏 */
:deep(.van-nav-bar) {
  display: none !important;
}

/* 修复列表容器定位 */
.repair-list-container {
  margin-top: 108px;
  padding: 12px;
  background-color: #f3f4f6;
  min-height: calc(100vh - 108px);
}
</style>
