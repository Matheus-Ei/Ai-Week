// Accessibility utilities for the Order Management System

export const accessibilityConfig = {
  // Keyboard navigation support
  keyboardSupport: {
    enableArrowNavigation: true,
    enableTabNavigation: true,
    enableEscapeKey: true,
  },
  
  // ARIA labels and descriptions
  ariaLabels: {
    mainNavigation: 'Navegação principal',
    userMenu: 'Menu do usuário',
    searchInput: 'Campo de busca',
    filterOptions: 'Opções de filtro',
    dataTable: 'Tabela de dados',
    editButton: 'Editar item',
    deleteButton: 'Excluir item',
    saveButton: 'Salvar alterações',
    cancelButton: 'Cancelar operação',
    createButton: 'Criar novo item',
    loadingIndicator: 'Carregando dados...',
    errorMessage: 'Mensagem de erro',
    successMessage: 'Mensagem de sucesso',
  },
  
  // Screen reader announcements
  announcements: {
    itemCreated: 'Item criado com sucesso',
    itemUpdated: 'Item atualizado com sucesso',
    itemDeleted: 'Item excluído com sucesso',
    validationError: 'Erro de validação encontrado',
    networkError: 'Erro de conexão com o servidor',
    loadingComplete: 'Carregamento concluído',
  },
};

// Function to announce messages to screen readers
export const announceToScreenReader = (message) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.style.position = 'absolute';
  announcement.style.left = '-9999px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  
  document.body.appendChild(announcement);
  announcement.textContent = message;
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Focus management utilities
export const focusManagement = {
  // Store the previously focused element
  previousFocusedElement: null,
  
  // Save current focus
  saveFocus() {
    this.previousFocusedElement = document.activeElement;
  },
  
  // Restore previous focus
  restoreFocus() {
    if (this.previousFocusedElement && this.previousFocusedElement.focus) {
      this.previousFocusedElement.focus();
      this.previousFocusedElement = null;
    }
  },
  
  // Trap focus within an element
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
    
    // Focus the first element
    firstElement.focus();
  },
};

// Color contrast utilities
export const colorContrast = {
  // Check if color combination meets WCAG contrast requirements
  meetsContrastRequirement(background, foreground, level = 'AA') {
    const bgLuminance = this.getLuminance(background);
    const fgLuminance = this.getLuminance(foreground);
    
    const contrast = (Math.max(bgLuminance, fgLuminance) + 0.05) / 
                    (Math.min(bgLuminance, fgLuminance) + 0.05);
    
    const requirements = {
      'AA': 4.5,
      'AAA': 7.0,
    };
    
    return contrast >= requirements[level];
  },
  
  // Calculate relative luminance of a color
  getLuminance(color) {
    // Simplified luminance calculation
    // In a real implementation, you would parse the color and calculate properly
    return 0.5; // Placeholder
  },
};

// Responsive design utilities
export const responsiveUtils = {
  // Get current breakpoint
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 640) return 'mobile';
    if (width < 768) return 'tablet';
    if (width < 1024) return 'laptop';
    return 'desktop';
  },
  
  // Check if device is mobile
  isMobile() {
    return window.innerWidth < 768;
  },
  
  // Check if device supports touch
  supportsTouch() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },
};

export default accessibilityConfig;
