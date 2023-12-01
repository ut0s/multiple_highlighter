<script setup lang="ts">
// chrome.identity.launchWebAuthFlow(
//   {
//     interactive: true,
//     url:
//       `https://github.com/login/oauth/authorize` +
//       `?client_id=55e294602d71eb006dc505540cf0614d6b3c7f35` +
//       `&redirect_uri=https://ekgmcbpgglflmgcfajnglpbcbdccnnje.chromiumapp.org/github_cb` +
//       `&scope=user.email`,
//   },
//   (a) => {
//     console.log(a)
//   }
// )

// v-medel for input text
const highlight = ref(''); // v-model


// watch highlight value change and send messae to content script
watch(highlight, (value) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { highlight: value });
  });
  console.log('highlight', value);
});
</script>

<template>
  <div class="text-center m-4">
    <h2 class="text-3xl font-bold underline pb-6">Multiple Highlighter</h2>

    <div class="flex justify-center">
      <input v-model="highlight" type="search" placeholder="highlight text" />
    </div>
    <p>bind text is: {{ highlight }}</p>
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
