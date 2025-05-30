import { defineStore } from "pinia";
import { ref, computed } from "vue";
// @ts-ignore
import objectsYaml from "../data/objects.yaml";

export interface HotkeyObject {
  id: string;
  name: string;
  image: string;
  hotkeys: string[];
  tags?: string[];
}

export interface Tag {
  name: string;
  selected: boolean;
}

export const useHotkeyStore = defineStore("hotkey", () => {
  /* -------- raw data -------- */
  const objects = ref(objectsYaml as HotkeyObject[]);
  const failures = ref<HotkeyObject[]>([]);
  const successes = ref<HotkeyObject[]>([]);

  /* -------- tag collection -------- */
  const tags = ref<Tag[]>(
    Array.from(new Set(objects.value.flatMap((o) => o.tags ?? [])))
      .sort((a, b) => a.localeCompare(b))
      .map((t) => ({ name: t, selected: true }))
  );

  /* -------- helpers -------- */
  const filteredObjects = computed(() => {
    const excluded = new Set(
      tags.value.filter((t) => !t.selected).map((t) => t.name)
    );
    return objects.value.filter(
      (o) => !(o.tags ?? []).some((tag) => excluded.has(tag))
    );
  });

  function toggleTag(tagName: string) {
    const tag = tags.value.find((t) => t.name === tagName);
    if (tag) tag.selected = !tag.selected;
  }

  function success(object: HotkeyObject) {
    successes.value.push(object);
    // const index = objects.value.findIndex((o) => o.id === object.id);
    // if (index !== -1) {
    //   successes.value.push(objects.value[index]);
    //   objects.value.splice(index, 1);
    // }
  }
  function failure(object: HotkeyObject) {
    failures.value.push(object);
    // const index = objects.value.findIndex((o) => o.id === object.id);
    // if (index !== -1) {
    //   failures.value.push(objects.value[index]);
    //   objects.value.splice(index, 1);
    // }
  }
  function reset() {
    // objects.value = [...successes.value, ...failures.value];
    successes.value = [];
    failures.value = [];
    // tags.value.forEach((tag) => (tag.selected = true));
  }

  // Used to prevent same object being picked twice in a row
  const lastIndex = ref<number>(-1);

  function pickRandom(): HotkeyObject | null {
    const arr = filteredObjects.value;
    if (arr.length === 0) return null;

    let newIndex: number;
    if (arr.length === 1) {
      newIndex = 0;
    } else {
      // pick until different from lastIndex
      do {
        newIndex = Math.floor(Math.random() * arr.length);
      } while (newIndex === lastIndex.value);
    }

    lastIndex.value = newIndex;
    return arr[newIndex];
  }

  return {
    /* state */
    tags,
    successes,
    failures,
    /* getters */
    filteredObjects,
    /* actions */
    toggleTag,
    pickRandom,
    success,
    failure,
    reset,
  };
});
