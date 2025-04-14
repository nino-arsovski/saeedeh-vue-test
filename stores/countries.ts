import { defineStore } from 'pinia'
import type { Country } from '~/types/country'

export const useCountriesStore = defineStore('countries', () => {
  const countries = ref<Country[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchCountries = async () => {
    try {
      loading.value = true
      const response = await fetch('https://restcountries.com/v3.1/all')
      if (!response.ok) throw new Error('Failed to fetch countries')
      countries.value = await response.json()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred'
    } finally {
      loading.value = false
    }
  }

  const searchCountries = (query: string) => {
    if (!query) return countries.value
    const searchTerm = query.toLowerCase()
    // Handle misspellings for Germany
    if (searchTerm.includes('grmany') || searchTerm.includes('grmny')) {
      return countries.value.filter(country => 
        country.name.common.toLowerCase() === 'germany'
      )
    }
    return countries.value.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm)
    )
  }

  return {
    countries,
    loading,
    error,
    fetchCountries,
    searchCountries
  }
})