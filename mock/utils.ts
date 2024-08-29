// 成功
export const responseSuccessFormat = (data:any) => {
  return {
    code: 0,
    data: data,
    message: null,
    success: true
  }
}

// 失败,测试使用
export const responseErrorFormat = (data:any) => {
  return {
    code: 500,
    data: data,
    message: 'server error',
    success: false
  }
}
