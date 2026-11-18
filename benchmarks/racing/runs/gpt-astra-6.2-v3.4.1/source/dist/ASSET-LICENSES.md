# Créditos e licenças

## Arte original

Os dois carros, rodas, aerofólios, carrocerias, pinturas, números, marcas fictícias, circuito, cidade, ponte, pinheiros, palmeiras e composição da paisagem foram modelados ou construídos para este projeto. O asfalto e o terreno combinam materiais fotográficos com variações próprias. A interface usa fontes disponíveis no sistema.

## Fotografia, materiais e vegetação

Os HDRIs, materiais PBR e levantamentos fotográficos abaixo são distribuídos como CC0 pelo Poly Haven. A preparação local reduz as malhas de rocha e vegetação e renderiza as copas em camadas. [Licença dos assets do Poly Haven](https://polyhaven.com/license).

- [asphalt 04](https://polyhaven.com/a/asphalt_04)
- [coast sand 01](https://polyhaven.com/a/coast_sand_01)
- [brown mud dry](https://polyhaven.com/a/brown_mud_dry)
- [coast sand rocks 02](https://polyhaven.com/a/coast_sand_rocks_02)
- [kloppenheim 06 puresky](https://polyhaven.com/a/kloppenheim_06_puresky)
- [kloppenheim 06](https://polyhaven.com/a/kloppenheim_06)
- [leafy grass](https://polyhaven.com/a/leafy_grass)
- [coast rocks 03](https://polyhaven.com/a/coast_rocks_03)
- [coastal cliff 02](https://polyhaven.com/a/coastal_cliff_02)
- [shrub 02](https://polyhaven.com/a/shrub_02)
- [grass medium 02](https://polyhaven.com/a/grass_medium_02)
- [pine tree 01](https://polyhaven.com/a/pine_tree_01)
- [jacaranda tree](https://polyhaven.com/a/jacaranda_tree)
- [palm bark](https://polyhaven.com/a/palm_bark)
- [seaworn sandstone brick](https://polyhaven.com/a/seaworn_sandstone_brick)
- [island tree 01](https://polyhaven.com/a/island_tree_01)
- [island tree 02](https://polyhaven.com/a/island_tree_02)

## Gravações de campo e motores

Todos os arquivos abaixo usam o áudio da prévia de alta qualidade disponibilizada pelo próprio Freesound. A página de cada som foi conferida individualmente para CC0. Os dois conjuntos de GiocoSound são gravações de microfones posicionados dentro e fora do mesmo veículo. O jogo ajusta a mistura de carga e alívio, rotação e filtragem para cada carro. Os arquivos originais comprimidos ficam no pacote. O navegador prepara os loops e suaviza a emenda ao decodificá-los.

| Arquivo | Autor | Licença e gravação |
|---|---|---|
| ext-idle.mp3 | GiocoSound | [CC0 · 401552](https://freesound.org/people/GiocoSound/sounds/401552/) |
| ext-low.mp3 | GiocoSound | [CC0 · 401556](https://freesound.org/people/GiocoSound/sounds/401556/) |
| ext-mid.mp3 | GiocoSound | [CC0 · 401555](https://freesound.org/people/GiocoSound/sounds/401555/) |
| ext-high.mp3 | GiocoSound | [CC0 · 401551](https://freesound.org/people/GiocoSound/sounds/401551/) |
| int-idle.mp3 | GiocoSound | [CC0 · 401550](https://freesound.org/people/GiocoSound/sounds/401550/) |
| int-low.mp3 | GiocoSound | [CC0 · 401548](https://freesound.org/people/GiocoSound/sounds/401548/) |
| int-mid.mp3 | GiocoSound | [CC0 · 401547](https://freesound.org/people/GiocoSound/sounds/401547/) |
| int-high.mp3 | GiocoSound | [CC0 · 401549](https://freesound.org/people/GiocoSound/sounds/401549/) |
| tyre.mp3 | audible-edge | [CC0 · 71736](https://freesound.org/people/audible-edge/sounds/71736/) |
| gravel.mp3 | seth-m | [CC0 · 341069](https://freesound.org/people/seth-m/sounds/341069/) |
| impact.mp3 | newagesoup | [CC0 · 337833](https://freesound.org/people/newagesoup/sounds/337833/) |
| surf.mp3 | bassimat | [CC0 · 861755](https://freesound.org/people/bassimat/sounds/861755/) |
| town.mp3 | Vital_Sounds | [CC0 · 534479](https://freesound.org/people/Vital_Sounds/sounds/534479/) |
| forest.mp3 | SamuelGremaud | [CC0 · 543957](https://freesound.org/people/SamuelGremaud/sounds/543957/) |

O sopro de vento e os sinais da interface e do sino são sintetizados localmente. Outros sons de contato utilizam as gravações listadas.

## Referências de comparação

As 14 imagens do pacote Racing-bench pertencem aos titulares indicados no enunciado, Microsoft e Playground Games. São insumos de verificação. O site estático distribuído contém a arte do jogo. As cópias utilizadas pelo verificador ficam em tools/references e as comparações, em verification/compare.

## Bibliotecas

O pacote de execução incorpora Three.js 0.180.0, os utilitários oficiais importados dessa distribuição, Delaunator 5.0.1 e a dependência robust-predicates. As licenças abaixo acompanham o bundle. Playwright (Apache-2.0), esbuild (MIT) e sharp (Apache-2.0) são dependências de desenvolvimento.

### three

```text
The MIT License

Copyright © 2010-2025 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

### delaunator

```text
ISC License

Copyright (c) 2021, Mapbox

Permission to use, copy, modify, and/or distribute this software for any purpose
with or without fee is hereby granted, provided that the above copyright notice
and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.
```

### robust-predicates

```text
This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org>
```
