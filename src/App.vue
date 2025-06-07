<template>
  <div id="root-container" class="max-h-screen mix-w-full">
    <div class="flex flex-col">
      <div class="flex items-center justify-end px-4 py-2">
        <span class="text-xs text-slate-200"> BAR Hotkey Trainer </span>
        <a
          href="https://github.com/mtio/hotkey-trainer"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block"
        >
          <icon-github
            class="w-6 h-6 text-white hover:text-gray-300 ml-3"
            aria-label="View on GitHub"
          />
        </a>
      </div>
      <div class="flex">
        <div class="flex-1">
          <Controls />
          <br />
          <div class="">
            <History />
          </div>
        </div>
        <div class="flex-1">
          <div class="items-center text-center">
            <HotkeyTrainer
              v-if="current"
              :object="current"
              :incoming-key="normalizedKey"
              @completed="nextObject"
            />
            <p v-else class="text-red-500">
              No objects match the current tag selection.
            </p>
          </div>
        </div>
        <div class="flex-1 flex flex-col">
          <Tags />

          <!-- <div class="col-span-1 row-span-1">
        </div>
        <div class="col-span-1 row-span-1">
          <p class="text-xs color-slate-200 max-w-30 ml-auto">
            In the end, we're all just sitting around the fire...
          </p>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  //@ts-ignore
  import IconGithub from "~icons/mdi/github";

  import { ref, watch, onMounted, onUnmounted } from "vue";
  import { Tags, HotkeyTrainer, History, Controls } from "./components/";
  import { useHotkeyStore } from "./stores/useHotkeyStore";

  const gridKeys: Array<string> = [
    "q",
    "w",
    "e",
    "r",
    "a",
    "s",
    "d",
    "f",
    "z",
    "x",
    "c",
    "v",
  ];

  const hotkeyStore = useHotkeyStore();
  const current = ref(hotkeyStore.pickRandom());
  const attemptCount = ref<number>(0);
  const normalizedKey = ref<string | null>(null);

  // hotkeyStore.generateSuccessAndFailures(5, 12);

  onMounted(() => window.addEventListener("keydown", processKeyDownEvent));
  onUnmounted(() => window.removeEventListener("keydown", processKeyDownEvent));

  onMounted(() => window.addEventListener("keyup", processKeyUpEvent));
  onUnmounted(() => window.removeEventListener("keyup", processKeyUpEvent));

  watch(
    () => hotkeyStore.filteredObjects,
    (newList) => {
      if (!newList.length) {
        current.value = null;
      } else if (!current.value || !newList.includes(current.value)) {
        current.value = hotkeyStore.pickRandom();
      }
    },
    { deep: true }
  );

  function processKeyUpEvent() {
    normalizedKey.value = null;
  }

  function processKeyDownEvent(e: KeyboardEvent) {
    if (e.repeat) return;
    const key = normalizeKey(e);
    if (!gridKeys.includes(key)) return;
    normalizedKey.value = key;
  }

  function nextObject() {
    attemptCount.value++;
    current.value = hotkeyStore.pickRandom();
  }

  function normalizeKey(e: KeyboardEvent): string {
    const map: Record<string, string> = {
      Control: "ctrl",
      Shift: "shift",
      Alt: "alt",
      Meta: "cmd",
    };
    return map[e.key] ?? e.key.toLowerCase();
  }
</script>
