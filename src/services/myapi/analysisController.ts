// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 此处后端没有提供注释 GET /analysis/top/interface */
export async function listTopInvokeInterfaceInfo(options?: { [key: string]: any }) {
  return request<API.BaseResponseListInterfaceInfoVO>('/analysis/top/interface', {
    method: 'GET',
    ...(options || {}),
  });
}
