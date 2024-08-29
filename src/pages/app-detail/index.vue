<template>
  <div class="container">
    <div class="center-content">
      <a-input
        v-model:value="searchQuery"
        placeholder="搜索模块"
        style="width: 300px; margin-bottom: 20px"
        allow-clear
      />
      <a-button type="primary" @click="searchModules">搜索</a-button>
      <a-button type="primary" @click="handleAdd">新增模块</a-button>
      <a-table :data="modules" :columns="columns" row-key="id" :loading="loading">
        <template #optional="{ record }">
          <a-button @click="handleEdit(record)" type="primary">编辑</a-button>
          <a-divider direction="vertical" />
          <a-button @click="handleDelete(record.id)" type="primary" status="danger"
            >删除</a-button
          >
        </template>
      </a-table>

      <ModuleForm
        :module="currentModule"
        :visible="showAddForm"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { Module } from "@/types/Module";
import ModuleForm from "@/components/ModuleForm.vue";
import { deleteModule, queryModule, updateModule, addModule } from "@/api/index";
export default defineComponent({
  name: "module", // 组件名称
  components: { ModuleForm }, // 弹窗组件
  // 定义一个响应式引用，用于存储应用列表的数组，初始化为空数组
  setup() {
    const router = useRouter();
    // 定义一个响应式引用，用于存储应用列表的数组，初始化为空数组
    const modules = ref<Module[]>([]);

    // 定义一个响应式引用，用于存储搜索查询的字符串，初始化为空字符串
    const searchQuery = ref<string>("");

    // 定义一个响应式引用，用于控制添加表单的显示状态，初始化为false（不显示）
    const showAddForm = ref<boolean>(false);

    // 定义一个响应式引用，用于存储当前选中的应用对象，初始化为null（表示没有选中任何应用）
    const currentModule = ref<Module | null>(null);

    // 定义一个响应式引用，用于表示数据加载的状态，初始化为false（表示没有正在加载的数据）
    const loading = ref<boolean>(false);
    // 定义一个函数，用于根据 appId 获取详情数据  //
    const pageid = router.currentRoute.value.params.id;

    // 根据 appId 获取详情数据
    const fetchModuleList = async () => {
      loading.value = true; // 设置加载状态为 true
      const response = await queryModule(); // 调用 fetchModules 函数获取应用列表，并将结果赋值给 modules.value
      modules.value = response.data.filter((item: any) => item.pageid === Number(pageid)); // 过滤出当前页面下的应用列表
      loading.value = false; // 设置加载状态为 false
    };
    // 页面挂载加载数据
    onMounted(() => {
      fetchModuleList(); // 调用 fetchModuleList 函数
    });

    // 定义表格列
    const columns = [
      { title: "关联页面", dataIndex: "pageid", key: "pageid" },
      { title: "模块点位spm", dataIndex: "spmid", key: "spmid" },
      { title: "模块名称", dataIndex: "name", key: "name" },
      { title: "模块描述", dataIndex: "description", key: "description" },
      {
        title: "操作",
        slotName: "optional",
      },
    ];
    // 搜索模块
    const searchModules = async () => {
      // 设置加载状态为 true
      loading.value = true;
      // 调用 fetchModules 函数获取应用列表，并将结果赋值给 modules.value
      const response = await queryModule();
      modules.value = response.data.filter((item: any) =>
        item.name.includes(searchQuery.value)
      );
      loading.value = false;
    };

    // 过滤列表
    const filteredModules = computed(() =>
      modules.value.filter((t) => t.name.includes(searchQuery.value))
    );
    /**
     * 添加操作处理函数
     *
     * @returns 无返回值
     */
    const handleAdd = () => {
      currentModule.value = {
        id: null,
        pageid: Number(pageid),
        spmid: "",
        name: "",
        description: "",
      };
      showAddForm.value = true;
    };
    /// 编辑操作处理函数
    const handleEdit = (module: Module) => {
      // 将传入的 Module 对象赋值给 currentModule.value
      currentModule.value = module;
      // 将 showAddForm.value 的值设置为 true，表示显示添加表单
      showAddForm.value = true;
    };
    // 删除操作处理函数
    const handleDelete = async (id: number) => {
      // 调用 deleteModule 函数删除应用
      await deleteModule(id);
      // 调用 fetchModuleList 函数
      fetchModuleList();
    };
    // 提交表单处理函数
    const handleFormSubmit = async (module: Module) => {
      // 如果 module 有 id，则执行更新操作
      if (module.id) {
        // 调用 updateModule 函数更新 Module
        await updateModule(module.id, module);
      } else {
        // 调用 addModule 函数添加 Module
        await addModule(module);
      }
      // 隐藏添加表单
      showAddForm.value = false;
      // 提交后重新获取列表
      fetchModuleList();
    };
    // 取消表单处理函数
    const handleFormCancel = () => {
      // 关闭添加表单
      showAddForm.value = false;
    };
    // 引入组件  //
    return {
      modules,
      searchQuery,
      showAddForm,
      currentModule,
      loading,
      columns,
      searchModules,
      filteredModules,
      handleAdd,
      handleEdit,
      handleDelete,
      handleFormSubmit,
      handleFormCancel,
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
