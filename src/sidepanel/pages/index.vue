<script setup lang="ts">
import { ref, watch } from 'vue';
import _ from 'lodash';
import IconMinusCircleMultiple from '~icons/mdi/minus-circle-multiple'
import IconChevronUpCircle from '~icons/mdi/chevron-up-circle'
import IconChevronDownCircle from '~icons/mdi/chevron-down-circle'
import IconPlusCircle from '~icons/mdi/plus-circle'
import IconMinusCircle from '~icons/mdi/minus-circle'
import IconDotsVerticalCircle from '~icons/mdi/dots-vertical-circle'
import IconDeleteCircle from '~icons/mdi/delete-circle'

const defaultHighlightColorPalette = [
  '#ffff77',
  '#aeff77',
  '#77ff92',
  '#77ffe4',
  '#77c9ff',
  '#7777ff',
  '#c977ff',
  '#ff77e4',
  '#ff7792',
  '#ffae77',
]; // ref https://www.pinterest.jp/pin/610871136954541241/

// v-medel for input texts
const highlights = ref(['']); // v-model
const foundCount = ref(['']); // v-model
const position = ref(['']); // v-model
const colorPalate = ref(['']); // v-model

// watch highlight array change and send message to content script
watch(highlights, (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'highlight',
      highlights: value,
      colorPalate: colorPalate.value
    });
  });
  // console.table(value);

  // if highlight length is not equal to colorPalate length, add color to colorPalate
  if (value.length > colorPalate.value.length) {
    console.table(colorPalate.value);
    colorPalate.value.push(defaultHighlightColorPalette[value.length % defaultHighlightColorPalette.length - 1]);
  }
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

// load colorPalate from chrome storage
chrome.storage.sync.get('colorPalate', (data) => {
  console.table(data.colorPalate);
  if (data.colorPalate) {
    colorPalate.value = data.colorPalate;
  } else {
    resetToDefaultColorPalate();
  }
  console.table(colorPalate.value);
  console.log('colorPalate loaded from onMounted');
});

// watch colorPalate array change and send message to content script
watch(colorPalate, (value) => {
  console.table(value);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'changeColor',
      colorPalate: value
    });
    // force re-highlight
    chrome.tabs.sendMessage(tabs[0].id, {
      type: 'highlight',
      highlights: highlights.value,
      colorPalate: value
    });
  });

  // save to chrome storage
  chrome.storage.sync.set({ colorPalate: value }, () => {
    console.table(value);
    console.log('colorPalate saved from watch');
  });
}, { deep: true });

function resetToDefaultColorPalate() {
  colorPalate.value = _.cloneDeep(defaultHighlightColorPalette);
  chrome.storage.sync.set({ colorPalate: colorPalate.value }, () => {
    console.table(colorPalate.value);
    console.log('colorPalate saved from resetToDefaultColorPalate');
  });
}


</script>

<template>
  <div class="flex">
    <div class="text-2xl text-slate-500">
      <icon-delete-circle v-tooltip="{ content: 'Reset highlight color to default' }"
        @click="resetToDefaultColorPalate()" />
    </div>
    <div class="grow"></div>
    <div class="text-2xl text-slate-500">
      <RouterLink to="/options" v-tooltip="{ content: 'Open option page' }">
        <icon-dots-vertical-circle />
      </RouterLink>
    </div>
  </div>

  <div v-for="(highlight, index) in              highlights             " :key="index"
    class="flex border rounded m-1 divide-x">
    <div class="flex grow">
      <div>
        <input type="color" v-model="colorPalate[index]" class="w-4 h-full bg-white"
          v-tooltip="{ content: 'Change highlight color' }" />
      </div>
      <input v-model="highlights[index]" type="" class="grow text-slate-500 dark:text-slate-400 bg-white"
        placeholder="  highlight text" @blur="highlights.push('')" />
      <div v-if="highlight && Number(foundCount[index]) != 0" class="flex text-base px-1 text-slate-400 bg-white">
        {{ position[index] + 1 }} / {{ foundCount[index] }}
      </div>
      <div v-else-if="highlight && Number(foundCount[index]) == 0" class="flex text-base px-1 text-slate-400 bg-white">
        {{ position[index] }} / {{ foundCount[index] }}
      </div>
    </div>
    <div class="flex text-2xl text-slate-500 bg-white">
      <icon-chevron-up-circle v-tooltip="{ content: 'Previous' }" @click="moveDown(index)" />
      <icon-chevron-down-circle v-tooltip="{ content: 'Next' }" @click="moveUp(index)" />
      <div v-if="index != 0">
        <icon-minus-circle v-tooltip="{ content: 'Remove this text' }" @click="remove(index)" />
      </div>
      <div v-else>
        <icon-minus-circle class="invisible" />
      </div>
    </div>
  </div>
  <div class="flex justify-center mx-5 text-2xl text-slate-500">
    <icon-plus-circle class="m-1" v-tooltip="{ content: 'Add text box' }" @click="highlights.push('')" />
    <icon-minus-circle-multiple class="m-1" v-tooltip="{ content: 'Clear all highlights' }" @click="clear()" />
  </div>

  <div class="flex justify-center underline m-5 text-slate-500">
    <RouterLink to="/about" v-tooltip="{ content: 'README (How to use)' }"> README </RouterLink>
  </div>
</template>

<style scoped></style>
