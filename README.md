# Site Grupo Lopes

Site institucional do Grupo Lopes. Base fornecida no arquivo Grupo-Lopes-completo-offline.html.

## Editar e visualizar

- `index.html`: conteúdo e estrutura.
- `styles.css`: identidade visual, layout e animações.
- `script.js`: menu, apresentação das empresas, mapa e pausa da animação.
- `assets/`: imagens e fontes extraídas do material fornecido.

Abra `index.html` no navegador. Opcionalmente, execute `python -m http.server 8000` nesta pasta e acesse `http://localhost:8000`.

Para gerar a versão em arquivo único, execute `python build_offline.py`. O resultado fica em `dist/Grupo-Lopes-offline.html`. Links para sites externos e fontes remotas eventualmente disponíveis no HTML dependem de internet; o conteúdo, as imagens e a fonte Azo de base estão incorporados.

## Ajustes de 27/10/2026

- Abertura com as logos fornecidas, oscilação de -6° a +6°, logos mantidas na posição vertical, botão de pausa e respeito à preferência por movimento reduzido. Substitui o vídeo cuja rotação estava gravada.
- Cabeçalho fixo em desktop e celular.
- Página e acessos de Investidores removidos.
- História com rolagem horizontal nativa, teclado e toque; sequência cronológica preservada.
- Trial com logo colorida existente sobre fundo branco e chamada “Soluções para gestão”.
- DFS sem link e sem chamada para LinkedIn.
- Opta com foto de armazenagem já incluída no material e chamada “Soluções corporativas”.
- Texto de orientação do mapa removido; interação preservada.

A tipografia Azo do site original do Grupo foi preservada; não houve substituição global por PPMori da Distribuidora.

## Validação

Verificado no Chromium em 1440 × 1000 e 390 × 1000: ausência de erros JavaScript, imagens carregadas, ausência de transbordamento horizontal da página, cabeçalho fixo, menu móvel, rolagem da história, pausa da animação, movimento reduzido e seleção de estado pelo teclado. A versão offline também foi aberta e as seis empresas foram verificadas. Os arquivos de evidência ficam em `validation/`.

Este repositório contém os arquivos para revisão. Não configura hospedagem nem publica automaticamente um site.
