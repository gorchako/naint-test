<script lang="ts" setup>
import { reactive, computed } from "vue";
import BaseInput from "@/components/Base/BaseInput.vue";
import BaseButton from "@/components/Base/BaseButton.vue";
import { AuthForm } from "@/components/MyAuth.types";

const emit = defineEmits<{
  (e: 'submit', payload: AuthForm): void
}>()

const props = defineProps<{
  loading?: boolean,
}>()

const form = reactive<AuthForm>({
  username: '',
  password: '',
  server: 'https://matrix.org'
})

const isSubmitDisabled = computed(() => !form.username || !form.password || !form.server)

function signIn () {
  emit('submit', form)
}
</script>

<template>
  <div class="auth">
    <BaseInput
        v-model="form.server"
        placeholder="Сервер"
    />

    <BaseInput
        v-model="form.username"
        placeholder="Логин"
    />

    <BaseInput
        v-model="form.password"
        placeholder="Пароль"
        type="password"
    />

    <BaseButton
        :loading="loading"
        :disabled="isSubmitDisabled"
        @click="signIn"
    >
      Войти
    </BaseButton>
  </div>
</template>

<style lang="scss">
.auth {
  .BaseInput {
    margin-bottom: 16px;
  }
}
</style>