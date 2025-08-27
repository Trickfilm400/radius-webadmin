<script setup lang="ts">
import type {ProcessDataObj} from "~/components/TreeExpand.vue";

const props = defineProps<{ element: ProcessDataObj, expanded?: boolean, depth: number }>();
const childExpanded = ref<Record<string, boolean>>({})
</script>

<template>
  <div v-if="props.expanded" class="pl-4">
    <div v-for="(el,i) in element" :key="i">
      <p v-if="!Array.isArray(el) && el.text">{{ el.text }}</p>
      <p
          v-for="(details,detailsIndex) in el.details" v-if="!Array.isArray(el) && el.details" :key="detailsIndex"
          class="italic pl-2 border-l-gray-600 border-l-1">DETAILS | {{ details }}</p>
      <div v-else-if="Array.isArray(el)" class="flex border-t-gray-600 border-t-1">
        <UButton
            class="hover:cursor-pointer" :color="childExpanded[i] ? 'secondary' : 'primary'"
            @click="childExpanded[i] = !childExpanded[i]">
          {{ childExpanded[i] ? "-" : "+" }}
        </UButton>
        <SubTree :element="el" :expanded="childExpanded[i]" :depth="props.depth+1"/>
      </div>
    </div>
  </div>
</template>