import { library, config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faSearch, 
  faMoon,
  faSun
} from '@fortawesome/free-solid-svg-icons'

// This is important, we are going to let Nuxt worry about the CSS
config.autoAddCss = false

library.add(faSearch, faMoon, faSun)

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('FontAwesomeIcon', FontAwesomeIcon)
})