console.log('[ThiagoBraga] Flappy Bird');

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
const chao = {
    spriteX : 0,
    spriteY : 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height -112,
    desenha() {
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, // Sprite x, Sprite y
            chao.largura, chao.altura, // tamanho do recorte na sprite
            chao.x, chao.y,
            chao.largura, chao.altura,
        );
        contexto.drawImage(
            sprites,
            chao.spriteX, chao.spriteY, // Sprite x, Sprite y
            chao.largura, chao.altura, // tamanho do recorte na sprite
            (chao.x + chao.largura), chao.y,
            chao.largura, chao.altura,
        );
    }
}

const flappyBird = {
    spriteX : 0,
    spriteY : 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    velocidade: 0,
    gravidade: 0.25,
    atualiza() {
        flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
        
        // Atualiza o nosso flappy bird
        flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    pula() {
        flappyBird.velocidade = -5;
    },
    desenha() {
        contexto.drawImage(
            sprites,
            flappyBird.spriteX, flappyBird.spriteY, // Sprite x, Sprite y
            flappyBird.largura, flappyBird.altura, // tamanho do recorte na sprite
            flappyBird.x, flappyBird.y,
            flappyBird.largura, flappyBird.altura,
        );
    }
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

let telaAtiva = {};

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
}

const Telas = {
    INICIO: {
        desenha() {
            planoDeFundo.desenha(); // desenha primeiro o plano de fundo
            chao.desenha(); 
            flappyBird.desenha(); // desenha o pássaro por cima do plano de fundo
            mensagemInicio.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {

        }
    }
};

Telas.JOGO = {
    desenha() {
        planoDeFundo.desenha(); // desenha primeiro o plano de fundo
        chao.desenha(); 
        flappyBird.desenha(); // desenha o pássaro por cima do plano de fundo
    },
    click() {
        flappyBird.pula();
    },
    atualiza() {
        flappyBird.atualiza(); // atualiza o pássaro
    }
};

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();
    
    requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
    if( telaAtiva.click ) {
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop()