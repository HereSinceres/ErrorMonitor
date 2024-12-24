import errorLogService from './ErrorLogService'

class ErrorMonitor {
  monitorStart() {
    // 监控全局错误
    window.addEventListener(
      'error',
      (event) => {
        // addEventListener 回调函数的离散参数全部聚合在 error 对象中
        // 上报js错误
        if (event instanceof ErrorEvent) {
          errorLogService.jsErrorLogStart(event)
        }
        // 上报资源错误
        else if (event instanceof Event) {
          let target = event.target || event.srcElement
          let isElementTarget =
            target instanceof HTMLScriptElement ||
            target instanceof HTMLLinkElement ||
            target instanceof HTMLImageElement
          if (!isElementTarget) {
            return false
          }
          // 上报资源地址
          let url = target.src || target.href
          errorLogService.resourceErrorLogStart(url)
        }
      },
      true
    )

    // 监控promise异步错误
    window.addEventListener('unhandledrejection', function (event) {
      errorLogService.promiseErrorLogStart(event)
    })

    // 请求错误监控
    function _errorAjaxInit() {
      let protocol = window.location.protocol
      if (protocol === 'file:') {
        return
      }
      // 处理XMLHttpRequest
      if (!window.XMLHttpRequest) {
        return
      }
      let xmlhttp = window.XMLHttpRequest
      // 保存原生send方法
      let _oldSend = xmlhttp.prototype.send
      let _handleEvent = function (event) {
        try {
          if (
            event &&
            event.currentTarget &&
            event.currentTarget.status !== 200
          ) {
            errorLogService.requestErrorLogStart(event)
          }
        } catch (e) {
          console.log("Tool's error: " + e)
        }
      }
      xmlhttp.prototype.send = function () {
        this.addEventListener('error', _handleEvent) // 失败
        this.addEventListener('load', _handleEvent) // 完成
        this.addEventListener('abort', _handleEvent) // 取消
        return _oldSend.apply(this, arguments)
      }
    }

    _errorAjaxInit()
  }
}
const instanceErrorMonitor = new ErrorMonitor()
instanceErrorMonitor.monitorStart()
