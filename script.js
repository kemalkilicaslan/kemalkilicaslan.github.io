document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const languageLinks = document.querySelectorAll('[data-lang]');
    const body = document.body;
    const languageDropdown = document.getElementById("languageDropdown");
    const selectedLang = document.getElementById("selectedLang");

    const browserLang = navigator.language || navigator.userLanguage;

    let initialLang = localStorage.getItem('language') || mapBrowserLangToJSONLang(browserLang);
    
    setLanguage(initialLang);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
    } else {
        body.classList.add('light-theme');
    }

    themeToggleButton.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    languageLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const lang = link.getAttribute('data-lang');
            const flag = link.getAttribute('data-flag');
            localStorage.setItem('language', lang);
            setLanguage(lang);
            selectedLang.textContent = flag;
        });
    });

    function setLanguage(lang) {
        fetch(`assets/lang/${lang}.json`)
            .then(response => response.json())
            .then(translations => {
                document.querySelectorAll('[data-key]').forEach(element => {
                    const key = element.getAttribute('data-key');
                    if (translations[key]) {
                        element.textContent = translations[key];
                    }
                });
            });
    }

    const initialFlag = document.querySelector(`[data-lang="${initialLang}"]`)?.getAttribute('data-flag');
    if (initialFlag) {
        selectedLang.textContent = initialFlag;
    }

    languageDropdown.addEventListener("click", function (e) {
        const target = e.target.closest('.dropdown-item');
        if (target) {
            const flag = target.getAttribute("data-flag");
            selectedLang.textContent = flag;
        }
    });

    function mapBrowserLangToJSONLang(browserLang) {
        switch (browserLang) {
            case 'ar':
            case 'ar-SA':
                return 'العربية';
            case 'de':
            case 'de-DE':
                return 'Deutsch';
            case 'nl':
            case 'nl-NL':
                return 'Dutch';
            case 'en':
            case 'en-US':
            case 'en-GB':
                return 'English';
            case 'es':
            case 'es-ES':
                return 'Español';
            case 'it':
            case 'it-IT':
                return 'Italiano';
            case 'pt-BR':
                return 'Brasil';
            case 'pt':
            case 'pt-PT':
                return 'Português';
            case 'ru':
            case 'ru-RU':
                return 'Русский';
            case 'tr':
            case 'tr-TR':
                return 'Türkçe';
            case 'ja':
            case 'ja-JP':
                return '日本語';
            default:
                return 'English';
        }
    }

    // Copy to clipboard functionality for code blocks
    addCopyButtonsToCodeBlocks();
});

// Copy to clipboard functionality for code blocks
function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.readme-content pre');
    
    codeBlocks.forEach((pre) => {
        // Eğer zaten buton eklenmişse, tekrar ekleme
        if (pre.querySelector('.copy-button')) return;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.setAttribute('aria-label', 'Copy to clipboard');
        
        // Copy icon SVG
        const copyIconSVG = `
            <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
                <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
            </svg>
        `;
        
        // Check icon SVG (for copied state)
        const checkIconSVG = `
            <svg viewBox="0 0 16 16" aria-hidden="true">
                <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"></path>
            </svg>
            <span>Copied</span>
        `;
        
        copyButton.innerHTML = copyIconSVG;
        
        copyButton.addEventListener('click', async () => {
            const code = pre.querySelector('code');
            const text = code ? code.textContent : pre.textContent;
            
            try {
                await navigator.clipboard.writeText(text);
                
                // Show success state
                copyButton.innerHTML = checkIconSVG;
                copyButton.classList.add('copied');
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    copyButton.innerHTML = copyIconSVG;
                    copyButton.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                // Fallback method for older browsers
                fallbackCopyTextToClipboard(text, copyButton, copyIconSVG, checkIconSVG);
            }
        });
        
        pre.appendChild(copyButton);
    });
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text, button, copyIcon, checkIcon) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        button.innerHTML = checkIcon;
        button.classList.add('copied');
        
        setTimeout(() => {
            button.innerHTML = copyIcon;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Fallback: Could not copy text: ', err);
    }
    
    document.body.removeChild(textArea);
}