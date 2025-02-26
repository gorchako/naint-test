<script lang="ts" setup>
// eslint-disable-next-line no-undef
defineOptions({
  inheritAttrs: false
})

const emit = defineEmits<{
(e: 'update:modelValue', value: string): void
}>()

const props = defineProps<{
  error?: string,
}>()
</script>

<template>
  <div class="BaseInput">
    <input
        class="BaseInput__Input"
        v-bind="$attrs"
        :value="$attrs.modelValue"
        @input="emit('update:modelValue', $event.target.value)"
    />
    <span class="BaseInput__Label">{{ $attrs.placeholder }}</span>
    <span v-if="error" class="BaseInput__Error">{{ props.error }}</span>
  </div>
</template>

<style lang="scss">
.BaseInput {
  position: relative;
  display: flex;
  flex-direction: column;
  color: $color-blue;

  $self: &;

  &__Input {
    @include input-field;

    &::placeholder {
      opacity: 0;
    }

    &:focus + #{$self}__Label,
    &:not(:placeholder-shown) + #{$self}__Label,
    &:-webkit-autofill + #{$self}__Label {
      top: 10px;
    }
  }

  &__Label {
    @include input-label;
  }

  &__Error {
    @include input-error;
  }
}
</style>