<template>
  <div class="w-full flex sm:justify-center">
    <div class="lg:w-3/6">
      <h1 class="text-center text-2xl pt-3">Users</h1>
      <div class="mt-4 mb-4">
        <UInput v-model="newValueUsername" placeholder="username"/>
        <UInput v-model="newValuePassword" placeholder="password"/>
        <UInput v-model="newValueVlan" placeholder="vlan id"/>
      <UButton @click="addUser()">Add Device</UButton>
      </div>
      <UTable :data="refData" :columns="col">
        <template #expanded="{ row }">
          <!--        <pre>{{ row.original.attributes }}</pre>-->
          <span>Vlan-ID: </span>
          <UInput v-model="row.original.attributes[2].value"/>
          <UButton @click="updateAttribute(row, row.original.attributes[2].value)">Update</UButton>
        </template>
        <template #actions-cell="{row}">
          <UButton @click="deleteEntry(row)">Delete</UButton>
        </template>
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">

import type {TableColumn} from "#ui/components/Table.vue";
import {UButton} from "#components";

const newValueUsername = ref()
const newValuePassword = ref()
const newValueVlan = ref()

async function addUser() {
  const res = await useFetch("/api/users", {method: "POST", body: JSON.stringify({
      user: newValueUsername.value,
      password: newValuePassword.value,
      attributes: {
        vlanId: newValueVlan.value
      }
    })})
  alert("added: " + res.status.value)
  updateTable()
}

async function deleteEntry(row) {
  console.log(row.original.username);
  const q = confirm("delete " + row.original.username + "?")
  if (!q) return;
  const {data} = await useFetch("/api/users/" + row.original.username, {
    method: "DELETE",
  })
  console.log(data)
  alert("deleted " + data.value.count)
  updateTable()
}

//make more general
async function updateAttribute(row, vlan) {
  console.log(vlan)
  await useFetch("/api/users/" + row.original.username, {
    method: "PATCH",
    body: JSON.stringify({password: row.original.password, attributes: {vlanId: vlan}})
  })
  alert("updated successfully to vlan: " + vlan)
  updateTable()
}

const col: TableColumn<any>[] = [
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
    accessorKey: "id"
  },
  {
    accessorKey: "username"
  },
  {
    accessorKey: "password"
  },
  {id: "actions", header: "Actions"}
]
const refData = ref<any[]>([])

async function updateTable() {
  const {data} = await useFetch('/api/users')
  // console.log(data.value)
  refData.value = data.value
}

updateTable()
</script>
