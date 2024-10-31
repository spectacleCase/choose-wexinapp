const BASE_URL = "/collect";

const collect = {
    // 添加收藏
    addCollection: {
      url: BASE_URL + "/v1/addCollection",
      method: "POST",
      data: {
        name: "collectionName", // 需要替换为实际的收藏名称
        userid: "user123", // 需要替换为实际的用户ID
      },
      auth: true,
    },
    // 删除收藏
    deleteCollection: {
      url: BASE_URL + "/v1/deleteCollection",
      method: "POST",
      data: {
        collectid: 123, // 需要替换为实际的收藏ID
        userid: "user123", // 需要替换为实际的用户ID
      },
      auth: true,
    },
    // 修改收藏
    changeCollection: {
      url: BASE_URL + "/v1/changeCollection",
      method: "POST",
      data: {
        collectid: 123, // 需要替换为实际的收藏ID
        userid: "user123", // 需要替换为实际的用户ID
        name: "newCollectionName", // 需要替换为新的收藏名称
      },
      auth: true,
    },
    // 检查用户收藏列表
    checkCollection: {
      url: BASE_URL + "/v1/checkCollection",
      method: "POST",
      data: {
        userid: "user123", // 需要替换为实际的用户ID
      },
      auth: true,
    },
    // 检查收藏的子项
    checknchilren: {
      url: BASE_URL + "/v1/checknchilren",
      method: "POST",
      data: {
        collectid: 123, // 需要替换为实际的收藏ID
        userid: "user123", // 需要替换为实际的用户ID
        name: "collectionName", // 需要替换为实际的收藏名称
      },
      auth: true,
    },

    // 添加收藏的子项
    addchilren: {
      url: BASE_URL + "/v1/addchilren",
      method: "POST",
      data: {
        collectid: 123, // 需要替换为实际的收藏ID
        userid: "user123", // 需要替换为实际的用户ID
        dishesName: "dishName", // 需要替换为实际的菜品名称
        dishesImage: "dishImage", // 需要替换为实际的菜品图片
        coordinate: "coordinate", // 需要替换为实际的坐标
      },
      auth: true,
    },
    // 修改收藏的子项
    changechilren: {
      url: BASE_URL + "/v1/changechilren",
      method: "POST",
      data: {
        userid: "user123", // 需要替换为实际的用户ID
        collectchilrenid: 456, // 需要替换为实际的收藏子项ID
      },
      auth: true,
    },
    // 删除收藏的子项
    deletechilren: {
      url: BASE_URL + "/v1/deletechilren",
      method: "POST",
      data: {
        userid: "user123", // 需要替换为实际的用户ID
        collectchilrenid: 456, // 需要替换为实际的收藏子项ID
      },
      auth: true,
    },
  };


export default {
    collect,
};
  