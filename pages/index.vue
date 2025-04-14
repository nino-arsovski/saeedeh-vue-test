<template>
  <div>
    <div class="flex flex-col md:flex-row justify-between gap-[70px] mb-[70px]">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search for a country..."
          class="w-full md:w-96 p-4 pl-12 rounded shadow-md bg-[var(--color-elements)]"
        />
        <FontAwesomeIcon
          icon="search"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--color-input)]"
        />
      </div>
      <div class="flex gap-[70px]">
        <select
          v-model="selectedRegion"
          class="p-4 rounded shadow-md bg-[var(--color-elements)]"
        >
          <option value="">Filter by Region</option>
          <option v-for="region in regions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
        <select
          v-model="sortBy"
          class="p-4 rounded shadow-md bg-[var(--color-elements)]"
        >
          <option value="">Sort by</option>
          <option value="name">Name</option>
          <option value="population">Population</option>
        </select>
        <button
          @click="toggleSortOrder"
          class="p-4 rounded shadow-md bg-[var(--color-elements)]"
        >
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-8">Loading...</div>
    <div v-else-if="error" class="text-center py-8 text-red-500">{{ error }}</div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[70px]">
      <NuxtLink
        v-for="country in sortedCountries"
        :key="country.name.common"
        :to="`/country/${country.name.common}`"
        class="bg-[var(--color-elements)] rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
      >
        <div class="aspect-[4/3] overflow-hidden">
          <img
            :src="country.flags.png"
            :alt="country.flags.alt"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div class="p-6 space-y-[70px]">
          <h2 class="text-xl font-bold">{{ country.name.common }}</h2>
          <div class="space-y-2">
            <p><strong>Population:</strong> {{ country.population.toLocaleString() }}</p>
            <p><strong>Region:</strong> {{ country.region }}</p>
            <p><strong>Capital:</strong> {{ country.capital?.[0] }}</p>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useCountriesStore()
const route = useRoute()
const router = useRouter()

const { countries, loading, error } = storeToRefs(store)
const searchQuery = ref('')
const selectedRegion = ref('')
const sortBy = ref('')
const sortOrder = ref<'asc' | 'desc'>('asc')

// Sync URL with filters and sorting
watchEffect(() => {
  const query: Record<string, string> = {}
  if (searchQuery.value) query.search = searchQuery.value
  if (selectedRegion.value) query.region = selectedRegion.value
  if (sortBy.value) query.sort = sortBy.value
  if (sortOrder.value) query.order = sortOrder.value
  router.replace({ query })
})

// Initialize filters and sorting from URL
onMounted(() => {
  const { search, region, sort, order } = route.query
  if (search) searchQuery.value = search as string
  if (region) selectedRegion.value = region as string
  if (sort) sortBy.value = sort as string
  if (order) sortOrder.value = order as 'asc' | 'desc'
})

const regions = computed(() => {
  return [...new Set(countries.value.map(country => country.region))].sort()
})

const filteredCountries = computed(() => {
  let filtered = store.searchCountries(searchQuery.value)
  if (selectedRegion.value) {
    filtered = filtered.filter(country => country.region === selectedRegion.value)
  }
  return filtered
})

const sortedCountries = computed(() => {
  if (!sortBy.value) return filteredCountries.value

  return [...filteredCountries.value].sort((a, b) => {
    let comparison = 0
    if (sortBy.value === 'name') {
      comparison = a.name.common.localeCompare(b.name.common)
    } else if (sortBy.value === 'population') {
      comparison = a.population - b.population
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

// Server-side data fetching
await store.fetchCountries()
</script>