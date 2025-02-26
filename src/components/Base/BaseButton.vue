<script lang="ts" setup>
const props = defineProps<{
  loading?: boolean,
  disabled?: boolean,
}>()
</script>

<template>
  <button class="BaseButton" :disabled="disabled || loading">
    <div v-if="loading" class="loader" />
    <slot v-else />
  </button>
</template>

<style lang="scss">
.BaseButton {
  font-size: 14px;
  font-weight: 500;
  color: $color-white;
  background-color: $color-blue;
  padding: 12px 40px;
  border: 0;
  border-radius: 1000px;
  cursor: pointer;

  &[disabled] {
    cursor: not-allowed;
  }

  .loader {
    width: 30px;
  }
}
</style>