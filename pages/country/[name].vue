<template>
  <div>
    <button @click="router.back()" class="mb-[70px] px-6 py-2 bg-[var(--color-elements)] shadow-md rounded">
      ← Back
    </button>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <div v-else-if="country" class="grid md:grid-cols-2 gap-[70px]">
      <div class="aspect-[4/3]">
        <img
          :src="country.flags.svg"
          :alt="country.flags.alt"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="space-y-[70px]">
        <h1 class="text-3xl font-bold">{{ country.name.common }}</h1>
        <div class="grid md:grid-cols-2 gap-[70px]">
          <div class="space-y-2">
            <p><strong>Native Name:</strong> {{ nativeName }}</p>
            <p><strong>Population:</strong> {{ country.population.toLocaleString() }}</p>
            <p><strong>Region:</strong> {{ country.region }}</p>
            <p><strong>Sub Region:</strong> {{ country.subregion }}</p>
            <p><strong>Capital:</strong> {{ country.capital?.[0] }}</p>
          </div>
          <div class="space-y-2">
            <p><strong>Top Level Domain:</strong> {{ country.tld?.[0] }}</p>
            <p><strong>Currencies:</strong> {{ currencies }}</p>
            <p><strong>Languages:</strong> {{ languages }}</p>
          </div>
        </div>
        <div v-if="country.borders?.length" class="flex flex-wrap gap-2 items-center">
          <strong >Border Countries:  </strong>
          <div class="flex flex-wrap gap-2">
            <NuxtLink
              v-for="borderCountry in borderCountries"
              :key="borderCountry.cca3"
              :to="`/country/${borderCountry.name.common}`"
              class="px-4 py-1 bg-[var(--color-elements)] shadow-md rounded"
            >
              {{ borderCountry.name.common }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const store = useCountriesStore()

const { countries } = storeToRefs(store)
const loading = ref(false)
const error = ref<string | null>(null)
const country = computed(() => {
  return countries.value.find(c => 
    c.name.common.toLowerCase() === (route.params.name as string).toLowerCase()
  )
})

const nativeName = computed(() => {
  if (!country.value?.name.nativeName) return ''
  const firstNativeName = Object.values(country.value.name.nativeName)[0]
  return firstNativeName.common
})

const currencies = computed(() => {
  if (!country.value?.currencies) return ''
  return Object.values(country.value.currencies)
    .map(currency => currency.name)
    .join(', ')
})

const languages = computed(() => {
  if (!country.value?.languages) return ''
  return Object.values(country.value.languages).join(', ')
})

const borderCountries = computed(() => {
  if (!country.value?.borders) return []
  return countries.value.filter(c => country.value?.borders?.includes(c.cca3))
})

// Ensure we have countries data
if (countries.value.length === 0) {
  await store.fetchCountries()
}
</script>