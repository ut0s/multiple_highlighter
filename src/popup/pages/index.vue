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

    <div v-for="(highlight, index) in highlights" :key="index" class="flex justify-center">
      <input v-model="highlights[index]" type="search" placeholder="highlight text" />
      <div v-if="index != 0" class="flex justify-center">
        <button class="border" @click="highlights.splice(index, 1)">REMOVE THIS</button>
      </div>
    </div>

    <div class="flex justify-center">
      <button class="border" @click="highlights.push('')">ADD</button>
    </div>
    <div class="flex justify-center">
      <button class="border" @click="highlights = ['']">CLEAR</button>
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
