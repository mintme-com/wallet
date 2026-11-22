# Plano de migração para Vite e Electron

## Objetivo

Concluir a migração iniciada na branch `mintme-integration`, fazendo a carteira legada compilar e iniciar com Vite e Electron atualizados, sem misturar essa etapa com uma reescrita das funcionalidades da aplicação.

## Diagnóstico inicial

- O processo principal do Electron já possui uma configuração inicial, mas o renderer ainda não gera um build completo.
- As atualizações de React, Redux, Redux Saga e outras bibliotecas introduziram centenas de incompatibilidades com o código legado.
- Há imports cujos pacotes foram removidos do `package.json`.
- O AppImage existente foi gerado antes das últimas alterações e não representa o estado atual do código.

## Estratégia

Separar a migração do build da modernização das bibliotecas. Primeiro será restaurada a compatibilidade do código legado; atualizações maiores de React, Redux e Redux Saga ficarão para trabalhos posteriores e independentes.

## Etapas

- [ ] 1. Preservar o trabalho existente em uma branch própria e registrar este plano em um commit isolado.
- [ ] 2. Revisar as dependências e restaurar os pacotes e tipagens exigidos pelo código atual, evitando atualizações de API que ainda não foram migradas.
- [ ] 3. Ajustar a configuração do Vite para resolver aliases, variáveis de ambiente, Sass, CommonJS, polyfills, workers e assets usados pela aplicação.
- [ ] 4. Fazer o build do renderer passar e, em seguida, restaurar uma verificação TypeScript compatível com o escopo da migração.
- [ ] 5. Ajustar a inicialização do Electron para desenvolvimento e produção, mantendo logs úteis sem deixar recursos de depuração habilitados na distribuição.
- [ ] 6. Validar a aplicação no navegador/Electron e executar testes de fumaça das telas principais e da abertura da carteira, sem transmitir transações.
- [ ] 7. Gerar e inspecionar um novo AppImage a partir do código corrigido.
- [ ] 8. Atualizar a documentação de desenvolvimento e build, revisar os arquivos gerados e criar o commit final.

## Critérios de conclusão

- Instalação de dependências reproduzível pelo Yarn.
- Build do renderer e empacotamento Linux concluídos sem erro.
- Aplicação iniciando em desenvolvimento e a partir do pacote de produção.
- Telas principais renderizando sem erros não tratados no console.
- Documentação compatível com os comandos realmente disponíveis.
- Nenhuma credencial, chave privada ou transação real utilizada nos testes.
