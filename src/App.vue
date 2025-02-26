<script lang="ts" setup>
import { ref } from "vue";
import MyAuth from "@/components/MyAuth.vue";
import MyRooms from "@/components/MyRooms.vue";
import { matrixClient } from "@/services/Matrix";
import { TokenManager } from "@/services/Token";
import { AuthForm } from "@/components/MyAuth.types";

const client = ref(matrixClient)
const isLoggedIn = ref(false)
const isAuthLoading = ref(false)

async function onSubmitAuth (payload: AuthForm) {
  if (
      !payload.server ||
      !payload.username ||
      !payload.password
  ) {
    return
  }

  isAuthLoading.value = true

  client.value.createClient({
    baseUrl: payload.server
  })

  try {
    const login = await client.value.login(
        payload.username, payload.password
    )

    if (login && login.access_token) {
      TokenManager.saveToken({
        accessToken: login.access_token
      })

      isLoggedIn.value = true

      client.value.createClient({
        baseUrl: payload.server,
        userId: login.user_id,
        accessToken: TokenManager.getToken().accessToken
      })

      await client.value.startClient()
    }
  } finally {
    isAuthLoading.value = false
  }
}
</script>

<template>
  <div class="main">
    <MyAuth
        class="main__auth"
        v-if="!isLoggedIn"
        :loading="isAuthLoading"
        @submit="onSubmitAuth"
    />

    <MyRooms v-else />
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.main {
  &__auth {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
  }
}
</style>