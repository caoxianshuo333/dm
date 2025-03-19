import request from '@/utils/request'

export function getList(current: number, size: number, params: any) {
  return request.get('/blade-system/tenant/list', {
    params: {
      ...params,
      current,
      size,
    },
  })
}

export function info(domain: string) {
  return request.get('/blade-system/tenant/info', {
    params: {
      domain,
    },
  })
}
