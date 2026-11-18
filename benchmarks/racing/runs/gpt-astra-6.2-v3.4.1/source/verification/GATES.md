# Portões da Costa Dourada

## P1 · esqueleto

A volta na física de 120 Hz completou 2.969,45 m em 105,87 s. A verificação de 1.188 estações mediu 3,5 cm entre a margem e o terreno. O raio mínimo foi 27,99 m. O registro da volta contém zero eventos de integridade. Na primeira vista aérea a estrada cintilava à distância. Aumentei o plano de corte próximo da câmera de inspeção e recapturei a volta inteira, com a faixa contínua. Evidência em [p1.json](gates/p1.json) e [vista aérea](gates/p1-aerial.png).

## P2 · luz e carro

Na primeira captura, a lanterna ficava escondida pela moldura e a união do para-choque dianteiro abria uma fresta. Uni as bordas da malha, modelei as três tomadas de ar e reposicionei os emissores. A vista de três quartos permite distinguir pneu, disco, pinça, vidro e pintura. A referência tem reflexos de objetos próximos mais definidos e uma sombra mais recortada. [Carro e referência 11](gates/p2-compare-s2.jpg).

## P3 · orla

Na primeira imagem as pedras quase sumiam sob as ondas. Reposicionei os grupos segundo a cota da água, modelei rochas fechadas e ajustei a escala vertical depois de inspecionar o perfil da costa. A encosta ganhou vegetação em grupos e o horizonte ganhou dois promontórios. A espuma quebra junto da areia e das pedras. A água da referência mostra respingos verticais mais expressivos e a praia tem mais cascalho solto. A validação da fatia contou 1.189 objetos sem infração geométrica. [Reta e referências](gates/p3-compare-s1.jpg) · [Praia e referências](gates/p3-compare-s3.jpg).

## P4 · falésia, vila e bosque

O primeiro teste detectou oito casas com a margem insuficiente. Ajustei o recuo e nivelei a faixa entre as fachadas e as calçadas. O teste passou com 92 unidades e oito variações. As cinco janelas completas da vila têm 16, 15, 15, 16 e 14 frentes. No bosque, a primeira sequência de capturas mostrou grande espaço entre os troncos. Acrescentei massas arbustivas, gramíneas e grupos mais distantes. A janela da ponte contém 46 m de tabuleiro e 54 m plantáveis. As duas varreduras mostram a praça pela torre e as copas atravessando a descida. As casas de esquina têm laterais mais simples e a silhueta de algumas copas ainda revela o uso de planos. [Contagens](gates/p4-density.json) · [Alta](gates/p4-alta-sweep.jpg) · [Baixa](gates/p4-baixa-sweep.jpg).

## P5 · corrida e som

As jornadas pelo menu chegaram aos resultados de 3 e 6 voltas, com 13 ultrapassagens entre as IAs em cada corrida. A tentativa de cortar um setor rendeu zero voltas. A câmera registrou zero intrusões e a validação do mundo aceitou os 5.407 objetos posicionados. Depois de pausar, continuar e reiniciar três vezes, o grafo de áudio voltou às 21 fontes contínuas iniciais. [Jornadas e validação](race-tests.json).

O primeiro leitor do WebM interrompia a análise antes de percorrer todos os blocos de mídia do Chromium. A correção percorre os blocos e mede a duração de vídeo e áudio separadamente. A gravação final contém 105,94 s de vídeo VP9 e 105,90 s de áudio Opus. O WAV gravado após o limitador tem 106,01 s, com pico de −2,98 dBFS. [Medição independente dos arquivos](media-proof.json) · [Eventos de áudio](audio-metrics.json).

## P6 · acabamento e distribuição

Na inspeção do grid, um rival encobria a frente do carro. Reposicionei a câmera, abri a vista lateral da ponte para mostrar seus apoios e capturei a disputa quando havia um adversário de cada lado do jogador. O mapa aéreo ganhou uma projeção da spline para conferir o circuito inteiro. [Grid](compare/s2.png) · [Ponte](compare/s7.png) · [Disputa](compare/s8.png) · [Traçado](compare/s12.png).

No teste final, as 12 capturas e os 119 pontos a cada 25 m em cada preset passaram pelas métricas aplicáveis. O menor percentual de céu nas duas varreduras foi 25,2%. A inspeção visual identificou repetição em algumas copas e fachadas e pouco relevo na espuma. A medição na vila, a 1080p na RTX 3070 Ti, registrou 82,8 FPS em Alta e 76,5 em Baixa. O desempenho em GPU integrada segue em aberto. [Comparações e diferenças por captura](REPORT.md) · [Varredura em Alta](sweep-sheet.png) · [Varredura em Baixa](sweep-baixa-sheet.png).

A distribuição estática foi aberta no Chromium sem o modo de teste. Com o Bruma RS em Baixa, o teclado acelerou o carro, a pausa abriu e o menu voltou a carregar. Os 97 caminhos requisitados eram locais. [Registro do pacote estático](distribution.json).
