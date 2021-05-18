/*
 * @Author       : liuxuhao
 * @LastEditors  : liuxuhao
 */
const KB_SIZE = 1024
const MB_SIZE = 1024 * 1024
module.exports = {
  KB_SIZE,
  MB_SIZE,
  // 公共信息字符串
  // 成功字符串
  SUCCESS_DATA_INSERTED: 'data inserted successfully ',
  SUCCESS_DATA_READ: 'data read successfully',
  SUCCESS_DATA_DELETED: 'data deleted successfully',
  SUCCESS_LIST_READ: 'fetch list info successfully',
  SUCCESS_DATA_UPDATED: 'data updated successfully',
  SUCCESS_FILE_UPLOADED: 'file uploaded successfully',
  SUCCESS_ACCESS_TOKEN_GOT: 'wechat access token fetch successfully, it will be expired in 2 hours',

  // 警告字符串
  WARNING_NO_TOKEN: 'without token',
  CODE_WARNING_NO_TOKEN: 401,
  WARNING_INVALID_TOKEN: 'invalid token',
  CODE_WARNING_INVALID_TOKEN: 402,
  WARNING_EXPIRED_TOKEN: 'expired token',
  CODE_WARNING_EXPIRED_TOKEN: 403,
  WARNING_NO_DATA_FOUND: 'can not found any data matched',
  CODE_WARNING_NO_DATA_FOUND: 404,
  WARNING_NO_DATA_DELETE: 'can not found any data matched to delete',
  WARNING_PARAM_REQUIRE_NOT_NULL: 'there are several params requires not null',

  // 错误字符串
  ERROR_DATA_INSERTED: 'data insert error',
  ERROR_DATA_UNIQUE: 'data insert error, require unique',
  ERROR_DATA_READ: 'data search error',
  ERROR_LIST_READ: 'list data search error, check the error stack',
  ERROR_DATA_DELETED: 'data delete unsuccessfully',
  ERROR_MISSING_IMPORTANT_PARAMS: 'lack of important params',
  ERROR_DATA_UPDATED: 'data update error',
  ERROR_FILE_UPLOAD: 'file upload failed',
  ERROR_CACHE_STORAGE_FAILED: 'fail to storage datas in the memory cache'
}
