import request from '@/utils/request'
import md5 from 'md5'

export interface LoginData {
  account: string
  password: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
}

export function login(data: LoginData): Promise<any> {
  return request.post<LoginRes>('/blade-auth/oauth/token', null, {
    params: {
      ...data,
      password: md5(data.password),
      grant_type: 'password',
      scope: 'all',
      type: 'account',
    },
  })
}

export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  return request<UserState>('/user/me')
}

export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}

export function resetPassword(): Promise<any> {
  return request.post('/user/reset-password')
}

export function register(): Promise<any> {
  return request.post('/user/register')
}

export function getFtyId() {
  return request.get('/blade-system/sso/tenant-list')
}
