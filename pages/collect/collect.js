// pages/collect/collect.js
import Collect from "../../services/api/collect";
import RequestUtils from "../../utils/request_util";

Component({
  data: {
    collections: [],  // 初始为空数组
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this. getCollections();
    }
  },

  methods: {
    // 获取收藏列表
    async getCollections() {
      try {
        const res = await RequestUtils.request(Collect.collect.checkCollection);
        if (res && res.data && res.data.list) {
          const collectionsWithShowChildren = res.data.list.map(item => ({
            collectid: item.id,
            name: item.name,
            showChildren: false,
            children: item.chilren || []
          }));
          this.setData({
            collections: collectionsWithShowChildren
          });
        } else {
          this.setData({
            collections: []
          });
          console.log('收藏列表数据为空');
        }
      } catch (err) {
        console.error('获取收藏列表失败:', err);
        await wx.showToast({
          title: '获取数据失败',
          icon: 'none'
        });
        this.setData({
          collections: []
        });
      }
    },

    // 添加收藏
    async addCollection() {
      const res = await wx.showModal({
        title: '添加收藏',
        editable: true,
        placeholderText: '请输入收藏名称'
      });
      
      if (res.confirm && res.content) {
        Collect.collect.addCollection.data = {
          name: res.content
        }
        await RequestUtils.request(Collect.collect.addCollection);
        await wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
        await this.getCollections();
      }
    },

    // 修改收藏
    async changeCollection(e) {
      const { id } = e.currentTarget.dataset;
      const res = await wx.showModal({
        title: '修改收藏',
        editable: true,
        placeholderText: '请输入新的收藏名称'
      });
      
      if (res.confirm && res.content) {
        Collect.collect.changeCollection.data = {
          collectid: id,
          name: res.content
        }
        await RequestUtils.request(Collect.collect.changeCollection);
        await wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
        await this.getCollections();
      }
    },

    // 删除收藏
    async deleteCollection(e) {
      const { id } = e.currentTarget.dataset;
      console.log('需要删除的参数:', id);
      const res = await wx.showModal({
        title: '确认删除',
        content: '确定要删除这个收藏吗？'
      });
      
      if (res.confirm) {
        Collect.collect.deleteCollection.data = {
          collectid: id,
        }
        const res = await  RequestUtils.request(Collect.collect.deleteCollection);
         wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
        await this.getCollections();
      }
    },

    // 查看收藏详情
    async checkchilrenCollect(e) {
      const { id,name} = e.currentTarget.dataset;
      let { collections } = this.data;
      const itemIndex = collections.findIndex(item => item.collectid == id);
      if (collections[itemIndex].showChildren){
        collections[itemIndex].showChildren = false;
        this.setData({
          collections
        });
        return;
      }
      Collect.collect.checkChildren.data = {
        name: name,
        collectId: id,
        pageNum: 1,
      }
      const res = await RequestUtils.request(Collect.collect.checkChildren);
      console.log('获取到的子项数据:', res.data);
      // 创建新的数组，避免直接修改 data
      const newCollections = collections.map(item => {
        if (item.collectid === id) {
          return {
            ...item,
            showChildren: !item.showChildren,
            children: res.data.children
          };
        }
        return item;
      });
      console.log('修改后的数组:', newCollections);
      this.setData({
        collections: newCollections
      });
    },

    // 加载更多子项
    async loadMoreChildren(e) {
      const { id } = e.currentTarget.dataset;
      const collections = this.data.collections;
      const index = collections.findIndex(item => item.collectid === id);

      if (index !== -1 && collections[index].hasMore) {
        const nextPage = collections[index].currentPage + 1;
        Collect.collect.checkChildren.data = {
          collectid: id,
          pageNum: nextPage,
        }
        const res = await RequestUtils.request(Collect.collect.checkChildren);
        console.log('获取到的子项数据:', res.data);
        const newCollections = [...collections];
        newCollections[index].children = [
          ...newCollections[index].children,
          ...res.data.list
        ];
        newCollections[index].currentPage = nextPage;
        newCollections[index].hasMore = res.data.hasMore;
        this.setData({
          collections: newCollections
        });
      }
    },

    // 添加收藏子项
    async addChildren(e) {
      const { id } = e.currentTarget.dataset;
      const res = await wx.showModal({
        title: '添加子项',
        editable: true,
        placeholderText: '请输入子项名称'
      });
      
      if (res.confirm && res.content) {
        Collect.collect.addChildren.data = {
          collectid: id,
          name: res.content
        }
        await RequestUtils.request(Collect.collect.addChildren);
        await wx.showToast({
          title: '添加成功',
          icon: 'success'
        });
        await this.checkchilren({currentTarget: {dataset: {id}}});
      }
    },

    // 修改收藏子项
    async changeChildren(e) {
      const { id, childId } = e.currentTarget.dataset;
      const collections = this.data.collections;
      const collection = collections.find(item => item.collectid === id);
      
      if (!collection) {
        await wx.showToast({
          title: '收藏夹不存在',
          icon: 'none'
        });
        return;
      }

      const actionRes = await wx.showActionSheet({
        itemList: ['收藏夹1', '收藏夹2', '收藏夹3']
      });
      
      const targetCollectionId = actionRes.tapIndex + 1; // 1, 2 或 3
      
      Collect.collect.changeChildren.data = {
        collectid: id,
        childId: childId,
        targetCollectionId: targetCollectionId
      }
      
      try {
        await RequestUtils.request(Collect.collect.changeChildren);
        await wx.showToast({
          title: '移动成功',
          icon: 'success'
        });
        await this.checkchilren({currentTarget: {dataset: {id}}});
      } catch (err) {
        await wx.showToast({
          title: '移动失败',
          icon: 'none'
        });
      }
    },

    // 删除收藏子项
    async deleteChildren(e) {
      const { id, childId } = e.currentTarget.dataset;
      console.log('删除子项的参数:', id, childId);
      const res = await wx.showModal({
        title: '确认删除',
        content: '确定要删除这个子项吗？'
      });
      
      if (res.confirm) {
        Collect.collect.deleteChildren.data = {
          collectId: id,
          collectChildrenId: childId
        }
        await RequestUtils.request(Collect.collect.deleteChildren);
        await wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
        await this.checkchilren({currentTarget: {dataset: {id}}});
      }
    },

    async onPullDownRefresh() {
      await this.getCollections();
      await wx.stopPullDownRefresh();
    },

    // 添加新方法
    async showActionSheet(e) {
      const { id, name } = e.currentTarget.dataset;
      console.log('showActionSheet的参数:', id, name);
      try {
        const res = await wx.showActionSheet({
          itemList: ['修改名称', '删除收藏'],
          itemColor: '#ff6b00'
        });
    
        // 检查用户是否点击了取消或蒙层
        if (res.cancel) {
          console.log('用户取消操作');
          return; // 直接返回，不再执行后续代码
        }
    
        switch (res.tapIndex) {
          case 0: // 修改名称
            const res = await wx.showModal({
              title: '修改收藏夹名称',
              editable: true,
              placeholderText: '请输入'
            });
            Collect.collect.changeCollection.data = {
              collectId: id,
              name: res.content
            };
            await RequestUtils.request(Collect.collect.changeCollection);
            await this.getCollections(); // 刷新数据   
            break;
          case 1: // 删除收藏
            Collect.collect.deleteCollection.data = {
              collectId: id,
              name: name
            };
            await RequestUtils.request(Collect.collect.deleteCollection);
            await this.getCollections(); // 刷新数据
            break;
          default:
            console.log('用户点击取消');
            break;
        }
      } catch (error) {
        console.error('操作失败:', error);
      }
    }
  }
})