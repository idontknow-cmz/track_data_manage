<template>
  <div class="container">
    <div class="center-content">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索页面"
        style="width: 300px; margin-bottom: 20px"
        allow-clear
      />
      <a-button type="primary" @click="searchPages">搜索</a-button>
      <a-button type="primary" @click="handleAdd">新增页面</a-button>
      <a-table :data="pages" :columns="columns" row-key="id" :loading="loading">
        <template #optional="{ record }">
          <a-button @click="handleEdit(record)" type="primary">编辑</a-button>
          <a-divider direction="vertical" />
          <a-button @click="handleDelete(record.id)" type="primary" status="danger"
            >删除</a-button
          >
          <a-divider direction="vertical" />
          <a-button @click="goToDetails(record.id)" type="primary" status="success"
            >详情</a-button
          >
        </template>
      </a-table>

      <PageForm
        :page="currentPage"
        :visible="showAddForm"
        @submit="handleFormSubmit"
        @close="handleFormCancel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Page } from "@/types/Page";
import PageForm from "@/components/PageForm.vue";
import { deletePage, queryPage, updatePage, addPage } from "@/api/index";
export default defineComponent({
  name: "page",
  components: { PageForm },
  setup() {
    const router = useRouter();
    // 定义一个响应式引用，用于存储应用列表的数组，初始化为空数组
    const pages = ref<Page[]>([]);

    // 定义一个响应式引用，用于存储搜索查询的字符串，初始化为空字符串
    const searchQuery = ref<string>("");

    // 定义一个响应式引用，用于控制添加表单的显示状态，初始化为false（不显示）
    const showAddForm = ref<boolean>(false);

    // 定义一个响应式引用，用于存储当前选中的应用对象，初始化为null（表示没有选中任何应用）
    const currentPage = ref<Page | null>(null);

    // 定义一个响应式引用，用于表示数据加载的状态，初始化为false（表示没有正在加载的数据）
    const loading = ref<boolean>(false);
    // 获取当前路由中的 appId，并使用该值作为查询条件  //
    const appId = router.currentRoute.value.params.id;

    // 根据 appId 获取页面列表
    const fetchPageList = async () => {
      loading.value = true;
      const response = await queryPage();
      pages.value = response.data.filter((item: any) => item.appid === Number(appId));
      loading.value = false;
    };
    /// 初始化获取页面列表
    onMounted(() => {
      fetchPageList();
    });
    // 定义表格的列
    const columns = [
      { title: "关联应用", dataIndex: "appid", key: "appid" },
      { title: "页面点位spm", dataIndex: "spmid", key: "spmid" },
      { title: "页面名称", dataIndex: "name", key: "name" },
      { title: "页面描述", dataIndex: "description", key: "description" },
      {
        title: "操作",
        slotName: "optional",
      },
    ];
    // 搜索页面列表  //
    const searchPages = async () => {
      // 设置加载状态为 true
      loading.value = true;
      // 调用 fetchPages 函数获取应用列表，并将结果赋值给 pages.value
      const response = await queryPage();
      pages.value = response.data.filter((item: any) =>
        item.name.includes(searchQuery.value)
      );
      loading.value = false;
    };

    // 过滤列表
    const filteredPages = computed(() =>
      pages.value.filter((t) => t.name.includes(searchQuery.value))
    );
    /**
     * 添加操作处理函数
     *
     * @returns 无返回值
     */
    const handleAdd = () => {
      // 将 currentPage.value 的值设置为一个空对象，表示新建应用
      currentPage.value = {
        id: null,
        appid: Number(appId),
        spmid: "",
        name: "",
        description: "",
        createdAt: "",
      };
      // 将 showAddForm.value 的值设置为 true，表示显示添加表单
      showAddForm.value = true;
    };
    // 编辑操作处理函数
    const handleEdit = (page: Page) => {
      // 将传入的 Page 对象赋值给 currentPage.value
      currentPage.value = page; // 将 showAddForm.value 的值设置为 true，表示显示添加表单
      showAddForm.value = true;
    };
    // 删除操作处理函数
    const handleDelete = async (id: number) => {
      // 调用 deletePage 函数删除应用
      await deletePage(id);
      // 调用 fetchPageList 函数
      fetchPageList();
    };
    // 跳转到详情页面
    const goToDetails = (id: number) => {
      router.push({ name: "app", params: { id: id } }); // 使用 router 进行页面跳转
    };
    // 表单提交处理函数
    const handleFormSubmit = async (page: Page) => {
      // 如果 Page 有 id，则执行更新操作
      if (page.id) {
        // 调用 updatePage 函数更新 Page
        await updatePage(page.id, page);
      } else {
        // 调用 addPage 函数添加 Page
        await addPage(page);
      }
      // 隐藏添加表单
      showAddForm.value = false;
      // 提交后重新获取列表
      fetchPageList();
    };
    /// 取消操作处理函数
    const handleFormCancel = () => {
      // 关闭添加表单
      showAddForm.value = false;
    };
    // 导入组件
    return {
      pages,
      searchQuery,
      showAddForm,
      currentPage,
      loading,
      columns,
      searchPages,
      filteredPages,
      handleAdd,
      handleEdit,
      handleDelete,
      handleFormSubmit,
      handleFormCancel,
      goToDetails,
    };
  },
});
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}

.center-content {
  text-align: center;
  width: 100%;
  max-width: 1024px;
}
</style>
