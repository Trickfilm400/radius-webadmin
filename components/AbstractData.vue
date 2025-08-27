<script setup lang="ts">
import {h, resolveComponent} from 'vue'
import type {TableColumn} from '@nuxt/ui'

const UButton = resolveComponent('UButton')
type JSONAlias = Record<string, string>;

export interface AbstractData {
  request: { properties: JSONAlias; request: JSONAlias };
  execute: Record<
      string,
      {
        file: string;
        data: Record<string, JSONAlias>;
      }
  >;
  global: { properties: JSONAlias; str: string[] };
  response: { properties: JSONAlias; response: JSONAlias; state?: string };
  challenge: { properties: JSONAlias; response: JSONAlias };
}

const props = defineProps<{ data: Record<string, AbstractData> }>()

const dat = computed(() => {
  return Object.keys(props.data).map(key => ({key, data: props.data[key]}))
})


const columns: TableColumn<any>[] = [
  {
    id: 'expand',
    cell: ({row}) =>
        h(UButton, {
          color: 'neutral',
          variant: 'ghost',
          icon: 'i-lucide-chevron-down',
          square: true,
          'aria-label': 'Expand',
          ui: {
            leadingIcon: [
              'transition-transform',
              row.getIsExpanded() ? 'duration-200 rotate-180' : ''
            ]
          },
          onClick: () => row.toggleExpanded()
        })
  },
  {
    id: "id",
    accessorKey: "key",
    header: "internal radius request id"
  },
  {
    id: "username",
    accessorKey: "data.request.properties.User-Name",
    header: "Username"
  }, {
    id: "returnState",
    accessorKey: "data.response.state",
    header: "Response Result/Status"
  }
]
</script>

<template>
  <div>
    <UTable :data="dat" :columns="columns">
      <template #expanded="{ row }">
        <div class="flex">
          <div class="border-r-gray-500 border-r-1">
            <p class="text-center text-xl">Request Info</p>
            <UTable
                :data="Object.keys(row.original.data.request.properties).map(key => ({key, value: row.original.data.request.properties[key]}))"
                :columns="[{accessorKey: 'key', header: 'Key'}, {accessorKey: 'value', header: 'Value'}]"/>
          </div>
          <div>
            <p class="text-center text-xl">Response Info</p>
            <UTable
                :data="Object.keys(row.original.data.response.properties).map(key => ({key, value: row.original.data.response.properties[key]}))"
                :columns="[{accessorKey: 'key', header: 'Key'}, {accessorKey: 'value', header: 'Value'}]"/>
          </div>
        </div>
        <!--        <pre>{{ row.original }}</pre>-->
      </template>
    </UTable>
  </div>
</template>

<style scoped>

</style>