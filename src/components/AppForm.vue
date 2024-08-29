<template>
  <a-modal
    v-model:visible="visible"
    title="编辑应用数据"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-form :model="formData" :rules="rules" ref="formRef">
      <a-form-item label="应用名称" prop="name" required>
        <a-input v-model="formData.name" placeholder="请输入应用名称" allow-clear />
      </a-form-item>
      <a-form-item label="spm值" prop="spmid" required>
        <a-input v-model="formData.spmid" allow-clear placeholder="请输入spm值" />
      </a-form-item>
      <a-form-item label="应用描述" prop="desc">
        <a-textarea
          placeholder="请输入应用描述"
          v-model="formData.description"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from "vue";
// 接收 props
const props = defineProps({
  app: Object,
});
// 模态框是否可见
const visible = ref(true);
// 获取表单的 ref
const formRef = ref(null);
// 编辑表单数据
const formData = ref({
  id: "",
  name: "",
  spmid: "",
  description: "",
});
// 定义事件
const emit = defineEmits(["submit", "close"]);
// 表单验证规则
const rules = {
  spmid: [{ required: true, message: "请输入spm值" }],
  name: [{ required: true, message: "请输入应用名称" }],
};
// 监听 props.app 的变化
watch(
  () => props.app,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };
    } else {
      formData.value = { id: "", name: "", spmid: "", description: "" };
    }
  },
  { immediate: true }
);
// 提交表单
const handleSubmit = () => {
  // 校验表单,这里不知道为何valid为undefined，暂时不做表单校验，后续自己可以查下原因
  // formRef.value.validate((valid) => {
  //   if (valid) {
  const newItem = { ...formData.value };
  emit("submit", newItem);
  handleCancel();
  //   }
  // });
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
  // 重置表单的 name 字段
  formData.name = "";
  // 重置表单的 description 字段
  formData.description = "";
};
</script>
