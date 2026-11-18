# Costa Dourada

Jogo de corrida 3D para navegador desktop. O circuito de Santa Lume tem 2,97 km e passa pela orla, falésia, vila e bosque. O jogador escolhe o Vela GT ou o Bruma RS, uma das seis pinturas e disputa três ou seis voltas com cinco adversários.

## Jogar

Na pasta do projeto, use Node.js 22 ou superior e npm para instalar as dependências e abrir o servidor local.

```sh
npm ci
npm start
```

Abra [a pista no navegador](http://127.0.0.1:4173). O pacote já contém o JavaScript compilado, os materiais, o céu e as gravações. Um servidor HTTP estático também pode servir a pasta que contém o index.html. O jogo funciona offline após o carregamento local. O som é liberado ao entrar na garagem.

| Ação | Teclado | Gamepad padrão |
|---|---|---|
| Acelerar | W ou ↑ | Gatilho direito |
| Frear | S ou ↓ | Gatilho esquerdo |
| Esterçar | A/D ou ←/→ | Analógico esquerdo |
| Alternar perseguição e capô | C | Y / Triângulo |
| Pausar ou continuar | Esc ou P | Menu / Start |
| Navegar nos menus | Setas, Tab e Enter | Direcional e A / Cruz |

## Construir e verificar

```sh
npm run build
npm run dist
npm run verify
```

O diretório `dist` contém o site estático, com `index.html` na raiz. A distribuição desta versão ocupa 55,85 MiB em 99 arquivos. Para jogar a partir dela, basta servir a pasta por HTTP. O verificador reconstrói o JavaScript, inicia um servidor local e abre o Chromium pelo Playwright. Procura o Chromium do Playwright, o Chrome ou o Edge já instalados. Se nenhum estiver disponível, tenta instalar o Chromium no primeiro uso. A instalação das dependências em uma máquina limpa requer acesso à rede. Durante o jogo, as requisições ficam no servidor local.

A verificação grava uma volta inteira em tempo real, dois percursos adicionais, screenshots de 1920 × 1080, áudio estéreo, histogramas e uma miniatura a cada 25 m em cada preset. Reserve alguns minutos. [Relatório e medições por captura](verification/REPORT.md) · [Histórico dos portões](verification/GATES.md) · [Créditos e licenças](ASSET-LICENSES.md).

## Projeto

- track.json define a spline fechada, larguras, inclinações, zonas e o intervalo da ponte.
- src/track.js constrói a malha e o heightfield triangulado. Os apoios dos objetos consultam esse mesmo terreno.
- A física de todos os veículos roda a 120 Hz. Os testes de percurso aceleram o relógio da simulação. O vídeo e o WAV usam o relógio real do navegador.
- tools/references contém os JPGs fornecidos para comparação. O empacotamento do site seleciona apenas os recursos necessários ao jogo.

## Hardware, desempenho e limites

O Chromium 150.0.7871.127 usou a GeForce RTX 3070 Ti com um Ryzen 7 5700G em Windows. A medição usou saída de 1920 × 1080, seis carros na vila e 180 quadros por preset após o aquecimento.

| Qualidade | FPS médio | 1% low |
|---|---:|---:|
| Alta | 82,8 | 62,1 |
| Baixa | 76,5 | 62,7 |

Os resultados cobrem a GPU dedicada dessa máquina. As metas específicas para RTX 3060 e GPU integrada continuam sem medição direta. Na praia, a espuma é rasa e algumas ondas têm espaçamento regular. No bosque, repetem-se alguns contornos das copas e há faixas claras de solo entre o asfalto e os primeiros arbustos. A comparação da vila mostra reboco com pouco desgaste e poucos objetos nas travessas. [Relatório com tempos individuais, capturas e áudio](verification/REPORT.md).
