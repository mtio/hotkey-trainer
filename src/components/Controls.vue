<template>
  <div class="controls-container grid grid-cols-2 gap-4 place-content-center">
    <button
      @click="reset()"
      class="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-md bg-zinc-900 text-gray-100 hover:bg-zinc-800"
    >
      <icon-refresh style="font-size: 2em" title="Reset" />
      Reset
    </button>
    <button
      @click="settingsStore.showHotkeys = !settingsStore.showHotkeys"
      class="flex flex-col items-center justify-center gap-1 px-4 py-3 rounded-md bg-zinc-900 text-gray-100 hover:bg-zinc-800"
    >
      <icon-keyboard style="font-size: 2em" title="Show Hotkeys" class="" />
      <span class="text-sm leading-tight text-center">
        Show <br />
        Hotkeys
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  //@ts-ignore
  import IconRefresh from "~icons/mdi/refresh";
  //@ts-ignore
  import IconKeyboard from "~icons/mdi/keyboard";
  import { useSettingsStore, useHotkeyStore } from "../stores";
  const settingsStore = useSettingsStore();
  const hotkeyStore = useHotkeyStore();
  function reset() {
    hotkeyStore.reset();
  }
</script>

<style scoped>
  .controls-container {
    padding: 1rem;
  }
</style>
