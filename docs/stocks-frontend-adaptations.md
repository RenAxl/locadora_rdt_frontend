# Adaptação do frontend ao estoque genérico

## Alterações realizadas

- Categorias utilizam `/inventory/categories`, inclusive nas operações de imagem, atividade e exclusão.
- As unidades usam AVAILABLE, UNAVAILABLE, MAINTENANCE, DAMAGED e LOST. A conservação usa NEW, GOOD, FAIR e DAMAGED, separadamente da situação operacional.
- A lista de unidades permite alterar a situação e informar um motivo de até 255 caracteres. A operação usa PATCH `/inventory/item-units/{id}/status`.
- A antiga ação de excluir uma unidade aparece como **Dar baixa definitiva**. A confirmação informa que a unidade ficará inativa e que o histórico será preservado. Após a baixa, a lista é recarregada e a seleção é limpa.
- Somente unidades ativas podem ser selecionadas para baixa. Unidades inativas podem receber uma reentrada, desde que seu item e categoria estejam ativos.
- Unidades AVAILABLE com item ou categoria inativos aparecem como indisponíveis. As demais situações físicas continuam visíveis, seguindo a separação das contagens no backend.
- Saldos mostram total, disponíveis, indisponíveis, manutenção, danificados, não localizados, mínimo e alerta. As contagens e o alerta vêm do backend; o frontend edita apenas o mínimo. As colunas derivadas continuam sem ordenação para evitar consultas rejeitadas pela API.
- Movimentações oferecem entrada, saída definitiva, ajuste e alteração de situação. O ajuste representa o total de unidades ativas desejado e permite zero.
- Saídas podem selecionar uma unidade disponível, com quantidade 1, ou deixar a escolha automática para o backend.
- Alterações de situação exigem uma unidade ativa, quantidade 1 e uma situação diferente da atual.
- Ao trocar o item ou tipo de movimentação, a seleção da unidade e da situação é limpa. A consulta anterior de unidades é cancelada. As consultas percorrem todas as páginas.
- O histórico mostra o código patrimonial e as situações anterior e nova, quando informados. Movimentações antigas e agregadas continuam aceitando referências nulas.
- Exportações incluem os novos campos e os rótulos traduzidos das situações e da conservação.
- O preço do item é opcional e aceita zero. O código patrimonial é gerado no backend como `ITEM-<id do item>-<8 caracteres aleatórios>`, inclusive no cadastro manual. Código patrimonial e número de série foram retirados do formulário e dos DTOs de cadastro e edição; o número de série também saiu dos modelos e das telas de consulta.

## Arquitetura

- **Item:** representa o recurso controlado e mantém seus dados genéricos.
- **ItemUnit:** representa a unidade física e permite editar seus dados e solicitar mudanças de situação.
- **StockBalance:** apresenta as contagens e o alerta calculados pelo backend e permite editar o mínimo.
- **StockMovement:** registra operações genéricas e apresenta o histórico, incluindo a unidade e as mudanças de situação.

As opções e traduções de situações e condições ficaram em um arquivo simples, compartilhado pelos componentes do estoque. Os mappers continuam apenas convertendo dados entre DTOs e modelos. As validações e o fluxo dos formulários ficam nos componentes.

## Contratos da API

| Operação | Adaptação |
| --- | --- |
| `/inventory/categories` e subrotas | Rota genérica adotada no lugar de `/rental/categories`. |
| PATCH `/inventory/item-units/{id}/status` | Envia `status` e `reason` pelo novo `ItemUnitStatusUpdateDTO`. |
| DELETE `/inventory/item-units/{id}` e `/all` | A interface apresenta baixa lógica e recarrega as unidades, incluindo as inativas. |
| PATCH `/inventory/item-units/{id}/active` | Usado para registrar reentrada com `true`. |
| GET `/inventory/stock-balances` | DTO, modelo e mapper recebem `maintenanceQuantity`, `damagedQuantity` e `lostQuantity`. |
| POST `/inventory/stock-movements` | DTO de entrada recebe `itemUnitId` e `status`, opcionais conforme o tipo. |
| GET `/inventory/stock-movements` | DTO, modelo e mapper recebem `itemUnitId`, `assetCode`, `previousStatus` e `newStatus`, nullable. |
| POST e PUT `/inventory/items` | Formulário permite preço ausente ou zero. |

As rotas de navegação do frontend foram preservadas. As permissões existentes continuam sendo utilizadas: escrita de unidades para alterar situação/reentrada, exclusão de unidades para baixa e escrita de movimentações para registrá-las. A seleção individual em movimentações requer leitura de unidades; a saída automática continua funcionando sem essa permissão.

## Banco de dados

O frontend utiliza o contrato do backend refatorado. Antes de executar essa versão do backend sobre um banco antigo, deve estar aplicado o script já criado em [refactor-generic-stocks.sql](../../locadora_rdt_backend/scripts/refactor-generic-stocks.sql). Esta adaptação do frontend não exige outro script.

## Testes e compilação

- `npm test -- --watch=false --browsers=ChromeHeadless`: **123 testes aprovados**, incluindo **69 de stocks**.
- Foram acrescentados **39 cenários** relativos a contratos HTTP, conservação, disponibilidade, baixa, reentrada, alteração de situação, seleção de unidades, paginação, cancelamento de consulta anterior, permissões, histórico, exportação e preço opcional/zero.
- Testes de template verificam o formulário real de item sem preço e com zero, além dos campos obrigatórios e da quantidade fixa em uma alteração de situação.
- `npm run build`: **build de produção aprovado**.
- `git diff --check`: aprovado.

Os contratos foram conferidos diretamente nos DTOs e controllers do backend e testados com `HttpTestingController`.

## Problemas fora do escopo

O build emite um aviso do otimizador de CSS sobre o seletor `legend + *`, presente em `node_modules/bootstrap/dist/css/bootstrap.css`. O aviso não impede a geração da aplicação. A dependência e os módulos externos ao estoque foram mantidos.

## Melhorias futuras

- Adicionar testes de integração de navegador com a API para acompanhar um ciclo de entrada, indisponibilidade, retorno à disponibilidade e baixa.
- Se o volume de unidades crescer muito, substituir a carga de todas as páginas da seleção por uma busca paginada de unidades na API.

## Arquivos criados

- `src/app/features/stocks/categories/services/category.service.spec.ts`
- `src/app/features/stocks/item-units/constants/item-unit-options.ts`
- `src/app/features/stocks/item-units/dtos/item-unit-status-update-dto.ts`
- `src/app/features/stocks/item-units/pages/item-unit-list/item-unit-list.component.spec.ts`
- `src/app/features/stocks/items/pages/item-form/item-form.template.spec.ts`
- `src/app/features/stocks/stock-movements/pages/stock-movement-form/stock-movement-form.template.spec.ts`
- `src/app/features/stocks/stock-movements/pages/stock-movement-list/stock-movement-list.component.spec.ts`
- `src/app/features/stocks/stock-movements/services/stock-movement.service.spec.ts`
- `docs/stocks-frontend-adaptations.md`

## Arquivos alterados

- `src/app/core/config/api.config.ts`
- `src/app/features/stocks/item-units/components/item-unit-details-modal/item-unit-details-modal.component.spec.ts`
- `src/app/features/stocks/item-units/components/item-unit-details-modal/item-unit-details-modal.component.ts`
- `src/app/features/stocks/item-units/pages/item-unit-form/item-unit-form.component.html`
- `src/app/features/stocks/item-units/pages/item-unit-form/item-unit-form.component.ts`
- `src/app/features/stocks/item-units/pages/item-unit-list/item-unit-list.component.html`
- `src/app/features/stocks/item-units/pages/item-unit-list/item-unit-list.component.ts`
- `src/app/features/stocks/item-units/services/item-unit.service.spec.ts`
- `src/app/features/stocks/item-units/services/item-unit.service.ts`
- `src/app/features/stocks/items/pages/item-form/item-form.component.html`
- `src/app/features/stocks/stock-balances/dtos/stock-balance-dto.ts`
- `src/app/features/stocks/stock-balances/mapper/stock-balance.mapper.ts`
- `src/app/features/stocks/stock-balances/models/StockBalance.ts`
- `src/app/features/stocks/stock-balances/pages/stock-balance-list/stock-balance-list.component.html`
- `src/app/features/stocks/stock-balances/pages/stock-balance-list/stock-balance-list.component.spec.ts`
- `src/app/features/stocks/stock-balances/pages/stock-balance-list/stock-balance-list.component.ts`
- `src/app/features/stocks/stock-movements/dtos/stock-movement-dto.ts`
- `src/app/features/stocks/stock-movements/dtos/stock-movement-insert-dto.ts`
- `src/app/features/stocks/stock-movements/mapper/stock-movement.mapper.ts`
- `src/app/features/stocks/stock-movements/models/StockMovement.ts`
- `src/app/features/stocks/stock-movements/pages/stock-movement-form/stock-movement-form.component.html`
- `src/app/features/stocks/stock-movements/pages/stock-movement-form/stock-movement-form.component.spec.ts`
- `src/app/features/stocks/stock-movements/pages/stock-movement-form/stock-movement-form.component.ts`
- `src/app/features/stocks/stock-movements/pages/stock-movement-list/stock-movement-list.component.html`
- `src/app/features/stocks/stock-movements/pages/stock-movement-list/stock-movement-list.component.ts`

## Arquivos removidos

Nenhum. O inventário acima considera o estado dos arquivos no início desta adaptação, preservando as alterações anteriores.

O módulo `stocks` permaneceu genérico e não possui dependência de regras específicas de outros módulos de negócio.


## Atualização do formulário de unidades físicas

O formulário Dados da Unidade Física agora envia apenas `itemId`, `conditionStatus`, `purchaseDate` e `notes`. Na edição, o ID da unidade identifica a URL de atualização. O código patrimonial gerado pelo backend continua sendo recebido nas consultas e exibido na lista e no histórico, mas não é enviado na escrita. O código existente permanece igual ao editar a conservação, a data de compra ou as observações.

A informação de número de série foi retirada do modelo, dos DTOs, do mapper, do formulário, do detalhamento e das opções de colunas da lista.

Validação desta atualização: **58 testes aprovados**, incluindo quatro novos testes do formulário real, e **build de produção aprovado**. O frontend e o backend devem ser atualizados juntos para utilizar os novos DTOs.


## Filtro de unidades ativas e com baixa

A lista de unidades físicas inicia em “Ativas”. O filtro “Unidades” também oferece “Com baixa” e “Todas”. Após confirmar a baixa individual ou em lote, a tabela consulta novamente o backend e a unidade sai da lista de ativas. O histórico permanece preservado e a reentrada está disponível na consulta de unidades com baixa.

Listagem e exportação enviam o mesmo parâmetro opcional `active` para `GET /inventory/item-units`. A alteração do filtro limpa a seleção e reinicia a paginação; a reentrada também reinicia a paginação para evitar páginas vazias. Atualize o backend para que aplique o filtro recebido.

Foram acrescentados dez testes para os filtros da tela, pedidos HTTP, baixa individual/em lote, reentrada e exportação. Resultado: 68 testes aprovados e build de produção concluído.
