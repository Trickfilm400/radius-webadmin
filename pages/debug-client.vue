<script setup lang="ts">
import {io, type Socket} from "socket.io-client";
import type {RadioGroupItem, RadioGroupValue} from '@nuxt/ui'
import type {AbstractData} from "~/components/AbstractData.vue";

const toast = useToast()
const url = ref("http://192.168.2.45:3000")
const list = ref()
//select container
const containerItems = ref<RadioGroupItem[]>([])
const selectedContainerId = ref<RadioGroupValue>()
const currentLogRAW = ref<string>("")
const currentLogProcessed = ref<any>()
const currentLogProcessedAbstract = ref<Record<string, AbstractData>>({})
let server: Socket;
// onMounted()
onUnmounted(() => {
  //remove listener on Unmounted
  server.off('containerList', on_containerList);
  server.off('logStream', on_logStream);
  server.off("connect", on_connect)
  server.off('logProcessing', on_logProcessing);
  server.off('logProcessingAbstract', on_logProcessingAbstract)
})
//connect and listen on events
function connect() {
  //server.disconnect()
  server = io(url.value);
  server.on('containerList', on_containerList);
  server.on('logStream', on_logStream);
  server.on("connect", on_connect)
  server.on('logProcessing', on_logProcessing);
  server.on('logProcessingAbstract', on_logProcessingAbstract)
}

function on_connect() {}
function on_logStream(log: string[]) {
  currentLogRAW.value += log.join('')
}
function on_logProcessing(processedData: any) {
  currentLogProcessed.value = processedData
}
function on_logProcessingAbstract(id: string, abstrData: AbstractData) {
  currentLogProcessedAbstract.value[id] = abstrData;
}
function on_containerList(data: any) {
  console.log(data)
  containerItems.value = []
  list.value = data;
  data.forEach(container => {
    containerItems.value.push({
      label: container.Names[0].substring(1),
      value: container.Id,
      description: container.Image
    })
  })
  selectedContainerId.value = list.value[0].Id
}

function controlContainer(action: "START" | "STOP" | "RESTART" | "START_STREAM") {
  const eventMap = {
    START: "startContainer",
    STOP: "stopContainer",
    RESTART: "restartContainer",
    START_STREAM: "startTrailing"
  }
  server.emit(eventMap[action], selectedContainerId.value, (res: boolean) => {
    toast.add({
      title: "Action: " + action,
      description: "Execution Result from server: " + res
    })
  })
}
</script>

<template>
  <div class="p-5">
    <UButtonGroup>
      <UBadge color="neutral" variant="subtle" size="lg" label="Socket.IO Server Address:"/>
      <UInput v-model="url"/>
      <UButton class="hover:cursor-pointer" @click="connect">Connect</UButton>
    </UButtonGroup>
    <p>Is Connected:
      <UBadge :color="server ? (server.disconnected ? 'error' : 'primary') : 'error'">
        {{ server ? (server.disconnected ? "no" : "yes") : "no" }}
      </UBadge>
    </p>

    <p>Select your Radius Container here:</p>
    <URadioGroup v-if="containerItems.length > 0" v-model="selectedContainerId" :items="containerItems"/>
    <UBadge v-else color="error" variant="subtle" size="md" label="no container found"/>
    <p>Container Controls:</p>
    <p>Hint: The "Start Log Stream" button has to be pressed once per container!</p>
    <UButtonGroup orientation="horizontal">
      <UButton class="hover:cursor-pointer" color="neutral" variant="subtle" label="Start" @click="controlContainer('START')"/>
      <UButton class="hover:cursor-pointer" color="neutral" variant="outline" label="Stop" @click="controlContainer('STOP')"/>
      <UButton class="hover:cursor-pointer" color="neutral" variant="subtle" label="Restart" @click="controlContainer('RESTART')"/>
      <UButton class="hover:cursor-pointer" color="neutral" variant="outline" label="Start Log Stream" @click="controlContainer('START_STREAM')"/>
      <UButton class="hover:cursor-pointer" color="neutral" variant="outline" label="clear local console" @click="currentLogRAW = ''"/>
    </UButtonGroup>
    <USeparator class="pt-2 pb-2"/>
    <h1 class="text-center text-2xl">Processed Logs</h1>
    <TreeExpand :element="currentLogProcessed"/>
    <USeparator class="pt-2 pb-2"/>
<!--    <pre>{{ currentLogProcessed }}</pre>-->
    <h1 class="text-center text-2xl">Abstracted Logs</h1>
    <AbstractData :data="currentLogProcessedAbstract"/>
    <USeparator class="pt-2 pb-2"/>
<!--    <pre>{{ currentLogProcessedAbstract }}</pre>-->
    <h1 class="text-center text-2xl">RAW-Debug-Log of Radius Server</h1>
    <UTextarea v-model="currentLogRAW" class="w-full" :rows="50" disabled/>

    <!--    <pre>{{ list }}</pre>-->
  </div>
</template>

<style scoped>

</style>