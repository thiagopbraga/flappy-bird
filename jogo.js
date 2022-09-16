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
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,
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
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza() {
            const movimentoChao = 1;
            const repeteEm = chao.largura / 2;
            chao.x = chao.x - movimentoChao;
            if (chao.x <= -repeteEm) {
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

function fazColizao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;
    if (flappyBirdY >= chaoY) {
        return true;
    }
    return false;
}

function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
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
            if (fazColizao(flappyBird, globais.chao)) {
                console.log('Fez colizão');
                som_HIT.play(); // som de colisão (soco do Ryu)
                mudaParaTela(Telas.GAMEOVER);
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
        frameAtual: 0,
        atualizaOFrameAtual() {
            const intervaloFrame = 10;
            const passouIntervalo = frames % intervaloFrame === 0;

            if (passouIntervalo) {
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

// mensagem de gameover
const mensagemGameOver = {
    sX: 134,
    sY: 153,
    w: 226,
    h: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites,
            mensagemGameOver.sX, mensagemGameOver.sY,
            mensagemGameOver.w, mensagemGameOver.h,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.w, mensagemGameOver.h,
        );
    }
}

// [Canos]
function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenha() {
            canos.pares.forEach(
                (par) => {
                    const yRandom = par.y; // valor random de 7 para subir e descer os canos
                    const espacamentoEntreCanos = 90; // espaçamento entre os canos

                    // [Cano do ceu]
                    const canoCeuX = par.x;
                    const canoCeuY = yRandom;
                    contexto.drawImage(
                        sprites,
                        canos.ceu.spriteX, canos.ceu.spriteY,
                        canos.largura, canos.altura,
                        canoCeuX, canoCeuY,
                        canos.largura, canos.altura,
                    )

                    // [Cano do chao]
                    const canoChaoX = par.x;
                    const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                    contexto.drawImage(
                        sprites,
                        canos.chao.spriteX, canos.chao.spriteY,
                        canos.largura, canos.altura,
                        canoChaoX, canoChaoY,
                        canos.largura, canos.altura,
                    ),

                        par.canoCeu = {
                            x: canoCeuX,
                            y: canos.altura + canoCeuY,
                        }
                    par.canoChao = {
                        x: canoChaoX,
                        y: canoChaoY,
                    }

                }
            )

        },
        temColisaoComOPassaro(par) {
            const cabecaDoPassaro = globais.flappyBird.y
            const peDoPassaro = globais.flappyBird.y + globais.flappyBird.altura;
            
            if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                if (cabecaDoPassaro <= par.canoCeu.y) {
                    return true;
                }

                if (peDoPassaro >= par.canoChao.y) {
                    return true;
                }
            }
            return false;
        },
        pares: [],
        atualiza() {
            const passou100frames = frames % 100 === 0;
            if (passou100frames) {
                console.log("passou100frames")
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            canos.pares.forEach((par) => {
                    par.x = par.x - 2;

                    if (canos.temColisaoComOPassaro(par)) {
                        console.log('perdeu');
                        som_HIT.play(); // som de colisão (soco do Ryu)
                        mudaParaTela(Telas.GAMEOVER);
                    }

                    if (par.x + canos.largura <= 0) {
                        canos.pares.shift()
                    }
                }
            )

        },
    }
    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        desenha() {
            contexto.font = '50px "VT323"',
                contexto.textAlign = 'right',
                contexto.fillStyle = 'white',
                contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 40)
            placar.pontuacao
        },
        atualiza() {
            const intervaloFrame = 20;
            const passouIntervalo = frames % intervaloFrame === 0;

            if (passouIntervalo) {
                placar.pontuacao = placar.pontuacao + 1;
            }
        }

    }

    return placar;
}

/**
 * Telas
 */
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
    telaAtiva = novaTela;
    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

const Telas = {
    INICIO: {
        inicializa() {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        desenha() {
            planoDeFundo.desenha(); // desenha primeiro o plano de fundo
            globais.flappyBird.desenha(); // desenha o pássaro por cima do plano de fundo
            globais.chao.desenha();
            mensagemInicio.desenha();
        },
        click() {
            mudaParaTela(Telas.JOGO);
        },
        atualiza() {
            globais.chao.atualiza();
            globais.canos.atualiza();
        }
    }
};

Telas.JOGO = {
    inicializa() {
        globais.placar = criaPlacar();
    },
    desenha() {
        planoDeFundo.desenha(); // desenha primeiro o plano de fundo
        globais.flappyBird.desenha(); // desenha o pássaro por cima do plano de fundo
        globais.canos.desenha(); // desenha canos
        globais.chao.desenha(); // desenha chao
        globais.placar.desenha(); // desenha placar
    },
    click() {
        globais.flappyBird.pula();
    },
    atualiza() {
        globais.canos.atualiza(); // atualiza o canos
        globais.chao.atualiza(); // atualiza o chao
        globais.flappyBird.atualiza(); // atualiza o pássaro
        globais.placar.atualiza(); // atualiza o placar
    }
};

Telas.GAMEOVER = {
    desenha() {
        mensagemGameOver.desenha()
    },
    atualiza() {
        
    },
    click() {
        mudaParaTela(Telas.INICIO);
    },
}

function loop() {
    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
    if (telaAtiva.click) {
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop()