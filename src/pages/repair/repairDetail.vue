<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { showToast } from 'vant'

// 不需要额外导入组件，项目已经配置了自动导入

const router = useRouter()

// 班组选项
const teamOptions = [
  { text: '电气维修组', value: '电气维修组' },
  { text: '机械维修组', value: '机械维修组' },
  { text: '仪表维修组', value: '仪表维修组' },
  { text: '管道维修组', value: '管道维修组' },
]

// 设备选项
const deviceOptions = [
  { text: '电机', value: '电机' },
  { text: '变压器', value: '变压器' },
  { text: '控制柜', value: '控制柜' },
  { text: '阀门', value: '阀门' },
  { text: '泵', value: '泵' },
  { text: '管道', value: '管道' },
  { text: '仪表设备', value: '仪表设备' },
]

// 设备多选显示
const deviceText = ref('')
const showDevicePicker = ref(false)
const selectedDevices = ref([])

// 日历选择器
const showCalendar = ref(false)

// 图片上传相关
const fileList = ref([])

function afterRead(file) {
  fileList.value.push({ ...file, status: 'done', message: '上传成功' })
}

function deleteImage(file) {
  const index = fileList.value.indexOf(file)
  if (index !== -1) {
    fileList.value.splice(index, 1)
  }
}

// 表单数据
const formData = reactive({
  title: '',
  devices: [],
  team: '',
  expectCompleteTime: '',
  description: '',
})

// 返回上一页
function goBack() {
  router.go(-1)
}

// 设备选择确认
function onDeviceConfirm() {
  formData.devices = selectedDevices.value.map(value => deviceOptions.find(device => device.value === value))
  deviceText.value = formData.devices.map(item => item.text).join(', ')
  showDevicePicker.value = false
}

// 日期选择确认
function onCalendarConfirm(date) {
  // 格式化日期
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  formData.expectCompleteTime = `${year}-${month}-${day}`
  showCalendar.value = false
}

// 提交表单
function submitForm() {
  if (!formData.title) {
    showToast('请填写工单名称')
    return
  }

  if (formData.devices.length === 0) {
    showToast('请选择相关设备')
    return
  }

  if (!formData.team) {
    showToast('请选择班组')
    return
  }

  if (!formData.expectCompleteTime) {
    showToast('请选择期望完成时间')
    return
  }

  if (!formData.description) {
    showToast('请填写问题描述')
    return
  }

  // 返回列表页
  setTimeout(() => {
    goBack()
  }, 1000)
}
</script>

<template>
  <div>
    <!-- 表单区域 -->
    <div class="form-container">
      <van-form @submit="submitForm">
        <van-cell-group inset>
          <!-- 1. 工单名称 -->
          <van-field
            v-model="formData.title"
            name="title"
            label="工单名称"
            placeholder="请输入工单名称"
            :rules="[{ required: true, message: '请填写工单名称' }]"
          />

          <!-- 2. 相关设备多选 -->
          <van-field
            v-model="deviceText"
            readonly
            name="devices"
            label="相关设备"
            placeholder="请选择相关设备"
            right-icon="arrow-down"
            :rules="[{ required: true, message: '请选择相关设备' }]"
            @click="showDevicePicker = true"
          />

          <van-popup v-model:show="showDevicePicker" position="bottom" class="device-picker">
            <div class="picker-header">
              <span>选择相关设备</span>
            </div>
            <div class="picker-content">
              <van-checkbox-group v-model="selectedDevices">
                <van-cell-group>
                  <van-cell v-for="device in deviceOptions" :key="device.value">
                    <van-checkbox :name="device.value" shape="square">
                      {{ device.text }}
                    </van-checkbox>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </div>
            <div class="picker-footer">
              <van-button plain @click="showDevicePicker = false">
                取消
              </van-button>
              <van-button type="primary" @click="onDeviceConfirm">
                确认
              </van-button>
            </div>
          </van-popup>

          <!-- 3. 班组下拉框 -->
          <van-field
            v-model="formData.team"
            name="team"
            label="班组"
            placeholder="请选择班组"
            readonly
            :rules="[{ required: true, message: '请选择班组' }]"
          >
            <template #input>
              <van-dropdown-menu active-color="#4dbea8">
                <van-dropdown-item v-model="formData.team" :options="teamOptions" />
              </van-dropdown-menu>
            </template>
          </van-field>

          <!-- 4. 期望完成时间 - 使用日历组件 -->
          <van-field
            v-model="formData.expectCompleteTime"
            readonly
            name="expectCompleteTime"
            label="期望完成时间"
            placeholder="请选择日期"
            right-icon="calendar-o"
            :rules="[{ required: true, message: '请选择期望完成时间' }]"
            @click="showCalendar = true"
          />

          <!-- 日历选择弹出层 -->
          <van-calendar
            v-model:show="showCalendar"
            color="#4dbea8"
            :min-date="new Date()"
            @confirm="onCalendarConfirm"
          />

          <!-- 5. 上传图片 -->
          <van-field
            name="images"
            label="上传图片"
          >
            <template #input>
              <van-uploader
                v-model="fileList"
                multiple
                :max-count="5"
                @after-read="afterRead"
                @delete="deleteImage"
              />
            </template>
          </van-field>

          <!-- 6. 问题描述 -->
          <van-field
            v-model="formData.description"
            name="description"
            label="问题描述"
            type="textarea"
            placeholder="请描述具体问题"
            rows="3"
            autosize
            :rules="[{ required: true, message: '请填写问题描述' }]"
          />
        </van-cell-group>

        <div style="margin: 16px;">
          <van-button round block type="primary" native-type="submit" color="#4dbea8">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'repairDetail',
  meta: {
    title: '维修工单详情',
    i18n: 'layouts.repair'
  },
}
</route>

<style scoped>
/* 覆盖默认导航栏 */
:deep(.van-nav-bar) {
  display: none !important;
}

/* 自定义标题栏样式 */
.group_2 {
  padding: 0.38rem 1.25rem 0.5rem;
  background-color: #4dbea8;
  display: flex;
}

.image_3 {
  width: 1.81rem;
  height: 1.81rem;
}

.pos_2 {
  position: absolute;
  left: 1.3rem;
  top: 50%;
  transform: translateY(-50%);
}

.font {
  font-size: 1.25rem;
  font-family: SourceHanSansCN;
  line-height: 1.18rem;
  color: #ffffff;
}

.text {
  line-height: 1.16rem;
  letter-spacing: 0.25rem;
}

.image_2 {
  border-radius: 1rem;
  width: 3.19rem;
  height: 1.69rem;
}

.pos {
  position: absolute;
  right: 1.3rem;
  top: 50%;
  transform: translateY(-50%);
}

/* 表单容器样式 */
.form-container {
  margin-top: 1.25rem;
  padding-bottom: 2rem;
  background-color: #f7f8fa;
}

:deep(.van-cell-group--inset) {
  margin: 0 0.75rem;
}

:deep(.van-radio-group) {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

:deep(.van-button--primary) {
  background-color: #4dbea8;
  border-color: #4dbea8;
}

/* 其他布局工具类 */
.flex-row {
  display: flex;
  flex-direction: row;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.relative {
  position: relative;
}

.mt-8 {
  margin-top: 0.5rem;
}

/* 下拉菜单样式 */
:deep(.van-dropdown-menu) {
  height: 24px;
  background-color: transparent;
  box-shadow: none;
}

:deep(.van-dropdown-menu__bar) {
  height: 24px;
}

:deep(.van-dropdown-menu__title) {
  padding: 0;
  color: #323233;
  font-size: 14px;
}

:deep(.van-dropdown-menu__title::after) {
  display: none;
}

:deep(.van-uploader) {
  width: 100%;
}

:deep(.van-uploader__wrapper) {
  justify-content: flex-start;
}

/* 设备选择器样式 */
.device-picker {
  height: 60vh;
  display: flex;
  flex-direction: column;
}

.picker-header {
  padding: 16px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #ebedf0;
}

.picker-content {
  flex: 1;
  overflow-y: auto;
}

.picker-footer {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #ebedf0;
}

.picker-footer .van-button {
  width: 48%;
}
</style>
