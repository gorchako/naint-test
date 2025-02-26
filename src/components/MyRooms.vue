<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { matrixClient } from "@/services/Matrix";
import { TokenManager } from "@/services/Token";

const client = ref(matrixClient)

const activeRoomId = ref()

const roomsSort = ref('alpha')

const roomsAvatars = ref({})

const rooms = computed(() => {
  return client.value.getRooms()
})

const roomsSorted = computed(() => {
  const result = [...rooms.value]

  if (roomsSort.value === 'alpha') {
    result.sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()

      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    })
  }

  if (roomsSort.value === 'date') {
    result.sort((a, b) => {
      const timelineA = a.getLiveTimeline()
      const timelineB = b.getLiveTimeline()
      const lastEventTimestampA = timelineA.events[timelineA.events.length - 1].event.origin_server_ts
      const lastEventTimestampB = timelineB.events[timelineB.events.length - 1].event.origin_server_ts
      return lastEventTimestampB - lastEventTimestampA
    })
  }

  return result
})

const selectedRoom = computed(() => {
  return rooms.value.find(room => room.roomId === activeRoomId.value)
})

const selectedRoomEvents = computed(() => {
  const timeline = selectedRoom.value?.getLiveTimeline()

  return timeline?.events
})

const selectedRoomMessages = computed(() => {
  const events = selectedRoomEvents.value

  return events?.filter(ev => ev.event.type === 'm.room.message').map(ev => {
    return { senderName: ev.sender.name, message: ev.event.content.body }
  })
})

const roomsLastMessage = computed(() => {
  const result = {}

  for (const room of rooms.value) {
    const roomTimeline = room.getLiveTimeline()
    const lastMessage = roomTimeline.events?.findLast(ev => ev.event.type === 'm.room.message')

    if (!lastMessage) continue

    result[room.roomId] = { senderName: lastMessage.sender.name, message: lastMessage.event.content.body }
  }

  return result
})

async function loadRoomsAvatars () {
  for (const room of rooms.value) {
    const mxcUrl = room.getMxcAvatarUrl()
    let roomAvatar = roomsAvatars.value[room.roomId]

    if (!mxcUrl || roomAvatar) continue

    const downloadUrl = client.value.mxcUrlToHttp(
        /*mxcUrl=*/ mxcUrl,
        /*width=*/ undefined,
        /*height=*/ undefined,
        /*resizeMethod=*/ undefined,
        /*allowDirectLinks=*/ false,
        /*allowRedirects=*/ true,
        /*useAuthentication=*/ true,
    )

    await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${TokenManager.getToken().accessToken}`,
      },
    }).then(response => response.blob())
        .then(blob => {
            roomsAvatars.value[room.roomId] = URL.createObjectURL(blob)
        })
  }
}

function selectRoom(room: string) {
  activeRoomId.value = room
}

onMounted(async () => {
  await client.value.syncClient((state) => {
    if (state === 'PREPARED') {
      loadRoomsAvatars()
    }
  })
})
</script>

<template>
  <div class="rooms">
    <div class="rooms__header">
      <fieldset>
        <legend>Сортировать комнаты:</legend>

        <div>
          <input type="radio" id="alpha" name="roomSort" value="alpha" v-model="roomsSort" />
          <label for="alpha">По алфавиту</label>
        </div>

        <div>
          <input type="radio" id="date" name="roomSort" value="date" v-model="roomsSort" />
          <label for="date">По дате последнего события</label>
        </div>
      </fieldset>
    </div>

    <div class="rooms__body">
      <div class="rooms__list">
        <div
            class="room"
            v-for="room in roomsSorted"
            :key="room.roomId"
            @click="selectRoom(room.roomId)"
        >
          <div class="room__img">
            <img
                v-if="roomsAvatars[room.roomId]"
                :src="roomsAvatars[room.roomId]"
                alt=""
            >
          </div>

          <div class="room__content">
            <span class="room__name">
              {{ room.name}} ({{ room.getUnreadNotificationCount() }})
            </span>

            <div class="room__lastmessage">
              <span v-if="roomsLastMessage[room.roomId]">
                {{ roomsLastMessage[room.roomId].senderName }}: {{ roomsLastMessage[room.roomId].message }}
              </span>
              <span v-else>Сообщений нет</span>
            </div>
          </div>
        </div>
      </div>

      <div class="rooms__messages">
        <div class="rooms__message" v-for="msg in selectedRoomMessages" :key="msg.event_id">
          <span>{{ msg.senderName }}: {{ msg.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.rooms {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;

  &__header {
    margin-bottom: 16px;
  }

  &__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .room {
    display: flex;
    gap: 8px;
    padding: 8px;
    border: 1px solid gray;
    border-radius: 4px;
    margin-bottom: 8px;

    &:hover {
      cursor: pointer;
    }

    &__img {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      border: 1px solid gray;

      img {
        width: 100%;
      }
    }

    &__lastmessage {
      font-size: 12px;
      margin-top: 4px;
    }
  }

  &__message {
    padding: 8px;
    border: 1px solid gray;
    border-radius: 4px;
    margin-bottom: 8px;
    text-align: left;
  }
}
</style>