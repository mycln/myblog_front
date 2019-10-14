import baseURL from '_conf/url'
const base = baseURL
const S0101 = base + '/back/sys/role/add'
const S0102 = base + '/back/sys/role/update'
const S0103 = base + '/back/sys/role/del'
const S0104 = base + '/back/sys/role/list'
const S0106 = base + '/back/sys/user/role'
const S0105 = base + '/back/sys/role/permission'
const S0108 = base + '/back/sys/menu/list'
const S0107 = base + '/back/sys/role/menu/all'
const S0204 = base + '/back/user/list'
const S0201 = base + '/back/user/add'
const S0202 = base + '/back/user/update'
const S0203 = base + '/back/user/del'
const S0205 = base + '/back/user/changePass'
const S0301 = base + '/back/logs/list'
const C01 = base + '/common/back/login'
const C0105 = base + '/common/upload/file'

const S0401 = base + '/back/menus/add'
const S0402 = base + '/back/menus/del'

const S0501 = base + '/back/article/publish'
const S0502 = base + '/back/article/getAllCategorys'
const S0503 = base + '/back/article/getCategoryVoByPid'
const S0504 = base + '/back/article/getListByCategoryPid'
const S0505 = base + '/back/article/getListByCategoryId'
const S0506 = base + '/back/article/getArticleById'
export default{
  base: base,
  C01: C01,
  C0105: C0105,
  S0101: S0101,
  S0102: S0102,
  S0103: S0103,
  S0104: S0104,
  S0105: S0105,
  S0106: S0106,
  S0107: S0107,
  S0108: S0108,
  S0201: S0201,
  S0202: S0202,
  S0203: S0203,
  S0204: S0204,
  S0205: S0205,
  S0301: S0301,
  S0401: S0401,
  S0402: S0402,
  S0501: S0501,
  S0502: S0502,
  S0503: S0503,
  S0504: S0504,
  S0505: S0505,
  S0506: S0506
}
