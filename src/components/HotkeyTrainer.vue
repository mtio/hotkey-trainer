  <template>
    <div :class="['w-full max-w-md text-center', error ? 'flash-error' : '']">
      {{ object.name }}
      <img :src="imageUrl" :alt="object.name" class="w-48 h-48 object-contain mx-auto mb-4" />
      <div class="flex justify-center gap-2 mb-2">
        <span
          v-for="(key, i) in object.hotkeys"
          :key="i"
          :class="[
            'px-3 py-1 rounded border text-sm',
            i < progress ? 'bg-green-500 text-white' : 'bg-gray-200'
        ]"
        >
          {{ key.toUpperCase() }}
        </span>
      </div>
  
      <p v-if="error" class="text-red-500">Wrong key! Start over.</p>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

import { useHotkeyStore } from '../stores/useHotkeyStore'
import type {HotkeyObject} from '../stores/useHotkeyStore'
const hotkeyStore = useHotkeyStore()

interface Props {
    object: HotkeyObject
}

const props = defineProps<Props>()
const emit = defineEmits<{ (e: 'completed'): void }>()

const imageUrl = computed(() =>
    new URL(`../assets/${props.object.image}`, import.meta.url).href
)

const progress = ref(0)
const error = ref(false)

function reset() {
    progress.value = 0
    error.value = false
}

watch(
    () => props.object.id,
    () => reset()
)

function handler(e: KeyboardEvent) {
    if (e.repeat) return
    const expected = props.object.hotkeys[progress.value]
    const pressed = normalizeKey(e)
    if (pressed === expected) {
        progress.value++
        if (progress.value === props.object.hotkeys.length) {
            hotkeyStore.success(props.object)
            emit('completed')
            reset()
        }
    } else {
        error.value = true
        // keep the error flag long enough for the flash animation, then reset
        setTimeout(() => reset(), 300)
        hotkeyStore.failure(props.object)
    }
}

function normalizeKey(e: KeyboardEvent): string {
    const map: Record<string, string> = {
        Control: 'ctrl',
        Shift: 'shift',
        Alt: 'alt',
        Meta: 'cmd'
    }
    return map[e.key] ?? e.key.toLowerCase()
}

onMounted(() => window.addEventListener('keydown', handler))
onUnmounted(() => window.removeEventListener('keydown', handler))
</script>

<style scoped>
@keyframes flash-red {
  0% { background-color: rgba(248, 113, 113, 0.5); }
  50% { background-color: rgba(248, 113, 113, 0.3); }
  100% { background-color: transparent; }
}
.flash-error {
  animation: flash-red 0.3s ease-out;
}
</style>
