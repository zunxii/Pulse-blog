export const fadeInUp = (el: HTMLElement) => {
  el.style.opacity = '0'
  el.style.transform = 'translateY(30px)'
  
  setTimeout(() => {
    el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.opacity = '1'
    el.style.transform = 'translateY(0)'
  }, 100)
}

export const fadeIn = (el: HTMLElement) => {
  el.style.opacity = '0'
  
  setTimeout(() => {
    el.style.transition = 'opacity 0.6s ease-out'
    el.style.opacity = '1'
  }, 100)
}

export const scaleIn = (el: HTMLElement) => {
  el.style.opacity = '0'
  el.style.transform = 'scale(0.9)'
  
  setTimeout(() => {
    el.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
    el.style.opacity = '1'
    el.style.transform = 'scale(1)'
  }, 100)
}