<script setup lang="ts">
import { ref, watch } from 'vue';
import IconMinusCircleMultiple from '~icons/mdi/minus-circle-multiple'
import IconChevronUpCircle from '~icons/mdi/chevron-up-circle'
import IconChevronDownCircle from '~icons/mdi/chevron-down-circle'
import IconPlusCircle from '~icons/mdi/plus-circle'
import IconMinusCircle from '~icons/mdi/minus-circle'



// v-medel for input texts
const highlights = ref(['']); // v-model
const foundCount = ref(['']); // v-model

// watch highlight array change and send message to content script
watch(highlights, (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { highlights: value });
  });
  console.log('highlight', value);
}, { deep: true });

// get highlight found counts from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  foundCount.value = request.foundCount;
  console.log('foundCount', foundCount.value);
});
</script>

<template>
  <div class="bg-white dark:bg-slate-800">
    <div v-for="(highlight, index) in highlights" :key="index" class="flex border rounded m-1 divide-x">
      <div class="flex grow">
        <input v-model="highlights[index]" type="" class="text-slate-500 dark:text-slate-400 rounded grow"
          placeholder="  highlight text" @blur="highlights.push('')" />
        <div class="flex text-base mx-1 text-slate-400">
          {{ foundCount[index] }}
        </div>
      </div>
      <div class="flex text-2xl text-slate-700">
        <icon-chevron-up-circle @click="" />
        <icon-chevron-down-circle @click="" />
        <div v-if="index != 0">
          <icon-minus-circle @click="highlights.splice(index, 1)" />
        </div>
        <div v-else>
          <icon-minus-circle class="invisible" />
        </div>
      </div>
    </div>
    <div class="flex justify-center mx-5 text-2xl text-slate-700">
      <icon-plus-circle class="m-1" @click="highlights.push('')" />
      <icon-minus-circle-multiple class="m-1" @click="highlights = ['']" />
    </div>
    <RouterLink to="/about">About me</RouterLink>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
