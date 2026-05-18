let currentLanguage = localStorage.getItem('language') || 'pt';
let translations = {};

// Carregar traduções
async function loadTranslations() {
  try {
    const response = await fetch('./translations.json');
    translations = await response.json();
    setLanguage(currentLanguage);
  } catch (error) {
    console.error('Erro ao carregar traduções:', error);
  }
}

// Definir idioma
function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Atualizar atributo lang do HTML
  document.documentElement.lang = lang;
  
  // Atualizar todos os elementos com data-i18n
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = translations[lang]?.[key];
    
    if (translation) {
      if (element.tagName === 'INPUT' && element.type === 'placeholder') {
        element.placeholder = translation;
      } else {
        element.innerHTML = translation;
      }
    }
  });
  
  // Atualizar botão de idioma ativo
  document.querySelectorAll('.language-switcher__btn').forEach(btn => {
    btn.classList.remove('language-switcher__btn--active');
  });
  document.querySelector(`[data-lang="${lang}"]`)?.classList.add('language-switcher__btn--active');
}

// Inicializar ao carregar a página
document.addEventListener('DOMContentLoaded', loadTranslations);
