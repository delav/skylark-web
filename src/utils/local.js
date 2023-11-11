
export function setLang(lang) {
  localStorage.setItem('lang', lang)
}

export function getLang() {
  return localStorage.getItem('lang')
}
