const BASE_URL = "/ranking";
/**
 *  菜品相关接口
 */
const ranking = {
  //获取全部栏目
  getColumnList: {
    url: BASE_URL + "/v1/getColumnList",
    method: "POST",
    data: null,
    auth: true,
  },
};

export default {
  ranking,
};
