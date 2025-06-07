<template>
  <div class="history p-4">
    <h2 class="text-2xl font-semibold mb-4">History</h2>
    <div class="mb-4 text-lg font-semibold">
      Success: {{ successes.length }} |
      Failures: {{ failures.length }}
    </div>
    <div>
      <div
        v-for="section in historySections"
        :key="section.key"
        class="mb-6 last:mb-0"
      >
        <h3 class="text-xl font-medium mb-2 first:mt-0">
          {{ section.title }}
        </h3>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="item in section.items"
            :key="item.id"
            :class="[section.bg, 'rounded-lg p-4 flex flex-col items-center']"
          >
            <img
              :src="resolveImage(item.image)"
              :alt="item.name"
              class="w-16 h-16 mb-2"
            />
            <h4 class="font-semibold">{{ item.name }}</h4>
            <p class="text-sm text-gray-900">Count: {{ item.count }}</p>
            <p class="text-sm text-gray-700" v-if="settingsStore.showHotkeys">
              Hotkeys: {{ item.hotkeys.join(", ") }}
            </p>
            <p v-if="item.tags" class="text-xs text-gray-500 mt-1">
              {{ item.tags.join(", ") }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useHotkeyStore, useSettingsStore } from "../stores";
  import { computed } from "vue";
  import { resolveImage } from "./../utils/images";
  const hotkeyStore = useHotkeyStore();
  const settingsStore = useSettingsStore();

  const successes = computed(() => hotkeyStore.successes);
  const groupedSuccesses = computed(() => {
    const map = new Map<string, any>();
    for (const item of successes.value) {
      if (map.has(item.id)) {
        map.get(item.id).count++;
      } else {
        map.set(item.id, { ...item, count: 1 });
      }
    }
    return Array.from(map.values());
  });

  const failures = computed(() => hotkeyStore.failures);
  const groupedFailures = computed(() => {
    const map = new Map<string, any>();
    for (const item of failures.value) {
      if (map.has(item.id)) {
        map.get(item.id).count++;
      } else {
        map.set(item.id, { ...item, count: 1 });
      }
    }
    return Array.from(map.values());
  });

  /**
   * Combine successes and failures into an array of “sections”
   * so the template only has to render one v‑for.
   */
  const historySections = computed(() => [
    {
      key: "success",
      title: "Successes",
      bg: "bg-emerald-400",
      items: groupedSuccesses.value,
    },
    {
      key: "failure",
      title: "Failures",
      bg: "bg-slate-400",
      items: groupedFailures.value,
    },
  ]);
</script>

<style scoped>
  .history {
    padding: 1rem;
  }
</style>
