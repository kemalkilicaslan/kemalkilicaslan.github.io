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

    const initialFlag = document.querySelector(`[data-lang="${initialLang}"]`).getAttribute('data-flag');
    selectedLang.textContent = initialFlag;

    languageDropdown.addEventListener("click", function (e) {
        const target = e.target.closest('.dropdown-item');
        if (target) {
            const flag = target.getAttribute("data-flag");
            selectedLang.textContent = flag;
        }
    });

    function mapBrowserLangToJSONLang(browserLang) {
        switch (browserLang) {
            case 'de':
            case 'de-DE':
                return 'Deutsch';
            case 'en':
            case 'en-US':
            case 'en-GB':
                return 'English';
            case 'es':
            case 'es-ES':
                return 'Español';
            case 'tr':
            case 'tr-TR':
                return 'Türkçe';
            case 'ru':
            case 'ru-RU':
                return 'Русский';
            case 'ar':
            case 'ar-SA':
                return 'العربية';
            case 'ja':
            case 'ja-JP':
                return '日本語';
            default:
                return 'English';
        }
    }
});