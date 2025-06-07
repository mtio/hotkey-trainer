import { defineStore } from "pinia";
import { ref, computed } from "vue";
// @ts-ignore
import objectsYaml from "../data/objects.yaml";
import { type HotkeyObject, type Tag } from "./../models";

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
  }

  function failure(object: HotkeyObject) {
    failures.value.push(object);
  }

  function reset() {
    successes.value = [];
    failures.value = [];
  }

  /**
   * Populate `successes` and `failures` with the same random count N,
   * where N is a uniformly‑random integer in the inclusive range [min, max].
   * Useful for seeding the store during manual UI testing.
   *
   * @param min - minimum number of items to generate (≥ 0)
   * @param max - maximum number of items to generate (≥ min)
   */
  function generateSuccessAndFailures(min: number, max: number) {
    if (min < 0 || max < 0 || max < min) {
      throw new Error("Invalid min/max values");
    }

    // clear any existing data
    successes.value = [];
    failures.value = [];

    const total = Math.floor(Math.random() * (max - min + 1)) + min;

    // fill successes
    for (let i = 0; i < total; i++) {
      const obj =
        objects.value[Math.floor(Math.random() * objects.value.length)];
      successes.value.push(obj);
    }

    // fill failures
    for (let i = 0; i < total; i++) {
      const obj =
        objects.value[Math.floor(Math.random() * objects.value.length)];
      failures.value.push(obj);
    }
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
    generateSuccessAndFailures,
  };
});
