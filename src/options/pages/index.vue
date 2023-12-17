<script setup lang="ts">
import IconDotsVerticalCircle from '~icons/mdi/dots-vertical-circle'
</script>

<template>
  <div class="text-center m-4 grow">
    <div class="flex justify-center">
      <div class="text-2xl text-slate-700">
        <icon-dots-vertical-circle />
      </div>
      <h1 class="text-lg font-bold underline decoration-[0.5rem] decoration-green-300 pb-6">
        Multile Highlighter - Options
      </h1>
    </div>

    <div class="flex justify-center">
      reset to default
    </div>

    <div class="flex justify-center">
      use regex
      separateWordSearch
      accuracy
      diacritics
      synonyms
      iframes
      iframesTimeout
      acrossElements
      caseSensitive
      ignoreJoiners
      ignorePunctuation
      wildcards
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
