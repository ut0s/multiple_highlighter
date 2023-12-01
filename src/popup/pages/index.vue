<script setup lang="ts">
import { ref, watch } from 'vue';

// v-medel for input texts
const highlights = ref(['']); // v-model

// watch highlight array change and send message to content script
watch(highlights, (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { highlights: value });
  });
  console.log('highlight', value);
}, { deep: true });


</script>

<template>
  <div class="text-center m-4">
    <h2 class="text-3xl font-bold underline pb-6">Multiple Highlighter</h2>

    <div class="flex justify-center">
      <input v-model="highlights[0]" type="search" placeholder="highlight text" />
    </div>
    <div class="flex justify-center">
      <input v-model="highlights[1]" type="search" placeholder="highlight text" />
    </div>
    <p>bind text is: {{ highlights[0] }}</p>
    <p>bind text is: {{ highlights[1] }}</p>

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
