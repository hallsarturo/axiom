'use client';

import { useEffect } from 'react';

export default function BuyMeACoffeeButton() {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js';
        script.type = 'text/javascript';
        script.setAttribute('data-name', 'bmc-button');
        script.setAttribute('data-slug', 'arturoproal');
        script.setAttribute('data-color', '#BD5FFF');
        script.setAttribute('data-emoji', '');
        script.setAttribute('data-font', 'Cookie');
        script.setAttribute('data-text', 'Buy me a coffee');
        script.setAttribute('data-outline-color', '#000000');
        script.setAttribute('data-font-color', '#ffffff');
        script.setAttribute('data-coffee-color', '#FFDD00');
        document.getElementById('bmc-btn-container')?.appendChild(script);
    }, []);

    return <div id="bmc-btn-container"></div>;
}
