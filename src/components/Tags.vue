<template>
  <div class="grid grid-cols-4 gap-4">
    <span
      v-for="tag in tags"
      :key="tag.name"
      @click="toggle(tag.name)"
      :class="[
        'px-3 py-1 rounded border text-sm cursor-pointer select-none transition-colors capitalize',
        tag.selected
          ? 'bg-blue-100 border-blue-400 text-black'
          : 'bg-transparent border-gray-300 text-white'
      ]"
    >
      {{ tag.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
/**
 * Tags.vue — reads tag state directly from the Pinia hotkey store.
 * Each tag box is filled with a light color when selected and transparent when not.
 */
import { storeToRefs } from 'pinia'
import { useHotkeyStore } from '../stores/useHotkeyStore'

const hotkeyStore = useHotkeyStore()
const { tags } = storeToRefs(hotkeyStore)

function toggle(name: string) {
  hotkeyStore.toggleTag(name)
}
</script>
