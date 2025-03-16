document.addEventListener('DOMContentLoaded', function() {
    const frame = document.querySelector('.frame');
    const topFlap = document.querySelector('.top');
    const message = document.querySelector('.message');
    const buttons = document.querySelectorAll('.round-button');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    
    let isOpen = false;
    let players = [];

    function onYouTubeIframeAPIReady() {
        createPlayer('youtube-player1', 'D7d0cHxwHlg');
        createPlayer('youtube-player2', 'D7d0cHxwHlg');
        createPlayer('youtube-player3', 'D7d0cHxwHlg');
    }
    
    function createPlayer(playerId, videoId) {
        const origin = window.location.origin === 'null' ? 'http://localhost' : window.location.origin;
        const player = new YT.Player(playerId, {
            height: '200',
            width: '100%',
            videoId: videoId,
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'showinfo': 0,
                'modestbranding': 1,
                'rel': 0,
                'enablejsapi': 1,
                'origin': origin,
                'widget_referrer': window.location.href
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
        players.push(player);
    }

    function onPlayerReady(event) {
        console.log('Player do YouTube pronto!');
    }

    function onPlayerStateChange(event) {
        console.log('Estado do player mudou:', event.data);
    }

    function onPlayerError(event) {
        console.error('Erro no player do YouTube:', event.data);
        if (event.data === 100) {
            console.error('Vídeo não autorizado para embedding. Tente outro vídeo ou verifique as restrições.');
        } else if (event.data === 2) {
            console.error('Vídeo não encontrado ou ID inválido.');
        } else if (event.data === -1) {
            console.error('Erro desconhecido no player. Verifique a conexão com www.youtube.com.');
        }
    }

    frame.addEventListener('click', function() {
        console.log(" Clique detectado!");
        if (isOpen) {
            topFlap.classList.remove('open');
            message.classList.remove('pull');
            message.classList.add('hide');
            frame.classList.remove('open');
            isOpen = false;
        } else {
            topFlap.classList.add('open');
            message.classList.remove('hide');
            message.classList.add('pull');
            frame.classList.add('open');
            isOpen = true;
            createHearts();
        }
    });

    document.body.addEventListener('click', (event) => {
        if (isOpen && !frame.contains(event.target) && !message.contains(event.target)) {
            topFlap.classList.remove('open');
            message.classList.remove('pull');
            message.classList.add('hide');
            frame.classList.remove('open');
            isOpen = false;
        }
    });

    function createHearts() {
        console.log("❤️ Criando corações...");
        const envelope = document.querySelector('.frame');
        const envelopeRect = envelope.getBoundingClientRect();
        const numberOfHearts = 25;
        for (let i = 0; i < numberOfHearts; i++) {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.textContent = ["", "❤️", "", "", "", "", ""][Math.floor(Math.random() * 7)];
            const x = Math.random() * envelopeRect.width * 0.8 + envelopeRect.left + envelopeRect.width * 0.1;
            const y = Math.random() * envelopeRect.height * 0.5 + envelopeRect.top + envelopeRect.height * 0.5;
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            document.body.appendChild(heart);
            requestAnimationFrame(() => {
                heart.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 1) * 200}px) scale(1.5)`;
                heart.style.opacity = 0;
            });
            setTimeout(() => {
                heart.remove();
            }, 2000);
        }
    }

    buttons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation();
            const target = button.getAttribute('data-target');
            const modal = document.getElementById(target);
            modals.forEach(m => m.classList.remove('show'));
            modal.classList.toggle('show');
            if (target === 'modal2' && player) {
                if (modal.classList.contains('show')) {
                    player.playVideo();
                } else {
                    player.stopVideo();
                }
            }
        });
    });
    
    modals.forEach(modal => {
        modal.addEventListener('click', (event) => {
            console.log("Clique no modal, target:", event.target);
            if (event.target === modal) {
                console.log("Clique fora do conteúdo, fechando modal");
                modal.classList.remove('show');
                if (modal.id === 'modal2' && player) {
                    player.stopVideo();
                }
            }
        });

        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.addEventListener('click', (event) => {
                console.log("Clique no modal-content, target:", event.target);
                event.stopPropagation();
            });
        }
    });

    closeButtons.forEach(closeButton => {
        closeButton.addEventListener('click', (event) => {
            console.log("Tentando fechar o modal - Clique no botão de fechar, target:", event.target);
            event.stopPropagation();
            const modal = closeButton.closest('.modal');
            if (modal) {
                console.log("Modal encontrado:", modal);
                modal.classList.remove('show');
                if (modal.id === 'modal2' && player) {
                    player.stopVideo();
                }
            } else {
                console.error("Nenhum modal encontrado para o botão de fechar!");
            }
        });
    });

    window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

    setTimeout(() => {
        if (!player) {
            console.error("O player do YouTube não foi inicializado! Verifique o carregamento da API, a conexão com www.youtube.com, ou desative bloqueadores de conteúdo.");
        }
    }, 5000);

    // Modal do GIF
    const abrirGifButton = document.getElementById('abrir-gif');
    const modalGif = document.getElementById('modal-gif');
    const fecharGifButton = document.getElementById('fechar-gif');

    abrirGifButton.addEventListener('click', function() {
        modalGif.style.display = 'block';
    });

    fecharGifButton.addEventListener('click', function() {
        modalGif.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target === modalGif) {
            modalGif.style.display = 'none';
        }
    });
});

const fotos = document.querySelectorAll('.foto-modal');
const descricaoFoto = document.querySelector('.descricao-foto');

fotos.forEach(foto => {
    foto.addEventListener('click', () => {
        const descricao = foto.getAttribute('data-descricao');
        descricaoFoto.textContent = descricao;
        descricaoFoto.style.display = 'block';
    });
});