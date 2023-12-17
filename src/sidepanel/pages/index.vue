<script setup lang="ts">
import { ref, watch } from 'vue';
import IconMinusCircleMultiple from '~icons/mdi/minus-circle-multiple'
import IconChevronUpCircle from '~icons/mdi/chevron-up-circle'
import IconChevronDownCircle from '~icons/mdi/chevron-down-circle'
import IconPlusCircle from '~icons/mdi/plus-circle'
import IconMinusCircle from '~icons/mdi/minus-circle'
import IconDotsVerticalCircle from '~icons/mdi/dots-vertical-circle'
// mdi: circle - half - full



// v-medel for input texts
const highlights = ref(['']); // v-model
const foundCount = ref(['']); // v-model
const position = ref(['']); // v-model

// watch highlight array change and send message to content script
watch(highlights, (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'highlight',
      highlights: value
    });
  });
  console.log('highlight', value);
}, { deep: true });

// get highlight found counts from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.foundCount !== undefined) {
    foundCount.value = request.foundCount;
  }
  if (request.position !== undefined) {
    position.value = request.position;
  }

  console.table(foundCount.value);
  console.table(position.value);
});



// move class multiple-highlighter-[idx] in page
function moveUp(idx: any) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'moveUp',
      index: idx
    });
  });
};

function moveDown(idx: any) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'moveDown',
      index: idx
    });
  });
};

// remove
function remove(index: any) {
  highlights.value.splice(index, 1);
  foundCount.value.splice(index, 1);
  position.value.splice(index, 1);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'remove',
      foundCount: foundCount.value,
      position: position.value
    });
  });
}

// clear result
function clear() {
  highlights.value = [''];
  foundCount.value = [];
  position.value = [];
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'clear',
    });
  });
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800">
    <div class="flex">
      <div class="grow"></div>
      <div class="text-2xl text-slate-700">
        <RouterLink to="/options">
          <icon-dots-vertical-circle />
        </RouterLink>
      </div>
    </div>

    <div v-for="(highlight, index) in              highlights             " :key="index"
      class="flex border rounded m-1 divide-x">
      <div class="flex grow">
        <input v-model="highlights[index]" type="" class="text-slate-500 dark:text-slate-400 rounded grow"
          placeholder="  highlight text" @blur="highlights.push('')" />
        <div v-if="highlight && Number(foundCount[index]) != 0" class="flex text-base mx-1 text-slate-400">
          {{ position[index] + 1 }} / {{ foundCount[index] }}
        </div>
        <div v-else-if="highlight && Number(foundCount[index]) == 0" class="flex text-base mx-1 text-slate-400 ">
          {{ position[index] }} / {{ foundCount[index] }}
        </div>
      </div>
      <div class="flex text-2xl text-slate-700">
        <icon-chevron-up-circle @click="moveDown(index)" />
        <icon-chevron-down-circle @click="moveUp(index)" />
        <div v-if="index != 0">
          <icon-minus-circle @click="remove(index)" />
        </div>
        <div v-else>
          <icon-minus-circle class="invisible" />
        </div>
      </div>
    </div>
    <div class="flex justify-center mx-5 text-2xl text-slate-700">
      <icon-plus-circle class="m-1" @click="highlights.push('')" />
      <icon-minus-circle-multiple class="m-1" @click="clear()" />
    </div>

    <div class="flex justify-center underline m-5 text-slate-500">
      <RouterLink to="/about"> by ut0s </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
