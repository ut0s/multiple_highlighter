<template>
  <div class="m-4">
    <div class="flex justify-center">
      <div class="mx-1">
        <img src="/icons/icon.png" alt="" width="24px">
      </div>
      <h1 class="text-xl font-bold underline decoration-[0.5rem] decoration-green-300 pb-6">Multile Highlighter </h1>
    </div>

    <span>
      Unlike the regular 'Find in page' in Chome, this extension can
      <li>search for multiple words at the same time. </li>
      <li>can use regex/wildcard</li>
      <li>can change highlight color</li>
      This extension is made by <a href="https://in-da-shell.com/" target="_blank" class="underline">ut0s</a>.
    </span>

    <div class="flex justify-center underline m-5 text-slate-500">
      <button class="underline" @click="$router.back">Go Back</button>
    </div>
  </div>
  <footer class="flex justify-center bg-gray-50">
    This extension is made by&nbsp; <a href=" https://in-da-shell.com/" target="_blank" class="underline">ut0s</a>.
  </footer>
</template>

<script setup lang="ts"></script>

<style scoped></style>
