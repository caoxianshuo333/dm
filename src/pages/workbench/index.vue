<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'

const { t } = useI18n()

const router = useRouter()

// 待办事项数据
const data = reactive({
  items: [
    {
      type: 'repair',
      title: t('workbench.factoryName'),
      company: t('workbench.companyName'),
      date: '2025-03-19',
      days: 2,
    },
    {
      type: 'repair',
      title: t('workbench.factoryName'),
      company: t('workbench.companyName'),
      date: '2025-03-20',
      days: 3,
    },
    {
      type: 'repair',
      title: t('workbench.factoryName'),
      company: t('workbench.companyName'),
      date: '2025-03-21',
      days: 4,
    },
  ],
})

// 懒加载相关
const loading = ref(false)
const finished = ref(false)
const todoList = ref([...data.items])

// 模拟加载更多数据
function onLoad() {
  // 异步更新数据
  setTimeout(() => {
    if (todoList.value.length >= 15) {
      // 数据全部加载完成
      finished.value = true
      return
    }

    // 添加新的测试数据
    const newItems = [
      {
        type: 'inspection',
        title: t('workbench.factoryName'),
        company: t('workbench.companyName'),
        date: '2025-03-22',
        days: 5,
      },
      {
        type: 'maintenance',
        title: t('workbench.factoryName'),
        company: t('workbench.companyName'),
        date: '2025-03-23',
        days: 6,
      },
    ]

    todoList.value = [...todoList.value, ...newItems]

    // 加载状态结束
    loading.value = false
  }, 1000)
}

// 应用数据
const apps = [
  {
    name: t('workbench.repair'),
    icon: 'https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=87cd60ed1407218291efb7359a280dac.png',
    route: '/repair',
  },
  {
    name: t('workbench.inspection'),
    icon: 'https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=0f138498464db1ffcfee6bbd0dc653c3.png',
    route: '/inspection',
  },
  {
    name: t('workbench.maintenance'),
    icon: 'https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=59a0cf47375a59a4306ce81664522278.png',
    route: '/maintenance',
  },
]

// 统计数据
const stats = [
  { value: 123, label: t('workbench.pendingOrders') },
  { value: 5, label: t('workbench.pendingOrders') },
  { value: 4, label: t('workbench.pendingOrders') },
  { value: 5, label: t('workbench.pendingOrders') },
]

// 跳转到应用
function navigateToApp(route) {
  router.push(route)
}
</script>

<template>
  <div class="group flex-col">
    <!-- 顶部背景和标题区域 -->
    <div class="section flex-col self-start">
      <div class="group_2 relative flex-col items-start justify-start">
        <span class="text">{{ t('workbench.title') }}</span>
        <img
          class="pos image_2"
          src="https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=d24f552cbc4382706e7c17c1d381d977.png"
        >
      </div>
    </div>

    <!-- 用户信息卡片 -->
    <div class="section_3 relative flex-row self-stretch justify-between">
      <div class="flex-row items-center self-center">
        <van-image
          class="image_3"
          round
          src="https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=59c51a00906140a2748731603ff43c93.png"
        />
        <div class="ml-25 flex-col items-start">
          <span class="text_2">{{ t('workbench.boss') }}</span>
          <span class="text_4 font mt-7">{{ t('workbench.cto') }}</span>
        </div>
      </div>
      <div class="group_3 relative flex-col items-center self-start justify-start">
        <van-icon name="bell" class="image_4" />
        <van-badge dot class="pos_2" />
      </div>
    </div>

    <!-- 数据统计区域 -->
    <div class="group_5 flex-col self-stretch">
      <div class="section_4 flex-col justify-start">
        <van-grid :column-num="4" :border="false">
          <van-grid-item v-for="(stat, index) in stats" :key="index">
            <div class="group_6 flex-col items-center">
              <span class="font_2" :class="`text_${index === 0 ? '16' : (index === 2 ? '1' : '')}`">{{ stat.value }}</span>
              <span class="font mt-16">{{ stat.label }}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 应用列表 -->
      <div class="section_5 mt-15 flex-col">
        <div class="flex-row">
          <div class="section_6" />
          <span class="font_3 ml-9">{{ t('workbench.appList') }}</span>
        </div>
        <van-grid :column-num="3" :border="false" class="mt-9">
          <van-grid-item v-for="(app, index) in apps" :key="index" @click="navigateToApp(app.route)">
            <div class="group_7 flex-col items-center">
              <van-image
                class="image_5"
                :src="app.icon"
              />
              <span class="font mt-14">{{ app.name }}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>

      <!-- 待办列表 -->
      <div class="section_7 mt-15 flex-col">
        <div class="group_8 flex-row">
          <div class="section_6" />
          <span class="font_3 text_6 ml-9">{{ t('workbench.todoList') }}</span>
        </div>
        <div class="todo-list-container">
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell-group :border="false">
              <van-cell v-for="(item, index) in todoList" :key="index" :border="false" class="todo-cell">
                <div class="list-item flex-col">
                  <div class="flex-row items-center justify-between">
                    <div class="flex-row items-center">
                      <van-tag type="primary" color="#7ac7cc" class="text-wrapper_2">
                        <span class="font_6">{{ t(`workbench.${item.type}`) }}</span>
                      </van-tag>
                      <span class="font_5 ml-5">{{ item.title }}</span>
                    </div>
                    <span class="text_7 font_4">{{ item.days }}</span>
                  </div>
                  <div class="group_13 mt-8 flex-row justify-between">
                    <div class="flex-row items-baseline">
                      <span class="text_8 font_7">{{ item.company }}</span>
                      <span class="font_8 ml-12">{{ item.date }}</span>
                    </div>
                    <span class="font_9 text_9">{{ t('workbench.remainingDays') }}</span>
                  </div>
                </div>
              </van-cell>
            </van-cell-group>
          </van-list>
        </div>
      </div>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'workbench',
  meta: {
    title: '工作台',
    i18n: 'layouts.workbench'
  },
}
</route>

<style scoped>
.ml-25 {
  margin-left: 1.56rem;
}
.mt-7 {
  margin-top: 0.44rem;
}
.mt-8 {
  margin-top: 0.5rem;
}
.mt-13 {
  margin-top: 0.81rem;
}
.mt-9 {
  margin-top: 0.56rem;
}
.mt-14 {
  margin-top: 0.88rem;
}
.mt-15 {
  margin-top: 0.94rem;
}
.mt-16 {
  margin-top: 1rem;
}
.ml-9 {
  margin-left: 0.56rem;
}
.ml-5 {
  margin-left: 0.31rem;
}
.ml-12 {
  margin-left: 0.75rem;
}
.mt-5 {
  margin-top: 0.31rem;
}
.group {
  overflow-x: hidden;
  min-height: 100vh;
  background-color: #f7f8fa;
}
.section {
  padding-bottom: 0.28rem;
  background-image: url('https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=5dac579e379dd3a26b0c800e89696687.png');
  background-size: 100% 100%;
  width: 100%;
  height: 13.39rem;
}
.section_2 {
  margin-right: 1.1rem;
  background-color: #00000000;
}
.image-wrapper {
  background-image: url('https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=c8c0ab5456b8eab60c6ac6afa25c7d98.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 100%;
}
.image {
  width: 100%;
  height: 11.2821vw;
}
.group_2 {
  margin-top: -1.39rem;
  padding: 3.71rem 0 6.7rem;
}
.text {
  margin-left: 1.82rem;
  color: #ffffff;
  font-size: 1.44rem;
  font-family: SourceHanSansCN;
  line-height: 1.35rem;
}
.image_2 {
  width: 11.75rem;
  height: 11.75rem;
}
.pos {
  position: absolute;
  right: 0;
  bottom: 0;
}
.section_3 {
  margin: -4.26rem 1.69rem 0 1.25rem;
  padding: 0.81rem 1rem 0.94rem;
  background-image: url('https://ide.code.fun/api/image?token=67dedf584ae84d00122aa7a8&name=b57fdda76fd9401082aaae760ccb7d4f.png');
  background-position: 0% 0%;
  background-size: 21.44rem 4.94rem;
  background-repeat: no-repeat;
}
.image_3 {
  width: 3.19rem;
  height: 3.19rem;
}
.text_2 {
  color: #000000;
  font-size: 1.25rem;
  font-family: SourceHanSansCN;
  line-height: 1.17rem;
}
.font {
  font-size: 1rem;
  font-family: SourceHanSansCN;
  line-height: 0.93rem;
  color: #474747;
}
.text_4 {
  color: #8c8c8c;
  line-height: 0.94rem;
}
.group_3 {
  margin-right: 0.44rem;
  margin-top: 0.31rem;
  width: 1.88rem;
}
.image_4 {
  width: 1.63rem;
  height: 1.69rem;
  font-size: 1.6rem;
  color: #333;
}
.text-wrapper {
  padding: 0.21rem 0 0.17rem;
  background-color: #d94141;
  border-radius: 50%;
  width: 0.75rem;
}
.pos_2 {
  position: absolute;
  right: 0;
  top: 0.94rem;
}
.text_3 {
  color: #ffffff;
  font-size: 0.5rem;
  font-family: SourceHanSansCN;
  line-height: 0.37rem;
}
.group_5 {
  margin: 0.75rem 1.44rem 0 1.31rem;
}
.section_4 {
  padding: 1.05rem 0 0.49rem;
  background-color: #ffffff;
  border-radius: 0.63rem;
}
.group_6 {
  flex: 1 1 4.82rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.font_2 {
  font-size: 1.81rem;
  font-family: SourceHanSansCN;
  line-height: 1.36rem;
  color: #2e2e2e;
}
.text_16 {
  line-height: 1.39rem;
}
.text_1 {
  line-height: 1.34rem;
}
.section_5 {
  padding: 1.06rem 0.69rem 0.68rem 0.69rem;
  background-color: #ffffff;
  border-radius: 0.63rem;
}
.section_6 {
  background-color: #59c69b;
  width: 0.19rem;
  height: 1.13rem;
}
.font_3 {
  font-size: 1.13rem;
  font-family: SourceHanSansCN;
  line-height: 1.08rem;
  font-weight: 700;
  color: #474747;
}
.group_7 {
  flex: 1 1 6.14rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.image_5 {
  width: 3.12rem;
  height: 3.12rem;
}
.text_5 {
  line-height: 0.93rem;
}
.image_1 {
  margin-left: 0.29rem;
}
.text_18 {
  line-height: 0.94rem;
}
.text_17 {
  line-height: 0.94rem;
}
.section_7 {
  margin-left: 0.19rem;
  padding: 0.81rem 0.5rem 1.69rem;
  background-color: #ffffff;
  border-radius: 0.63rem;
}
.group_8 {
  padding: 0 0.25rem;
}
.text_6 {
  line-height: 1.07rem;
}
.todo-cell {
  padding: 0;
}
.list-item {
  padding: 1.1rem 0 0.91rem;
  border-bottom: solid 0.063rem #dedede;
}
.text-wrapper_2 {
  border-radius: 0.25rem;
  width: 2.06rem;
  height: 1.19rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
.font_6 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #ffffff;
}
.font_5 {
  font-size: 0.88rem;
  font-family: SourceHanSansCN;
  line-height: 0.82rem;
  color: #000000;
}
.font_4 {
  font-size: 1.69rem;
  font-family: SourceHanSansCN;
  line-height: 1.27rem;
  color: #4dbea8;
}
.text_7 {
  margin-right: 1.87rem;
}
.group_13 {
  padding: 0 0.091rem;
}
.font_7 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #474747;
}
.text_8 {
  line-height: 0.58rem;
}
.font_8 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.48rem;
  color: #ababab;
}
.font_9 {
  font-size: 0.63rem;
  font-family: SourceHanSansCN;
  line-height: 0.58rem;
  color: #ababab;
}
.text_9 {
  margin-right: 0.89rem;
  line-height: 0.59rem;
}

/* 待办列表容器样式 */
.todo-list-container {
  max-height: 18.75rem; /* 300px */
  overflow-y: auto;
  margin-top: 0.5rem;
}

/* Flex utilities */
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
.justify-start {
  justify-content: flex-start;
}
.items-center {
  align-items: center;
}
.items-start {
  align-items: flex-start;
}
.items-baseline {
  align-items: baseline;
}
.self-center {
  align-self: center;
}
.self-start {
  align-self: flex-start;
}
.self-stretch {
  align-self: stretch;
}
.relative {
  position: relative;
}
.shrink-0 {
  flex-shrink: 0;
}
</style>
