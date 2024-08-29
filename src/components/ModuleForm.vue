<template>
  <a-modal
    v-model:visible="visible"
    title="编辑模块数据"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-form :model="formData" :rules="rules" ref="formRef">
      <a-form-item label="模块名称" prop="name" required>
        <a-input v-model="formData.name" placeholder="请输入模块名称" allow-clear />
      </a-form-item>
      <a-form-item label="模块spm值" prop="spmid" required>
        <a-input v-model="formData.spmid" allow-clear placeholder="请输入spm值" />
      </a-form-item>
      <a-form-item label="关联页面" prop="pageid" required>
        <a-input
          v-model="formData.pageid"
          readonly
          allow-clear
          placeholder="请输入关联页面"
        />
      </a-form-item>
      <a-form-item label="模块描述" prop="desc">
        <a-textarea
          placeholder="请输入模块描述"
          v-model="formData.description"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";
// 接收 props
const props = defineProps({
  module: Object,
});
// 模态框是否可见
const visible = ref(true);
// 获取表单的 ref
const formRef = ref(null);
// 定义事件
const emit = defineEmits(["submit", "close"]);
// 定义表单数据
const formData = ref({
  id: "",
  pageid: "",
  name: "",
  spmid: "",
  description: "",
});
// 表单验证规则
const rules = {
  spmid: [{ required: true, message: "请输入spm值" }],
  name: [{ required: true, message: "请输入页面名称" }],
};
// 监听 props.module 的变化
watch(
  () => props.module,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };
    } else {
      formData.value = {
        id: "",
        name: "",
        pageid: "",
        spmid: "",
        description: "",
      };
    }
  },
  { immediate: true }
);
// 监听 props.app 的变化
watch(
  () => props.module,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };
    } else {
      formData.value = {
        id: "",
        name: "",
        pageid: "",
        spmid: "",
        description: "",
      };
    }
  },
  { immediate: true }
);
// 提交表单
const handleSubmit = () => {
  // 验证表单
  formRef.value.validate((valid) => {
    if (valid) {
      const newItem = { ...formData, id: Date.now() };
      emit("submit", newItem);
      handleCancel();
    }
  });
};
// 取消编辑
const handleCancel = () => {
  emit("close");
  resetForm();
};
// 取消编辑后，重置表单
const resetForm = () => {
  // 重置表单的 id 字段
  formData.id = "";
  // 重置表单的 spmid 字段
  formData.spmid = "";
  formData.pageid = "";
  // 重置表单的 name 字段
  formData.name = "";
  // 重置表单的 description 字段
  formData.description = "";
};
</script>

<style scoped>
</style>
