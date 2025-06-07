import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore("settings", () => {
  const showHotkeys = ref<boolean>(false);

  return {
    showHotkeys,
  };
});
