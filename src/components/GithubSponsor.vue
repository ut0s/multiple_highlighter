<script setup lang="ts">
import IconGithub from '~icons/mdi/github'
import IconLogosGithub from '~icons/logos/github'
</script>

<template>
  <div class="block">
    <a target="_blank" href="https://github.com/sponsors/ut0s">
      <button
        class="flex flex-row items-center p-2 rounded-full border-slate-100 border shadow-md dark:border-slate-400 dark:shadow-slate-400">
        <div class="flex w-2"></div>
        <span class="flex animate-bounce">
          <icon-github class="text-2xl dark:text-slate-400" />
        </span>
        <div class="flex w-2"></div>
        <icon-logos-github class="flex text-5xl h-8" />
        <div class="flex w-1"></div>
        <span class="flex text-lg font-black font-Quicksand dark:text-slate-400">
          Sponsor
        </span>
        <div class="flex w-2"></div>
      </button>
    </a>
  </div>
</template>