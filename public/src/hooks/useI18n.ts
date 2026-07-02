import { useCallback } from 'react'
import i18n from '../i18n/config'

interface UseI18nReturn {
  t: (key: string, defaultValue?: string) => string
  currentLanguage: 'en' | 'ar'
  toggleLanguage: () => void
}

export const useI18n = (): UseI18nReturn => {
  const currentLanguage = (localStorage.getItem('language') || 'en') as 'en' | 'ar'
  
  const t = useCallback((key: string, defaultValue?: string): string => {
    const keys = key.split('.')
    let result: any = i18n[currentLanguage]
    
    for (const k of keys) {
      if (result[k]) {
        result = result[k]
      } else {
        return defaultValue || key
      }
    }
    
    return typeof result === 'string' ? result : key
  }, [currentLanguage])
  
  const toggleLanguage = useCallback(() => {
    const newLang = currentLanguage === 'en' ? 'ar' : 'en'
    localStorage.setItem('language', newLang)
    document.documentElement.lang = newLang
    document.body.setAttribute('lang', newLang)
    window.location.reload()
  }, [currentLanguage])
  
  return {
    t,
    currentLanguage,
    toggleLanguage,
  }
}
