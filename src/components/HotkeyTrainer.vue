<template>
  <div
    :class="[
      'text-center',
      error ? 'flash-error' : '',
      success ? 'flash-green' : '',
    ]"
  >
    {{ object.name }}
    <img
      :src="imageUrl"
      :alt="object.name"
      class="w-48 h-48 object-contain mx-auto mb-4"
    />
    <div
      class="flex justify-center gap-2 mb-2"
      v-if="settingsStore.showHotkeys"
    >
      <span
        v-for="(key, i) in object.hotkeys"
        :key="i"
        :class="[
          'px-3 py-1 rounded border text-sm',
          i < progress ? 'bg-green-500 text-white' : 'bg-gray-200 text-black',
        ]"
      >
        {{ key.toUpperCase() }}
      </span>
    </div>

    <p v-if="object.tags" class="text-xs text-gray-500 mt-1">
      {{ object.tags.join(", ") }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, computed } from "vue";

  import type { HotkeyObject } from "@/models";
  import { useHotkeyStore, useSettingsStore } from "../stores";
  const hotkeyStore = useHotkeyStore();
  const settingsStore = useSettingsStore();

  interface Props {
    object: HotkeyObject;
    incomingKey: string | null;
  }
  const props = defineProps<Props>();
  const emit = defineEmits<{ (e: "completed"): void }>();

  const imageUrl = computed(
    () => new URL(`../assets/${props.object.image}`, import.meta.url).href
  );

  const progress = ref(0);
  const error = ref(false);
  const success = ref(false);

  function reset() {
    progress.value = 0;
    error.value = false;
    success.value = false;
  }

  //   watch(
  //     () => props.object.id,
  //     () => reset()
  //   );

  watch(
    () => props.incomingKey,
    (incomingKey) => (incomingKey ? handler(incomingKey) : null)
  );

  function handler(pressed: string) {
    const expected = props.object.hotkeys[progress.value];
    if (pressed === expected) {
      progress.value++;
      if (progress.value === props.object.hotkeys.length) {
        hotkeyStore.success(props.object);
        emit("completed");
        success.value = true;
        setTimeout(() => reset(), 300);
      }
    } else {
      error.value = true;
      // keep the error flag long enough for the flash animation, then reset
      hotkeyStore.failure(props.object);
      setTimeout(() => reset(), 300);
    }
  }
</script>

<style scoped>
  @keyframes flash-red {
    0% {
      background-color: rgba(248, 113, 113, 0.5);
    }

    50% {
      background-color: rgba(248, 113, 113, 0.3);
    }

    100% {
      background-color: transparent;
    }
  }

  .flash-error {
    animation: flash-red 0.3s ease-out;
  }

  @keyframes flash-green {
    0% {
      background-color: rgba(52, 211, 153, 0.5);
    }

    50% {
      background-color: rgba(52, 211, 153, 0.3);
    }

    100% {
      background-color: transparent;
    }
  }

  .flash-green {
    animation: flash-green 0.3s ease-out;
  }
</style>
