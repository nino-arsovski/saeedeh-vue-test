import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CountryCard from '../CountryCard.vue'

describe('CountryCard', () => {
  const mockCountry = {
    name: {
      common: 'Test Country',
      official: 'Official Test Country',
      nativeName: {},
    },
    population: 1000000,
    region: 'Test Region',
    capital: ['Test Capital'],
    flags: {
      png: 'test.png',
      svg: 'test.svg',
      alt: 'Test flag',
    },
  }

  it('renders country information correctly', () => {
    const wrapper = mount(CountryCard, {
      props: {
        country: mockCountry,
      },
    })

    expect(wrapper.text()).toContain('Test Country')
    expect(wrapper.text()).toContain('1,000,000')
    expect(wrapper.text()).toContain('Test Region')
    expect(wrapper.text()).toContain('Test Capital')
  })

  it('has correct image attributes', () => {
    const wrapper = mount(CountryCard, {
      props: {
        country: mockCountry,
      },
    })

    const img = wrapper.find('img')
    expect(img.attributes('src')).toBe('test.png')
    expect(img.attributes('alt')).toBe('Test flag')
  })
})