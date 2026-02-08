<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <div style="text-align: center; font-family: sans-serif; margin-top: 50px;">
    <h1>💚 Hello Vue 3!</h1>
    <button @click="count++">Count is: {{ count }}</button>
  </div>
</template>