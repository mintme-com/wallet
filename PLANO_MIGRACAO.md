# Plano de migração para Vite e Electron

## Objetivo

Concluir a migração iniciada na branch `mintme-integration`, fazendo a carteira legada compilar e iniciar com Vite e Electron atualizados, sem misturar essa etapa com uma reescrita das funcionalidades da aplicação.

## Diagnóstico inicial

- O processo principal do Electron já possuía uma configuração inicial, mas o renderer ainda não gerava um build completo.
- As atualizações de React, Redux, Redux Saga e outras bibliotecas introduziram centenas de incompatibilidades com o código legado.
- Havia imports cujos pacotes foram removidos do `package.json`.
- O AppImage existente foi gerado antes das últimas alterações e não representa o estado final do código.

## Estratégia

Separar a migração do build da modernização das bibliotecas. Foi restaurada a compatibilidade do código legado; atualizações maiores de React, Redux e Redux Saga ficam para trabalhos posteriores e independentes.

## Etapas

- [x] 1. Preservar o trabalho existente em uma branch própria e registrar este plano em um commit isolado.
- [x] 2. Revisar as dependências e restaurar os pacotes e tipagens exigidos pelo código atual, evitando atualizações de API que ainda não foram migradas.
- [x] 3. Ajustar a configuração do Vite para resolver aliases, variáveis de ambiente, Sass, CommonJS, polyfills, workers e assets usados pela aplicação.
- [x] 4. Fazer o build do renderer passar e restaurar a verificação TypeScript, mantendo registradas as pendências legadas fora do escopo.
- [x] 5. Ajustar a inicialização do Electron para desenvolvimento e produção, mantendo logs úteis sem deixar recursos de depuração habilitados na distribuição.
- [x] 6. Validar a aplicação no navegador/Electron e executar testes de fumaça das telas principais e da abertura da carteira, sem transmitir transações.
- [x] 7. Gerar e inspecionar os artefatos Linux a partir do código corrigido.
- [x] 8. Atualizar a documentação de desenvolvimento e build, revisar os arquivos gerados e criar o commit final.

## Resultado da validação

- `yarn build`: build web concluído, com assets absolutos compatíveis com `BrowserRouter`.
- `yarn build --mode electron`: renderer, processo principal e preload concluídos.
- `yarn dev:electron`: aplicação iniciada em desenvolvimento sem exceções da migração; permanecem avisos legados de Sass, rotas e React Hot Loader.
- `yarn electron-builder --linux dir`: empacotamento Linux desempacotado concluído.
- Executável final: `release/linux-unpacked/mintmecoinwallet`.
- SHA-256 do executável validado: `ee99780b5878638df40bf577cfcdbc3c157b0b3581ada099a13db446f1af84d8`.
- Teste de fumaça do executável: rotas de conta, geração, contratos, assinatura, status de transação, ENS e ajuda renderizadas; CSP de produção ativa; IPC disponível pelo preload; nenhuma exceção ou erro de console.
- Abertura de carteira validada em modo somente leitura com o endereço público de queima `0x000000000000000000000000000000000000dEaD`, chegando a `#/account/info`. Nenhuma chave privada real foi utilizada e nenhuma transação foi assinada ou transmitida.
- Testes Jest: 44 de 52 suites e 694 de 711 testes aprovados. As 17 falhas restantes pertencem a expectations legadas de ETH/tema, um snapshot antigo, fluxos de saga anteriores a esta migração e um teste de Analytics que depende de rede.
- `yarn tscheck`: volta a analisar o projeto, mas ainda encontra 51 erros legados, principalmente imports não usados, Moment, Redux e o antigo diretório `electron-app`. Esta limpeza não foi misturada com a migração.
- Um AppImage intermediário também foi gerado e aberto durante a validação. O artefato final desta etapa é o executável desempacotado; builds e releases permanecem fora do Git.

## Ambiente

- Node 24 LTS é o padrão em `.nvmrc`; Node 22 LTS também é aceito.
- Node 26 está temporariamente excluído porque o `extract-zip` usado pelo instalador do Electron 33 não extraiu corretamente o binário nesse ambiente.
- O módulo opcional `scrypt@6.0.3` também falha ao compilar no Node 26. O `electron-builder` registra a falha e conclui usando os demais módulos nativos reconstruídos; Node 22/24 deve ser usado para uma instalação reproduzível sem esse problema específico.

## Critérios de conclusão

- Instalação de dependências reproduzível pelo Yarn em Node 22/24.
- Build do renderer e empacotamento Linux concluídos sem erro fatal.
- Aplicação iniciando em desenvolvimento e a partir do pacote de produção.
- Telas principais renderizando sem erros não tratados no console.
- Documentação compatível com os comandos realmente disponíveis.
- Nenhuma credencial, chave privada ou transação real utilizada nos testes.
