import RequestUtils from "../../../utils/request_util";
import Dishes from "../../../services/api/dishes";
import Comment from "../../../services/api/comment";
import Collect from "../../../services/api/collect";

// pages/shop/dishes/dishes.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showPicker: false,
    collections: [], // 初始为空数组收藏
    categories: [],
    currentCategory: 1,
    currentDish: {},
    comments: [],
    isDropdownVisible: false,
    hasSelected: false,
    isCollected: false, // 添加收藏状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(options);
    let dishesList = options.data;
    dishesList = JSON.parse(decodeURIComponent(dishesList));
    console.log('dishesList的数据',dishesList);
    Dishes.dishes.getDishesDetails.data = {
      dishesId: options.id,
    };
    console.log(dishesList);

    const data = await RequestUtils.request(Dishes.dishes.getDishesDetails);
    this.setData({
      currentDish: {
        dishesId: options.id,
        title: data.data.dishesName,
        image: data.data.image,
        tags: data.data.tags,
        description: "红烧肉是一道著名的中国菜，口感软糯，味道浓郁。",
      },
      categories: dishesList,
    });

    // 检查收藏状态
    await this.checkCollectChildren();

    // 模拟获取评论数据
    this.setData({
      comments: [
        {
          id: 1,
          userAvatar: "https://example.com/avatar1.jpg",
          userName: "张三",
          time: "2023-04-15 12:30",
          rating: 5,
          content: "非常好吃，肉质鲜嫩，味道浓郁！",
        },
        {
          id: 2,
          userAvatar: "https://example.com/avatar2.jpg",
          userName: "李四",
          time: "2023-04-14 18:45",
          rating: 4,
          content: "整体不错，就是有点偏咸。",
        },
      ],
    });
  },

  async switchCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId,
    });
    // 这里应该根据分类 ID 获取对应的菜品数据
    console.log("切换到分类：", categoryId);

    Dishes.dishes.getDishesDetails.data = {
      dishesId: categoryId,
    };
    let data = null;
    this.data.categories.forEach((item) => {
      if (item.id === categoryId) {
        data = item;
      }
    });
    this.setData({
      currentDish: {
        dishesId: categoryId,
        title: data.dishesName,
        image: data.image,
        // tags: data.tags,
        tags: data.dishesTag,
        description: "红烧肉是一道著名的中国菜，口感软糯，味道浓郁。",
      },
    });
  },

  toggleCategoryDropdown() {
    this.setData({
      isDropdownVisible: !this.data.isDropdownVisible,
    });
  },

  async selectCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId,
      isDropdownVisible: false,
    });
    //
    console.log("选择并切换到分类：", categoryId);
    Dishes.dishes.getDishesDetails.data = {
      dishesId: categoryId,
    };
    const data = await RequestUtils.request(Dishes.dishes.getDishesDetails);
    this.setData({
      currentDish: {
        title: data.data.dishesName,
        image: data.data.image,
        tags: data.data.tags,
        description: "红烧肉是一道著名的中国菜，口感软糯，味道浓郁。",
      },
    });
  },

  // 判断收藏还是取消
  async getCollections() {
    try {
      if (this.data.isCollected) {
        const result = await wx.showModal({
          title: "确认删除",
          content: "确定要取消收藏吗？",
        });
        if (result.confirm) {
          Collect.collect.deleteChildren.data = {
            dishId: this.data.currentDish.dishesId, // 菜品ID
          };
          await RequestUtils.request(Collect.collect.deleteChildren);
          await wx.showToast({
            title: "删除成功",
            icon: "success",
          });
        }
        this.setData({ isCollected: false });
        await this.checkCollectChildren();
        return;
      }
      const res = await RequestUtils.request(Collect.collect.checkCollection);
      console.log("获取到的收藏列表数据:", res.data.list);
      if (res && res.data && res.data.list) {
        const collections = res.data.list.map((item) => ({
          ...item,
          selected: false, // 添加选中状态字段
        }));
        this.setData({
          collections,
          showPicker: true,
          hasSelected: false, // 重置选中状态
        });
      } else {
        this.setData({
          collections: [],
          showPicker: true,
          hasSelected: false,
        });
      }
    } catch (err) {
      console.error("获取收藏列表失败:", err);
      await wx.showToast({
        title: "获取数据失败",
        icon: "none",
      });
      this.setData({
        collections: [],
        hasSelected: false,
      });
    }
  },

  hideCollections() {
    // 重置所有选中状态
    const { collections } = this.data;
    const newCollections = collections.map((item) => ({
      ...item,
      selected: false,
    }));

    this.setData({
      showPicker: false,
      collections: newCollections,
      hasSelected: false,
    });
  },

  selectCollection(e) {
    const { id } = e.currentTarget.dataset;
    const { collections } = this.data;

    // 单选模式：其他项目取消选中，只选中当前项
    const newCollections = collections.map((item) => ({
      ...item,
      selected: item.id === id, // 直接设置当前项为选中，其他项为未选中
    }));

    // 更新选中状态
    this.setData({
      collections: newCollections,
      hasSelected: true, // 单选模式下，只要点击就一定有选中项
    });
  },

  // 修改确认收藏方法
  async confirmCollect() {
    const selectedCollection = this.data.collections.find(
      (item) => item.selected
    );
    if (!selectedCollection) {
      wx.showToast({
        title: "请选择收藏夹",
        icon: "none",
      });
      return;
    }
    try {
      const collectId = selectedCollection.id;
      // 调用收藏接口，只传入必要的参数
      Collect.collect.addChildren.data = {
        collectId: collectId,
        dishId: this.data.currentDish.dishesId, // 菜品ID
        dishesName: this.data.currentDish.title, // 菜品名称
        dishesImage: this.data.currentDish.image, // 菜品图片
        //coordinate: this.data.currentDish.coordinate  // 坐标
        coordinate: "12", // 坐标
      };
      console.log("需要收藏的参数:", Collect.collect.addChildren.data);

      // 调用接口添加子项
      await RequestUtils.request(Collect.collect.addChildren);

      await wx.showToast({
        title: "收藏成功",
        icon: "success",
      });

      // 更新收藏状态
      this.setData({ isCollected: true });

      this.hideCollections();

      // 可以在这里触发一个事件通知收藏页面刷新
      const pages = getCurrentPages();
      const collectPage = pages.find(
        (page) => page.route === "pages/collect/collect"
      );
      if (collectPage) {
        collectPage.getCollections(); // 刷新收藏列表
      }
    } catch (err) {
      console.error("收藏失败:", err);
      wx.showToast({
        title: "收藏失败",
        icon: "none",
      });
    }
  },

  // 修改检查收藏状态的方法
  async checkCollectChildren() {
    try {
      Collect.collect.checkCollectChildren.data = {
        dishId: this.data.currentDish.dishesId, // 使用 dishesId
      };
      const childrenRes = await RequestUtils.request(
        Collect.collect.checkCollectChildren
      );
      console.log("检查到的收藏状态:", childrenRes.data);
      if (childrenRes && childrenRes.data && childrenRes.data.isCollect) {
        this.setData({ isCollected: childrenRes.data.isCollect });
      }
    } catch (err) {
      console.error("检查收藏状态失败:", err);
    }
  },
});
