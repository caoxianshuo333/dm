<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RouteMap } from 'vue-router'
import { useUserStore } from '@/stores'
import { getTopUrl } from '@/utils/util'
import logo from '~/images/logo.svg'
import logoDark from '~/images/logo-dark.svg'
import { info } from '@/api/system/tenant'
import { getFtyId } from '@/api/user'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const dark = ref<boolean>(isDark.value)
// 控制公司选择器弹窗显示
const showPicker = ref(false)
const fty_cname = ref('')

const postData = reactive({
  tenantId: '',
  username: '',
  password: '',
})

// 公司列表数据
const companyList = ref<{ text: string, value: string }[]>([
  { text: '浙江图快数智科技有限公司', value: '000000' },
])

// 使用默认值
fty_cname.value = companyList.value[0].text
postData.tenantId = companyList.value[0].value

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)
onMounted(() => {
  getTenant()
  getAllFtyId()
})

const rules = reactive({
  tenantId: [
    { required: true, message: t('login.pleaseSelectCompany') || '请选择公司' },
  ],
  account: [
    { required: true, message: t('login.pleaseEnterAccount') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
})

async function login(values: any) {
  try {
    loading.value = true
    // 合并公司ID、账号和密码
    const loginData = {
      tenantId: postData.tenantId,
      username: postData.username,
      password: postData.password,
      ...values,
    }
    await userStore.login(loginData)
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      name: (redirect as keyof RouteMap) || 'home',
      query: {
        ...othersQuery,
      },
    })
  }
  finally {
    loading.value = false
  }
}
function getTenant() {
  const domain = getTopUrl()
  // 临时指定域名，方便测试
  // domain = "https://bladex.vip";
  info(domain).then((res) => {
    const data = res.data
    if (data.success && data.data.tenantId) {
      postData.tenantId = data.data.tenantId
    }
  })
}
function getAllFtyId() {
  getFtyId().then((res) => {
    // 获取服务器返回的数据
    if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
      // 转换数据格式
      const newList = res.data.map((item: any) => ({
        text: item.fty_cname || item.tenantName || item.tenant_name || '',
        value: item.id || item.tenantId || item.tenant_id || '',
      })).filter((item: any) => item.text && item.value)

      if (newList.length > 0) {
        companyList.value = newList

        // 默认选中第一个选项
        if (newList[0]) {
          fty_cname.value = newList[0].text
          postData.tenantId = newList[0].value
        }

        console.warn('公司列表数据:', companyList.value)
      }
    }
  })
}

function onCompanyConfirm(value: any) {
  // 使用 console.warn 调试信息，不违反 ESLint 规则
  fty_cname.value = value.selectedOptions[0].text
  postData.tenantId = value.selectedOptions[0].value
  showPicker.value = false
}
</script>

<template>
  <div class="m-x-a w-7xl text-center">
    <div class="mb-32 mt-20">
      <van-image :src="dark ? logoDark : logo" class="h-120 w-120" alt="brand logo" />
    </div>

    <van-form :model="postData" :rules="rules" validate-trigger="onSubmit" @submit="login">
      <div class="overflow-hidden rounded-3xl">
        <van-field
          v-model="fty_cname"
          :placeholder="t('login.pleaseSelectCompany')"
          :rules="rules.tenantId"
          is-link
          readonly
          @click="showPicker = true"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.username"
          :rules="rules.account"
          name="username"
          :placeholder="t('login.account')"
        />
      </div>

      <div class="mt-16 overflow-hidden rounded-3xl">
        <van-field
          v-model="postData.password"
          type="password"
          :rules="rules.password"
          name="password"
          :placeholder="t('login.password')"
        />
      </div>

      <div class="mt-16">
        <van-button
          :loading="loading"
          type="primary"
          native-type="submit"
          round block
        >
          {{ $t('login.login') }}
        </van-button>
      </div>
    </van-form>

    <!-- 公司选择器弹窗 -->
    <van-popup v-model:show="showPicker" position="bottom" round>
      <van-picker
        title="选择公司"
        :columns="companyList"
        value-key="text"
        show-toolbar
        @confirm="onCompanyConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'menus.login'
  },
}
</route>
