<script setup lang="ts">
const props = defineProps({
  label: String,
  tooltip: String,
  isChecked: Boolean
})
const emit = defineEmits(['update:isChecked'])

const toggle = () => {
  emit('update:isChecked', !props.isChecked)
}
</script>

<template>
  <div class="block m-1 ">
    <label v-tooltip="tooltip" class="mx-1 text-slate-800 text-lg dark:text-slate-400">
      <input
type="checkbox"
        class="w-5 h-5 text-slate-500 border-2 rounded-full focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-white focus:ring-opacity-0"
        :checked="isChecked" @change=toggle() />
      {{ label }}
    </label>
  </div>
</template>