/* --- LÓGICA DE INSTALAÇÃO (PWA) ATUALIZADA --- */
let deferredPrompt;
const btnInstallFloat = document.getElementById('btn-install-float');

window.addEventListener('beforeinstallprompt', (e) => {
    // Impede o Chrome de mostrar o prompt automático
    e.preventDefault();
    // Guarda o evento para ser usado depois
    deferredPrompt = e;
    // Mostra o botão flutuante que criamos
    if(btnInstallFloat) {
        btnInstallFloat.classList.remove('hidden');
    }
});

if(btnInstallFloat) {
    btnInstallFloat.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Mostra o prompt de instalação
        deferredPrompt.prompt();
        
        // Aguarda a resposta do usuário
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('Usuário aceitou a instalação');
            btnInstallFloat.classList.add('hidden');
        }
        deferredPrompt = null;
    });
}

// Esconde o botão se o app já estiver instalado
window.addEventListener('appinstalled', () => {
    console.log('App instalado com sucesso!');
    if(btnInstallFloat) btnInstallFloat.classList.add('hidden');
});
