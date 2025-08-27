<template>
  <div>
    <h1 v-if="keys.length === 0">No logs available</h1>
    <div v-for="(key,i) in keys" :key="key" class="pb-2">
      <UButton
          class="hover:cursor-pointer" :color="childExpanded[i] ? 'secondary' : 'primary'"
          @click="childExpanded[i] = !childExpanded[i]">{{ childExpanded[i] ? "Collapse" : "Expand" }} {{ key }}
      </UButton>
      <SubTree :element="element[key]" :expanded="childExpanded[i]" :depth="0"/>
    </div>
    <!--    <pre>{{ dev }}</pre>-->
  </div>
</template>

<script lang="ts" setup>
export interface ProcessData {
  text: string;
  details?: string[];
}

export type ProcessDataObj = (ProcessData | ProcessData[])[];
export type ProcessDataRecord = Record<string, ProcessDataObj>
//example
//const props = defineProps({element: {default: {1: [{text: "a"}, {text: "b"}, [{text: "c"}]]}}})
const props = defineProps<{ element: ProcessDataRecord }>()
const keys = computed(() => props.element ? Object.keys(props.element) : [])
const childExpanded = ref<Record<string, boolean>>({})
//todo: shift click: expand all nested elements
</script>

<style scoped></style>