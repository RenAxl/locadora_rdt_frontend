# Padronização de receivables

## Atualização: remoção do parcelamento

A funcionalidade de parcelar contas foi removida do frontend e do backend: botão, método da listagem, chamadas HTTP, configuração de endpoint, DTOs, rota do controller, contrato e implementação do service, consulta exclusiva e constantes. Os testes exclusivos da criação de parcelas foram retirados. Foi incluído um teste HTTP que verifica resposta 404 ao chamar a antiga rota `/receivables/{id}/installments`. Os campos de vínculo e valor original permanecem para leitura e baixa de contas existentes.

Validação desta remoção: build de produção do frontend aprovado, 23 testes frontend aprovados, build Maven (`mvn -Dtest=Receivable*Tests package`) aprovado e 31 testes de receivables no backend aprovados, incluindo o retorno 404 da rota antiga.

O inventário e os resultados abaixo registram a etapa anterior de padronização.

O módulo `src/app/features/financial/payables` foi a referência principal. Todos os seus 49 arquivos foram analisados antes da primeira alteração. Depois da reescrita, todos os arquivos de `receivables` foram comparados novamente com seus equivalentes.

## Resultado

Foram reescritos 32 arquivos existentes, criados ou renomeados 15 arquivos, removidos ou substituídos 9 arquivos antigos e preservados 5 arquivos que já eram equivalentes. O módulo final contém 52 arquivos, incluindo testes.

- Estrutura `components`, `pages`, `services`, `models`, `dtos` e `mapper`, com os mesmos nomes e organização de `payables`.
- Models e DTOs em classes, com propriedades e atribuições explícitas nos construtores.
- DTOs separados por operação, com nomes `receivable-*-dto.ts`; mapper com `toModel`, `toInsertDTO`, `toUpdateDTO` e `toModelList`.
- Datas de vencimento e baixa como strings `YYYY-MM-DD`, iguais ao contrato HTTP e ao formulário de `payables`. Datas de auditoria continuam convertidas em `Date` nos construtores.
- Services retornam DTOs tipados; mapeamento feito pelos componentes. Parâmetros HTTP usam `buildPaginationParams` e `if` explícitos.
- Formulários com `NgForm` e `ngModel`, validação e mensagens no mesmo estilo de `payables`.
- Listagem escreve seus cards no próprio HTML, com métodos diretos para situação, saldo, baixa e encargos.
- Arquivos usam `app-data-table`, `PhotoPreview`, `PhotoUrlRegistry` e o mesmo ciclo de limpeza e cancelamento de assinaturas de `payables`.
- Personalização usa `app-field-customization`; exportação usa `app-excel-export`, com os modelos e valores calculados apresentados nos cards.
- CSS, espaçamento, organização de imports, declarações e fluxo dos métodos seguem a referência.
- Falhas HTTP são tratadas pelo interceptor já existente; callbacks locais cuidam somente do estado ou do aviso específico de falha no upload após salvar.

## Padrões antigos removidos

- `ReactiveFormsModule`, `FormBuilder`, `FormGroup`, `formControlName`, `patchValue` e `trimToUndefined` nos filtros.
- `Object.assign` nos modelos e interfaces agrupadas no antigo `receivable.dto.ts`.
- `ReceivableDetailsDTO`, interface duplicada sem campos próprios.
- `fromDTO`, `fromDetailsDTO` e helpers de conversão de datas no mapper.
- `appendParam` genérico e mapeamento de `any` com RxJS no service de arquivos.
- `showError` local e notificações HTTP duplicadas em relação ao interceptor do projeto.
- Componente `receivable-card`, wrappers de situação/visibilidade, placeholders de ações e lógica de saldo duplicada entre card e página.
- SCSS próprio dos filtros e estilos importados do módulo de clientes.
- `app-table-columns-modal` e chamada direta a `ListingExportService`, substituídos pelos componentes compartilhados usados em `payables`.
- Helpers genéricos de conclusão/upload e de visualização PDF; operações seguem o fluxo explícito da referência.

## Diferenças necessárias preservadas

- Cliente obrigatório; não há fornecedor nem funcionário em contas a receber.
- Permissões `RECEIVABLES_READ`, `RECEIVABLES_WRITE` e `RECEIVABLES_DELETE`, conforme o backend local.
- Recibo e cupom fiscal continuam usando seus endpoints próprios.
- Resíduo da conta pai continua identificado nos cards.
- Saldo parcial e encargos calculados pelo backend continuam presentes. O desconto automático de PIX/boleto foi removido das novas baixas; descontos de contas já quitadas são preservados no histórico. O valor original é separado do valor da parcela, conforme o DTO do backend e o padrão de `payables`.
- Os campos inicialmente visíveis e as opções de quantidade por página `[5, 10, 20]` do módulo original foram preservados.
- Preferências de `receivable-card-visible-fields` são lidas e seus nomes antigos convertidos pelo mesmo fluxo de migração existente em `payables`; novas escolhas usam `receivable-visible-fields`.
- Após excluir, o módulo continua recarregando a página atual.
- A coluna de ações tem 300px para acomodar as três ações específicas adicionais; as demais regras de layout seguem `payables`.

## Integrações necessárias

O módulo copiado não tinha rota na aplicação nem configuração `API.RECEIVABLES`. Foram adicionados os endpoints em `src/app/core/config/api.config.ts`, o carregamento lazy em `src/app/app-routing.module.ts` e o item financeiro do menu em `src/app/shared/components/sidebar/sidebar.component.html`, todos no estilo da integração de `payables`. Nenhum arquivo de `payables` foi alterado.

## Revisão arquivo por arquivo

Os caminhos abaixo são relativos à raiz de cada módulo. Arquivos que já eram equivalentes foram revisados e preservados.

| Arquivo em receivables | Referência em payables | Resultado |
| --- | --- | --- |
| `components/receivable-details-modal/receivable-details-modal.component.css` | `components/payable-details-modal/payable-details-modal.component.css` | Reescrito |
| `components/receivable-details-modal/receivable-details-modal.component.html` | `components/payable-details-modal/payable-details-modal.component.html` | Reescrito |
| `components/receivable-details-modal/receivable-details-modal.component.ts` | `components/payable-details-modal/payable-details-modal.component.ts` | Revisado; já equivalente |
| `components/receivable-files-modal/receivable-files-modal.component.css` | `components/payable-files-modal/payable-files-modal.component.css` | Reescrito |
| `components/receivable-files-modal/receivable-files-modal.component.html` | `components/payable-files-modal/payable-files-modal.component.html` | Reescrito |
| `components/receivable-files-modal/receivable-files-modal.component.ts` | `components/payable-files-modal/payable-files-modal.component.ts` | Reescrito |
| `components/receivable-filters/receivable-filters.component.css` | `components/payable-filters/payable-filters.component.css` | Criado/renomeado |
| `components/receivable-filters/receivable-filters.component.html` | `components/payable-filters/payable-filters.component.html` | Reescrito |
| `components/receivable-filters/receivable-filters.component.spec.ts` | `components/payable-filters/payable-filters.component.spec.ts` | Reescrito |
| `components/receivable-filters/receivable-filters.component.ts` | `components/payable-filters/payable-filters.component.ts` | Reescrito |
| `components/receivable-overdue-modal/receivable-overdue-modal.component.css` | `components/payable-overdue-modal/payable-overdue-modal.component.css` | Reescrito |
| `components/receivable-overdue-modal/receivable-overdue-modal.component.html` | `components/payable-overdue-modal/payable-overdue-modal.component.html` | Revisado; já equivalente |
| `components/receivable-overdue-modal/receivable-overdue-modal.component.ts` | `components/payable-overdue-modal/payable-overdue-modal.component.ts` | Reescrito |
| `components/receivable-payment-charges-modal/receivable-payment-charges-modal.component.css` | `components/payable-payment-charges-modal/payable-payment-charges-modal.component.css` | Reescrito |
| `components/receivable-payment-charges-modal/receivable-payment-charges-modal.component.html` | `components/payable-payment-charges-modal/payable-payment-charges-modal.component.html` | Reescrito |
| `components/receivable-payment-charges-modal/receivable-payment-charges-modal.component.ts` | `components/payable-payment-charges-modal/payable-payment-charges-modal.component.ts` | Reescrito |
| `components/receivable-payment-choice-modal/receivable-payment-choice-modal.component.css` | `components/payable-payment-choice-modal/payable-payment-choice-modal.component.css` | Reescrito |
| `components/receivable-payment-choice-modal/receivable-payment-choice-modal.component.html` | `components/payable-payment-choice-modal/payable-payment-choice-modal.component.html` | Revisado; já equivalente |
| `components/receivable-payment-choice-modal/receivable-payment-choice-modal.component.ts` | `components/payable-payment-choice-modal/payable-payment-choice-modal.component.ts` | Revisado; já equivalente |
| `components/receivable-payment-modal/receivable-payment-modal.component.css` | `components/payable-payment-modal/payable-payment-modal.component.css` | Reescrito |
| `components/receivable-payment-modal/receivable-payment-modal.component.html` | `components/payable-payment-modal/payable-payment-modal.component.html` | Reescrito |
| `components/receivable-payment-modal/receivable-payment-modal.component.spec.ts` | `components/payable-payment-modal/payable-payment-modal.component.spec.ts` | Criado/renomeado |
| `components/receivable-payment-modal/receivable-payment-modal.component.ts` | `components/payable-payment-modal/payable-payment-modal.component.ts` | Reescrito |
| `components/receivable-quick-period-filter/receivable-quick-period-filter.component.css` | `components/payable-quick-period-filter/payable-quick-period-filter.component.css` | Criado/renomeado |
| `components/receivable-quick-period-filter/receivable-quick-period-filter.component.html` | `components/payable-quick-period-filter/payable-quick-period-filter.component.html` | Revisado; já equivalente |
| `components/receivable-quick-period-filter/receivable-quick-period-filter.component.spec.ts` | `components/payable-quick-period-filter/payable-quick-period-filter.component.spec.ts` | Reescrito |
| `components/receivable-quick-period-filter/receivable-quick-period-filter.component.ts` | `components/payable-quick-period-filter/payable-quick-period-filter.component.ts` | Reescrito |
| `dtos/receivable-dto.ts` | `dtos/payable-dto.ts` | Criado/renomeado |
| `dtos/receivable-file-dto.ts` | `dtos/payable-file-dto.ts` | Criado/renomeado |
| `dtos/receivable-insert-dto.ts` | `dtos/payable-insert-dto.ts` | Criado/renomeado |
| `dtos/receivable-payment-dto.ts` | `dtos/payable-payment-dto.ts` | Criado/renomeado |
| `dtos/receivable-report-dto.ts` | `dtos/payable-report-dto.ts` | Criado/renomeado |
| `dtos/receivable-update-dto.ts` | `dtos/payable-update-dto.ts` | Criado/renomeado |
| `mapper/receivable-file.mapper.ts` | `mapper/payable-file.mapper.ts` | Criado/renomeado |
| `mapper/receivable.mapper.spec.ts` | `components/payable-payment-modal/payable-payment-modal.component.spec.ts (estilo de teste) e mapper/payable.mapper.ts` | Criado/renomeado |
| `mapper/receivable.mapper.ts` | `mapper/payable.mapper.ts` | Reescrito |
| `models/Receivable.ts` | `models/Payable.ts` | Reescrito |
| `models/ReceivableFile.ts` | `models/PayableFile.ts` | Reescrito |
| `models/ReceivableFilters.ts` | `models/PayableFilters.ts` | Criado/renomeado |
| `pages/receivable-form/receivable-form.component.css` | `pages/payable-form/payable-form.component.css` | Reescrito |
| `pages/receivable-form/receivable-form.component.html` | `pages/payable-form/payable-form.component.html` | Reescrito |
| `pages/receivable-form/receivable-form.component.ts` | `pages/payable-form/payable-form.component.ts` | Reescrito |
| `pages/receivable-list/receivable-list.component.css` | `pages/payable-list/payable-list.component.css` | Reescrito |
| `pages/receivable-list/receivable-list.component.html` | `pages/payable-list/payable-list.component.html` | Reescrito |
| `pages/receivable-list/receivable-list.component.spec.ts` | `components/payable-payment-modal/payable-payment-modal.component.spec.ts (instância com spies) e pages/payable-list/payable-list.component.ts` | Criado/renomeado |
| `pages/receivable-list/receivable-list.component.ts` | `pages/payable-list/payable-list.component.ts` | Reescrito |
| `receivables-routing.module.ts` | `payables-routing.module.ts` | Reescrito |
| `receivables.module.ts` | `payables.module.ts` | Reescrito |
| `services/receivable-file.service.ts` | `services/payable-file.service.ts` | Reescrito |
| `services/receivable.service.spec.ts` | `services/payable.service.spec.ts` | Criado/renomeado |
| `services/receivable.service.ts` | `services/payable.service.ts` | Reescrito |

## Arquivos antigos substituídos ou removidos

- `components/receivable-card/receivable-card.component.css`
- `components/receivable-card/receivable-card.component.html`
- `components/receivable-card/receivable-card.component.ts`
- `components/receivable-filters/receivable-filters.component.scss`
- `components/receivable-quick-period-filter/receivable-quick-period-filter.component.scss`
- `dtos/receivable-details.dto.ts`
- `dtos/receivable-insert.dto.ts`
- `dtos/receivable-update.dto.ts`
- `dtos/receivable.dto.ts`

## Conformidade

Não foi identificado arquivo de implementação fora do padrão de `payables`. As operações de PDF não têm equivalente funcional em `payables`; usam o mesmo estilo simples de chamadas HTTP. Os testes adicionais seguem o estilo de Jasmine, spies e HttpTestingController já usado na referência.

## Validação na etapa de padronização

- `npm run build`: aprovado, incluindo o chunk lazy de `receivables` e compilação dos templates com `strictTemplates`.
- `CHROME_BIN=/tmp/rdt-chrome-headless npm test -- --watch=false --browsers=ChromeHeadless --progress=false --reporters=dots`: 51 de 51 testes aprovados. O wrapper temporário executa o Chrome instalado com `--no-sandbox`, necessário para este ambiente; nenhuma configuração de testes do projeto foi alterada.
- Regressões verificadas: parâmetros HTTP, mínimo de valor igual a zero, filtros por cliente, períodos rápidos nas viradas de mês/ano, desconto Pix/boleto, limite de baixa parcial, principal da parcela separado do total original, datas preservadas no mapper, paginação, exportação, preferências antigas, carregamento em erro, parcelamento e PDFs.
- `git diff --check`: aprovado. Como o módulo original já estava sem rastreamento no Git, sua revisão completa também comparou os arquivos finais com uma cópia de segurança externa em `/tmp/rdt-receivables-before-vgjso3bq/receivables`.
- O build emite um aviso de processamento de CSS global para o seletor `legend+*`; não houve erro de build.
- Não foi realizada validação ponta a ponta com backend autenticado.
