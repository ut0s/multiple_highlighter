<script setup lang="ts">
import { ref } from 'vue'
import IconHelpCircle from '~icons/mdi/help-circle'
import IconCloseCircle from '~icons/mdi/close-circle'

const isOpen = ref(false);
</script>

<template>
  <icon-help-circle class="inline-block mx-1 text-slate-400 text-sm" @click="isOpen = true" />
  <div class="container mx-auto">
    <div class="flex justify-center">
      <div v-show="isOpen" class="
          absolute
          inset-0
          flex
          items-center
          justify-center
          bg-gray-700 bg-opacity-50
        ">
        <div class="max-w-2xl p-6 bg-white rounded-md shadow-xl dark:bg-slate-800">
          <div class="flex flex-row">
            <h3
              class="flex text-lg font-bold underline decoration-[0.5rem] decoration-green-300 pb-6 text-slate-800 dark:text-slate-400">
              About wildcards option:
            </h3>
            <div class="flex-grow"></div>
            <icon-close-circle class="flex text-3xl text-slate-400" @click="isOpen = false" />
          </div>
          <div class="mt-4 text-sm dark:text-slate-400">
            <span>Set to any of the following string values:</span>
            <div class="bg-slate-200 dark:bg-slate-700">
              <li class="mt-2">"disabled": </li>
              <ul class="">
                <li>Disable wildcard usage</li>
              </ul>
            </div>
            <div class="bg-slate-200 dark:bg-slate-700">
              <li class="mt-2">"enabled": </li>
              <ul class="">
                <li>When searching for "lor?m", the "?" will match zero or one non-space character (e.g.
                  "lorm", "loram", "lor3m", etc). When searching for "lor*m", the "*" will match zero or more non-space
                  characters (e.g. "lorm", "loram", "lor123m", etc).</li>
              </ul>
            </div>
            <div class="bg-slate-200 dark:bg-slate-700">
              <li class="mt-2">"withSpaces": </li>
              <ul class="">
                <li>When searching for "lor?m", the "?" will match zero or one space or non-space character
                  (e.g. "lor m", "loram", etc). When searching for "lor*m", the "*" will match zero or more space or
                  non-space characters (e.g. "lorm", "lore et dolor ipsum", "lor: m", etc).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
