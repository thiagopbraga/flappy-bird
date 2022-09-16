console.log('[ThiagoBraga] Flappy Bird');
let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

// [Background] 
const planoDeFundo = {
    spriteX : 390,
    spriteY : 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height -204,
    desenha() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, // Sprite x, Sprite y
            planoDeFundo.largura, planoDeFundo.altura, // tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
        contexto.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY, // Sprite x, Sprite y
            planoDeFundo.largura, planoDeFundo.altura, // tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

// [Chão]
function criaChao() {
    const chao = {
        spriteX : 0,
        spriteY : 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height -112,
        atualiza() {
            const movimentoChao = 1;
            const repeteEm = chao.largura / 2;
            chao.x = chao.x - movimentoChao;
            if(chao.x <= -repeteEm) {
                chao.x = 0;
            }
        },
        desenha() {
            contexto.drawImage(
              sprites,
              chao.spriteX, chao.spriteY,
              chao.largura, chao.altura,
              chao.x, chao.y,
              chao.largura, chao.altura,
            );
        
            contexto.drawImage(
              sprites,
              chao.spriteX, chao.spriteY,
              chao.largura, chao.altura,
              (chao.x + chao.largura), chao.y,
              chao.largura, chao.altura,
            );
          },
        };
        return chao;
}

function fazColizao( flappyBird, chao ) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    if(flappyBirdY >= chaoY) {
        return true;
    }
    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX : 0,
        spriteY : 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        pulo: 5,
        pula() {
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.25,
        velocidade: 0,
        atualiza() {
            if(fazColizao(flappyBird, globais.chao)) {
                console.log('Fez colizão');
                som_HIT.play(); // som de colisão (soco do Ryu)
                mudaParaTela(Telas.INICIO);
                return;
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 0, spriteY: 0, }, // asa para cima
            { spriteX: 0, spriteY: 26, }, // asa no meio
            { spriteX: 0, spriteY: 52, }, // asa para baixo
            
        ],
        frameAtual:0,
        atualizaOFrameAtual() {
            const intervaloFrame = 10;
            const passouIntervalo = frames % intervaloFrame === 0;

            if(passouIntervalo){
                const baseIncremento = 1;
                const incremento = baseIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },
        desenha() {
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites,
                spriteX, spriteY, // Sprite x, Sprite y
                flappyBird.largura, flappyBird.altura, // tamanho do recorte na sprite
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        }
    }
    return flappyBird;    
}


// mensagem de início
const mensagemInicio = {
    sX: 134,
    sY: 0,
    w: 174,
    h: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemInicio.sX, mensagemInicio.sY,
            mensagemInicio.w, mensagemInicio.h,
            mensagemInicio.x, mensagemInicio.y,
            mensagemInicio.w, mensagemInicio.h,
        );
    }
}

/**
 * Telas
 */
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if(telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
        },
        desenha() {
            planoDeFundo.desenha(); // desenha primeiro o plano de fundo
            globais.chao.desenha(); 
            globais.flappyBird.desenha(); // desenha o pássaro por cima do plano de fundo
            mensagemInicio.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha(); // desenha primeiro o plano de fundo
        globais.chao.desenha(); 
        globais.flappyBird.desenha(); // desenha o pássaro por cima do plano de fundo
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.flappyBird.atualiza(); // atualiza o pássaro
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    
    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
    if( telaAtiva.click ) {
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop()