<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import IconDotsVerticalCircle from '~icons/mdi/dots-vertical-circle'
import IconHelpCircle from '~icons/mdi/help-circle'
import _ from 'lodash';

import CheckBox from '~/Components/CheckBox.vue'
import ModalAboutAccuracyOption from '~/Components/ModalAboutAccuracyOption.vue'
import ModalAboutWildcardsOption from '~/Components/ModalAboutWildcardsOption.vue'
import FeatureRequestBugReport from '~/components/FeatureRequestBugReport.vue';

const defaultOptions = {
  useRegex: false,
  accuracy: 'partially',
  diacritics: true,
  synonyms: false,
  iframes: false,
  acrossElements: false,
  caseSensitive: false,
  ignoreJoiners: false,
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
      <div class="text-2xl text-slate-500">
        <icon-dots-vertical-circle />
      </div>
      <h1 class="text-lg font-bold underline decoration-[0.5rem] decoration-green-300 pb-6">
        Multiple Highlighter - Options
      </h1>
    </div>

    <div class="text-left text-lg">
      <CheckBox
label="use regex"
        tooltip="Whether to search for each word separated by a blank instead of the complete term"
        :is-checked="options.useRegex" @update:is-checked="options.useRegex = !options.useRegex" />

      <a
href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions" target="_blank"
        class="text-slate-400 underline text-sm"> (more info about regex)</a>

      <hr class="my-1 h-px border-0 bg-gray-300" />

      <CheckBox
label="dialectics" tooltip="If <a>diacritic</a> characters should be matched. For example &quot;piękny&quot; would also
        match &quot;piekny&quot; and &quot;doner&quot; would also match &quot;döner&quot;"
        :is-checked="options.diacritics" @update:is-checked="options.diacritics = !options.diacritics" />
      <a href="https://en.wikipedia.org/wiki/Diacritic" target="_blank" class="text-slate-400 underline text-sm"> (more
        info about
        diacritic)</a>
      <CheckBox
label="iframes"
        tooltip="Whether to search also inside iframes. If you don't have permissions to some iframes they will be silently skipped."
        :is-checked="options.iframes" @update:is-checked="options.iframes = !options.iframes" />
      <CheckBox
label="acrossElements" tooltip="Whether to search for matches across elements."
        :is-checked="options.acrossElements" @update:is-checked="options.acrossElements = !options.acrossElements" />
      <CheckBox
label="caseSensitive" tooltip="Whether to search case sensitive" :is-checked="options.caseSensitive"
        @update:is-checked="options.caseSensitive = !options.caseSensitive" />
      <CheckBox
label="ignoreJoiners" tooltip="Whether to search case sensitive" :is-checked="options.ignoreJoiners"
        @update:is-checked="options.ignoreJoiners = !options.ignoreJoiners" />

      <div class="block my-1">
        <div class="inline-block text-lg text-slate-800 dark:text-slate-400">
          accuracy:
        </div>
        <select
id="accuracy"
          v-model="options.accuracy"
          class="text-slate-500 border-2 rounded-full focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-white focus:ring-opacity-0">
          <option disabled>Default: partially</option>
          <option> partially</option>
          <option>complementary</option>
          <option>exactly</option>
        </select>
        <ModalAboutAccuracyOption />
      </div>

      <div class="block my-1">
        <div class="inline-block text-lg text-slate-800 dark:text-slate-400">
          wildcards:
        </div>
        <select
id="wildcards"
          v-model="options.wildcards"
          class="text-slate-500 border-2 rounded-full focus:ring-0 focus:ring-offset-0 focus:ring-offset-transparent focus:ring-white focus:ring-opacity-0">
          <option disabled>Default: disabled</option>
          <option>disabled</option>
          <option>enabled</option>
          <option>withSpaces</option>
        </select>
        <ModalAboutWildcardsOption />
      </div>
    </div>

    <hr class="my-3 h-px border-0 bg-gray-300" />

    <div class="flex justify-center mb-3 text-lg dark:text-slate-400">
      <button
class="rounded-full border-solid border-2 px-2 text-slate-800 dark:text-slate-400"
        @click="resetDefaultOptions"> reset to
        default</button>
    </div>

    <div class="justify-center text-slate-500">
      <a href="https://markjs.io/#:~:text=div.test%22).-,4.2%20mark(),-A%20method%20to" target="_blank" class="underline">
        <icon-help-circle class="inline-block mx-1 text-slate-400 text-sm" />
        Detail information about option
      </a>
    </div>

    <FeatureRequestBugReport />

    <div class="flex justify-center underline m-5 text-slate-500">
      <button class="underline" @click="$router.back">Go Back</button>
    </div>
  </div>

  <footer class="flex justify-center text-slate-500">
    This extension is made by&nbsp; <RouterLink to="/about" class="underline"> ut0s
    </RouterLink>.
  </footer>
</template>

<style scoped></style>
