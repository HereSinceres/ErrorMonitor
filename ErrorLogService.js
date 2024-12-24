import FrontendLog from './FrontendLog'
class ErrorLogService {
  logService = new FrontendLog()

  jsErrorLogStart(event) {
    this.logService.sendJsError(event)
  }
  resourceErrorLogStart(event) {
    this.logService.sendResourceError(event)
  }
  promiseErrorLogStart(event) {
    this.logService.sendPromiseError(event)
  }
  requestErrorLogStart(event) {
    this.logService.sendRequestError(event)
  }
}

const logServiceInstance = new ErrorLogService()
export default logServiceInstance
