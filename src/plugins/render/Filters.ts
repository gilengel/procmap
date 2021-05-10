import Vue from 'vue'

Vue.filter('kebab', (str: string): string | string[] => {
  const replace = (s: string) => s.toLowerCase().replace(/ /g, '-')

  return Array.isArray(str) ? str.map(replace) : replace(str)
})
