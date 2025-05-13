<template>
    <div class="min-h-screen flex flex-col items-center justify-center">  
      <!-- trainer or empty-state -->
      <div class="mb-4 text-lg font-semibold">
        Success: {{ successes.length }}<br>
        Failures: {{ failures.length }}
      </div>
      <HotkeyTrainer
        v-if="current"
        :object="current"
        @completed="nextObject"
      />
      <p v-else class="text-red-500">
        No objects match the current tag selection.
      </p>
      <Tags />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import HotkeyTrainer from './components/HotkeyTrainer.vue'
  import Tags from './components/Tags.vue'
  import { useHotkeyStore } from './stores/useHotkeyStore'
  
  const store = useHotkeyStore()
  const current = ref(store.pickRandom())
  const attemptCount = ref<number>(0)
  const successes = ref(store.successes)
  const failures = ref(store.failures)
  
  watch(
    () => store.filteredObjects,
    newList => {
      if (!newList.length) {
        current.value = null
      } else if (!current.value || !newList.includes(current.value)) {
        current.value = store.pickRandom()
      }
    },
    { deep: true }
  )
  
  function nextObject() {
    attemptCount.value++
    current.value = store.pickRandom()
  }
  </script>
