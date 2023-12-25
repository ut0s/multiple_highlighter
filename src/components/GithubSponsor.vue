<script setup lang="ts">
import IconGithub from '~icons/mdi/github'
import IconLogosGithub from '~icons/logos/github'
</script>

<template>
  <div class="block">
    <a target="_blank" href="https://github.com/sponsors/ut0s">
      <button class="flex flex-row items-center rounded-3xl p-2 rounded-full border-slate-100 border shadow-md">
        <div class="flex w-2"></div>
        <span class="flex animate-bounce">
          <icon-github class="text-2xl" />
        </span>
        <div class="flex w-2"></div>
        <icon-logos-github class="flex text-5xl h-8" />
        <div class="flex w-1"></div>
        <span class="flex text-lg font-black font-Quicksand">
          Sponsor
        </span>
        <div class="flex w-2"></div>
      </button>
    </a>
  </div>
</template>


<style scoped></style>
