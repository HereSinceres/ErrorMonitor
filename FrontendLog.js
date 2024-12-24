const baseConfig = {
  pid: '21_141', // 必须 project id
  lid: 'page_name', // 页面的logid
  sample: 1, // 采样率
}

const exceptDefaultMessage = {
  type: 'except',
  // 可选，维度信息，每个字段为一个维度，由用户自定义
  dim: {
    browser: 'pc',
  },
}
const log = (msg) => {
  navigator?.sendBeacon(
    `${process.env.REACT_APP_REQUESTPREFIX}/api/log`,

    JSON.stringify({
      ...baseConfig,
      ...exceptDefaultMessage,
      ...msg,
    })
  )
}
class FrontendLog {
  sendJsError(event) {
    log({
      group: 'js_error',
      info: {
        msg: `Caught Script Error: ${event.message}`,
        stack: `${event?.error?.stack}`,
      },
    })
  }
  sendResourceError(event) {
    log({
      group: 'resource_error',
      info: {
        msg: `Caught Resources url Error: ${event}`,
      },
    })
  }
  sendPromiseError(event) {
    log({
      group: 'promise_error',
      info: {
        msg: `Caught Promise Error: ${event.reason}`,
      },
    })
  }
  sendRequestError(event) {
    log({
      group: 'request_error',
      info: {
        msg: `Caught Request status Error: ${event.status}`,
        readyState: `readyState is ${event.currentTarget.readyState}`,
      },
    })
  }
}

export default FrontendLog
