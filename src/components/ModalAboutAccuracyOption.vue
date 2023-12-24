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
        <div class="max-w-2xl p-6 bg-white rounded-md shadow-xl">
          <div class="flex flex-row">
            <h3 class="flex text-lg font-bold underline decoration-[0.5rem] decoration-green-300 pb-6 text-slate-800">
              About accuracy option:
            </h3>
            <div class="flex-grow"></div>
            <icon-close-circle class="flex text-3xl text-slate-400" @click="isOpen = false" />
          </div>
          <div class="mt-4 text-sm">
            <span> Either one of the following string values:</span>
            <div class="bg-slate-200">
              <li class="mt-2">"partially": </li>
              <ul class="">
                <li>When searching for "lor" only "lor" inside "lorem" will be marked</li>
              </ul>
            </div>
            <div class="bg-slate-200 ">
              <li class="mt-2">"complementary": </li>
              <ul class="">
                <li> When searching for "lor" the whole word "lorem" will be marked</li>
              </ul>
            </div>
            <div class="bg-slate-200 ">
              <li class="mt-2">"exactly": </li>
              <ul class="">
                <li>
                  When searching for "lor" only those exact words with a word boundary will be marked. In
                  this example nothing inside "lorem". This value is equivalent to the previous option <i>wordBoundary</i>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
