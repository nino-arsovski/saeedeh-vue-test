<template>
  <div class="min-h-screen">
    <header class="bg-[var(--color-elements)] shadow-md">
      <div class="container mx-auto px-4 py-6 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold">Where in the world?</NuxtLink>
        <button @click="toggleTheme" class="flex items-center gap-2">
          <FontAwesomeIcon :icon="isDark ? 'moon' : 'sun'" />
          {{ isDark ? 'Dark' : 'Light' }} Mode
        </button>
      </div>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { isDark, toggleTheme } = useTheme()
</script>