<script setup lang="ts">
import IconDotsVerticalCircle from '~icons/mdi/dots-vertical-circle'
import _ from 'lodash';


const defaultOptions = {
  useRegex: false,
  accuracy: 'partially',
  diacritics: true,
  synonyms: false,
  iframes: false,
  acrossElements: false,
  caseSensitive: false,
  ignoreJoiners: false,
  ignorePunctuation: [],
  wildcards: 'disabled'
};

// v-model for options
const options = ref({}); // v-model

// watch options and save to chrome storage
watch(options, (newVal) => {
  // save to chrome storage
  chrome.storage.sync.set({ options: newVal }, () => {
    console.table(options.value);
    console.log('options saved from watch');
  });

  // send message to content script
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id,
      { type: 'options' }, (response) => {
        console.log(response);
      });
  });
}, { deep: true });

// set default options function
function resetDefaultOptions() {
  // save to chrome storage
  chrome.storage.sync.set({ options: defaultOptions }, () => {
    console.table(options.value);
    console.log('options saved from resetDefaultOptions');
  });
  options.value = _.cloneDeep(defaultOptions);
};

// when mounted load options from chrome storage
onMounted(() => {
  // load from chrome storage
  chrome.storage.sync.get('options', (data) => {
    console.table(data.options);
    if (data.options) {
      options.value = data.options;
    } else {
      options.value = _.cloneDeep(defaultOptions);
    }
    console.table(options.value);
    console.log('options loaded from onMounted');
  });
});
</script>

<template>
  <div class="text-center m-4 grow">
    <div class="flex justify-center">
      <div class="text-2xl text-slate-700">
        <icon-dots-vertical-circle />
      </div>
      <h1 class="text-lg font-bold underline decoration-[0.5rem] decoration-green-300 pb-6">
        Multiple Highlighter - Options
      </h1>
    </div>

    <div class="flex flex-col text-lg">
      <div class="rounded m-1">
        <input type="checkbox" id="regex" v-model="options.useRegex" />
        <label for="regex"
          v-tooltip="{ content: 'Whether to search for each word separated by a blank instead of the complete term' }">
          use regex <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"
            target="_blank" class="underline"> (more
            info)</a>
        </label>
      </div>
      <div class="rounded m-1">
        <select id="accuracy" v-model="options.accuracy">
          <option disabled value="">Default: partially</option>
          <option> partially</option>
          <option>complementary</option>
          <option>exactly</option>
        </select>
      </div>
      <div class="rounded m-1">
        <input type="checkbox" id="diacritics" v-model="options.diacritics" />
        <label for="diacritics"> diacritics</label>
      </div>
      <div class="rounded m-1">
        <input type="checkbox" id="iframes" v-model="options.iframes" />
        <label for="iframes"> iframes</label>
      </div>
      <div class="rounded m-1">
        <input type="checkbox" id="acrossElements" v-model="options.acrossElements" />
        <label for="acrossElements"> acrossElements</label>
      </div>
      <div class="rounded m-1">
        <input type="checkbox" id="caseSensitive" v-model="options.caseSensitive" />
        <label for="caseSensitive"> caseSensitive</label>
      </div>
      <div class="rounded m-1">
        <input type="checkbox" id="ignoreJoiners" v-model="options.ignoreJoiners" />
        <label for="ignoreJoiners"> ignoreJoiners</label>
      </div>
      <div class="rounded m-1">
        <input type="checkbox" id="ignorePunctuation" v-model="options.ignorePunctuation" />
        <label for="ignorePunctuation"> ignorePunctuation</label>
      </div>
      <div class="rounded m-1">
        <select id="wildcards" v-model="options.wildcards">
          <option disabled value="">Default: disabled</option>
          <option>disabled</option>
          <option>enabled</option>
          <option>withSpaces</option>
        </select>
      </div>
    </div>

    <div class="flex justify-center text-lg">
      <button @click="resetDefaultOptions" class="rounded border-solid border-2 px-2"> reset to default</button>
    </div>



    <div class="justify-center m-5 text-slate-500">
      Detail information about option is available at&nbsp; <a
        href="https://markjs.io/#:~:text=div.test%22).-,4.2%20mark(),-A%20method%20to" target="_blank"
        class="underline">Here</a>.
    </div>

    <div class="flex justify-center underline m-5 text-slate-500">
      <button class="underline" @click="$router.back">Go Back</button>
    </div>
  </div>

  <footer class="flex justify-center bg-gray-50">
    This extension is made by&nbsp; <a href=" https://in-da-shell.com/" target="_blank" class="underline">ut0s</a>.
  </footer>
</template>

<style scoped></style>
