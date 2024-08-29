<template>
  <div class="container">
    <div class="center-content">
      <a-input
        v-model="searchQuery"
        placeholder="搜索应用"
        style="width: 300px; margin-bottom: 20px"
        allow-clear
      />
      <a-button type="primary" @click="searchApps">搜索</a-button>
      <a-button type="primary" @click="handleAdd">新增应用</a-button>
      <a-table :data="apps" :columns="columns" row-key="id" :loading="loading">
        <template #index="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
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
      <AppForm
        :app="currentApp"
        :visible="showAddForm"
        @submit="handleFormSubmit"
        @close="handleFormCancel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { App } from "@/types/App";
import AppForm from "@/components/AppForm.vue";
import { queryApp, addApp, updateApp, deleteApp } from "@/api/index";

export default defineComponent({
  name: "AppList", // 组件名称
  components: { AppForm }, // 注册组件
  // 定义一个响应式引用，用于存储应用列表的数组，初始化为空数组
  setup() {
    const router = useRouter();
    // 定义一个响应式引用，用于存储应用列表的数组，初始化为空数组
    const apps = ref<App[]>([]);

    // 定义一个响应式引用，用于存储搜索查询的字符串，初始化为空字符串
    const searchQuery = ref<string>("");

    // 定义一个响应式引用，用于控制添加表单的显示状态，初始化为false（不显示）
    const showAddForm = ref<boolean>(false);

    // 定义一个响应式引用，用于存储当前选中的应用对象，初始化为null（表示没有选中任何应用）
    const currentApp = ref<App | null>(null);

    // 定义一个响应式引用，用于表示数据加载的状态，初始化为false（表示没有正在加载的数据）
    const loading = ref<boolean>(false);
    // 定义一个响应式引用，用于存储应用列表的表格列
    const columns = [
      {
        title: "序号",
        slotName: "index",
      },
      { title: "应用点位spm", dataIndex: "spmid", key: "spmid" },
      { title: "应用名称", dataIndex: "name", key: "name" },
      { title: "应用描述", dataIndex: "description", key: "description" },
      { title: "创建时间", dataIndex: "createTime", key: "createTime" },
      { title: "更新时间", dataIndex: "updateTime", key: "updateTime" },
      {
        title: "操作",
        slotName: "optional",
      },
    ];
    // 定义一个函数，用于获取应用列表
    const fetchAppList = async () => {
      // 显示加载状态
      loading.value = true;

      // 异步获取应用列表
      const response = await queryApp();
      apps.value = response.data;

      // 隐藏加载状态
      loading.value = false;
    };
    // 定义一个函数，用于搜索应用
    const searchApps = async () => {
      // 设置加载状态为 true
      loading.value = true;
      // 调用 fetchApps 函数获取应用列表，并将结果赋值给 apps.value
      const response = await queryApp();
      apps.value = response.data.filter((item: any) =>
        item.name.includes(searchQuery.value)
      );
      loading.value = false;
    };

    // 过滤列表
    const filteredApps = computed(() =>
      apps.value.filter((t: { name: string | any[] }) =>
        t.name.includes(searchQuery.value)
      )
    );
    //添加操作处理函数
    const handleAdd = () => {
      currentApp.value = null;
      showAddForm.value = true;
    };
    // 编辑操作处理函数
    const handleEdit = (record: App) => {
      // 将传入的 App 对象赋值给 currentApp.value
      currentApp.value = record;
      // 将 showAddForm.value 的值设置为 true，表示显示添加表单
      showAddForm.value = true;
    };
    // 删除操作处理函数
    const handleDelete = async (id: number) => {
      await deleteApp(id);
      // 调用 fetchAppList 函数
      await fetchAppList();
    };
    // 跳转到详情页面
    const goToDetails = (id: number) => {
      router.push({ name: "page", params: { id } }); // 使用 router 进行页面跳转
    };
    // 定义一个函数，用于处理添加表单的提交操作
    const handleFormSubmit = async (App: App) => {
      // 如果 App 有 id，则执行更新操作
      if (App.id) {
        // 调用 updateApp 函数更新 App
        await updateApp(App.id, App).then(() => {
          // 隐藏添加表单
          showAddForm.value = false;
          // 提交后重新获取列表
          fetchAppList();
        });
      } else {
        // 添加 App
        await addApp(App).then(() => {
          // 隐藏添加表单
          showAddForm.value = false;
          // 提交后重新获取列表
          fetchAppList();
        });
      }
    };
    // 定义一个函数，用于处理添加表单的取消操作
    const handleFormCancel = () => {
      // 关闭添加表单
      showAddForm.value = false;
    };
    // 定义一个函数，用于处理添加表单的提交操作
    fetchAppList();
    // 导入组件
    return {
      apps,
      searchQuery,
      showAddForm,
      currentApp,
      loading,
      columns,
      searchApps,
      filteredApps,
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
