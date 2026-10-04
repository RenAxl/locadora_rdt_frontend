# Padronização do módulo items

O módulo `src/app/features/stocks/items` foi reescrito tomando como referência principal os 26 arquivos de `src/app/features/organization/customers`. Todos os arquivos de ambos os módulos foram lidos antes das alterações. A comparação final incluiu models, DTOs, mappers, services, componentes, templates, CSS, módulos e rotas. Os hashes dos 26 arquivos de customers permaneceram iguais aos registrados antes da refatoração.

## Correspondência dos arquivos

Os caminhos de items abaixo são relativos a `src/app/features/stocks/items`; os de customers são relativos a `src/app/features/organization/customers`.

| Arquivo original de items | Arquivo final / alteração | Referência em customers |
| --- | --- | --- |
| `items.module.ts` | Reescrito | `customers.module.ts` |
| `items-routing.module.ts` | Reescrito | `customers-routing.module.ts` |
| `models/Item.ts` | Reescrito | `models/Customer.ts` |
| `models/ItemUnit.ts` | Interface substituída por classe | `models/CustomerFile.ts` |
| `dtos/item.dto.ts` | Renomeado e reescrito como `dtos/item-dto.ts` | `dtos/customer-dto.ts` |
| `dtos/item-insert.dto.ts` | Renomeado e reescrito como `dtos/item-insert-dto.ts` | `dtos/customer-insert-dto.ts` |
| `dtos/item-update.dto.ts` | Renomeado e reescrito como `dtos/item-update-dto.ts` | `dtos/customer-update-dto.ts` |
| `dtos/item-details.dto.ts` | Removido; campos reunidos em `ItemDTO` | `dtos/customer-dto.ts` |
| `mapper/item.mapper.ts` | Reescrito | `mapper/customer.mapper.ts` |
| `services/item.service.ts` | Reescrito | `services/customer.service.ts` |
| `services/item-unit.service.ts` | Reescrito | `services/customer-file.service.ts` |
| `pages/item-form/item-form.component.ts` | Reescrito | `pages/customer-form/customer-form.component.ts` |
| `pages/item-form/item-form.component.html` | Reescrito | `pages/customer-form/customer-form.component.html` |
| `pages/item-form/item-form.component.css` | Reescrito | `pages/customer-form/customer-form.component.css` |
| `pages/item-list/item-list.component.ts` | Reescrito | `pages/customer-list/customer-list.component.ts` |
| `pages/item-list/item-list.component.html` | Reescrito | `pages/customer-list/customer-list.component.html` |
| `pages/item-list/item-list.component.css` | Reescrito | `pages/customer-list/customer-list.component.css` |
| `pages/item-unit-list/item-unit-list.component.ts` | Reescrito | `pages/customer-list/customer-list.component.ts` e `components/customer-files-modal/customer-files-modal.component.ts` |
| `pages/item-unit-list/item-unit-list.component.html` | Reescrito | `pages/customer-list/customer-list.component.html` |
| `pages/item-unit-list/item-unit-list.component.css` | Reescrito | `pages/customer-list/customer-list.component.css` |
| `components/item-details-modal/item-details-modal.component.ts` | Reescrito | `components/customer-details-modal/customer-details-modal.component.ts` |
| `components/item-details-modal/item-details-modal.component.html` | Reescrito | `components/customer-details-modal/customer-details-modal.component.html` |
| `components/item-details-modal/item-details-modal.component.css` | Reescrito | `components/customer-details-modal/customer-details-modal.component.css` |

Novos arquivos de produção:

| Arquivo | Referência | Finalidade |
| --- | --- | --- |
| `dtos/item-unit-dto.ts` | `dtos/customer-file-dto.ts` | Separar a resposta HTTP do model de unidade |
| `mapper/item-unit.mapper.ts` | `mapper/customer-file.mapper.ts` | Converter o DTO de unidade para model |

Também foram analisados os models e DTOs de endereço, o modal de arquivos e seus estilos. Endereços e operações de anexos de clientes não foram copiados: não pertencem às operações existentes de items. Customers não possui arquivos de testes neste frontend.

## Padrões aplicados

- Models como classes com construtores explícitos, valores iniciais e conversão de datas, como Customer e CustomerFile.
- DTOs como classes e nomes `*-dto.ts`, com construtores `Partial<DTO>` e atribuições explícitas.
- Um único ItemDTO para listagem, consulta, criação e atualização; versão e auditoria preservadas.
- Mapper com `toModel`, `toInsertDTO`, `toUpdateDTO` e `toModelList`, seguindo CustomerMapper. DTOs não convertem models.
- Services com injeção de HttpClient, respostas tipadas, URLs em API e parâmetros de paginação pelo componente já utilizado em customers.
- Formulário com NgForm, métodos separados para inserir, atualizar, enviar imagem e finalizar; tratamento global de erros HTTP e aviso específico quando apenas o envio de imagem falha.
- Categorias convertidas pelo CategoryMapper real deste projeto e comparadas por ID no select. Categorias inativas continuam disponíveis, como antes.
- Listagem com app-data-table, app-name-filter, app-field-customization, seleção por IDs entre páginas e exportação pelo componente compartilhado.
- Imagens com PhotoPreview e PhotoUrlRegistry existentes, revogação de URLs e cancelamento das subscriptions equivalentes à referência.
- Templates, distribuição dos campos, cabeçalhos, botões, imagens e modal seguem os equivalentes de customers. CSS de listagem e modal corresponde ao da referência com os nomes adaptados.
- Permissões originais ITEMS_READ, ITEMS_WRITE, ITEMS_DELETE e STOCKBALANCES_READ preservadas.

## Estruturas antigas eliminadas

- DTO separado de detalhes, `fromDTO` e `fromDetailsDTO`, com todas as referências atualizadas.
- Interfaces de resposta usadas diretamente como models e construtores com cópias genéricas.
- Duplicação da configuração de tabelas PrimeNG, paginação, seleção e exportação que agora pertencem ao app-data-table.
- Helpers próprios de finalização/envio, arrays genéricos de subscriptions e callbacks compactados que divergiam dos componentes de customers.
- Imports, declarações e rotas que dependiam dos componentes inexistentes de stock-balances e stock-movements.
- Referências a configurações de API do projeto antigo. O endpoint de unidades foi mantido com sua URL original e centralizado no API real deste projeto.

## Diferenças restantes e justificativas

| Diferença | Justificativa |
| --- | --- |
| Categoria, descrição e preço no formulário, listagem e detalhes | São os campos e regras de items. Foram preservados limites de texto, preço mínimo de 0,01 e apresentação em BRL. O InputNumberModule e o CSS para textarea/campo monetário são necessários para esses campos. |
| Version no model e DTO de leitura | Campo existente no DTO antigo de detalhes; a unificação não deve descartá-lo. |
| ItemUnit, ItemUnitDTO, mapper, service e página de unidades | Unidades físicas são uma operação existente de items. Seus campos de patrimônio, número de série, status, condição e atividade foram mantidos; não foram criadas operações de escrita. |
| Paginação local das unidades, com 10 registros inicialmente | O endpoint original retorna um array completo. O componente compartilhado recebe as páginas recortadas com slice; não foi inventado um contrato paginado de backend. |
| Rota `stock-balances/:itemId/units` | Caminho original preservado, protegido por STOCKBALANCES_READ. A listagem de items oferece o acesso à página e o botão de retorno leva à listagem existente. |
| Consulta de imagem condicionada por imageContentType na listagem/formulário | Preserva o comportamento existente de items. |

Nenhum arquivo de produção mantém uma arquitetura antiga sem justificativa. As diferenças listadas usam a mesma organização e simplicidade da referência. Não foram adicionadas bibliotecas, classes-base, endpoints ou regras de clientes.

## Integração necessária fora do módulo

- `src/app/app-routing.module.ts`: carregamento lazy de ItemsModule em `/items`.
- `src/app/core/config/api.config.ts`: configuração API.ITEMS; CRUD alinhado ao `/inventory/items` do backend atual e URL original de unidades mantida.
- `src/app/shared/components/sidebar/sidebar.component.html`: acesso a Itens no menu Estoque, com ITEMS_READ. Categorias mantém sua própria verificação CATEGORY_READ.
- Este relatório em `docs/items-standardization.md`.

As integrações permitem que os componentes reescritos sejam acessíveis e usem os componentes reais do projeto. Os componentes inexistentes de saldos e movimentações não foram portados.

## Testes e validação

Foram criados 10 testes de regressão simples com Jasmine e spies, no estilo dos testes existentes do frontend:

| Classe de testes | Quantidade | Cenários |
| --- | --- | --- |
| `pages/item-list/item-list.component.spec.ts` | 4 | Seleção entre páginas; filtro/paginação/ordenação; falha na listagem; DTO unificado com versão e auditoria |
| `pages/item-form/item-form.component.spec.ts` | 4 | Categorias e comparação por ID; salvar antes de enviar imagem; estado inativo e aviso de falha no upload; resposta antiga de imagem após seleção de arquivo |
| `pages/item-unit-list/item-unit-list.component.spec.ts` | 2 | Paginação local e preservação dos campos; rótulos de status/condição e valores desconhecidos |

- `npm test -- --watch=false --browsers=ChromeHeadless`: **64 testes aprovados**, incluindo os 54 testes existentes.
- `npm run build`: **build de produção aprovado**, incluindo TypeScript, templates e budgets configurados no projeto.
- `git diff --check`: aprovado.
- Verificação por SHA-256: **26 arquivos de customers inalterados**.
- Ambiente: Node 16.20.2, npm 8.19.4, Angular 14.1 e Chrome Headless 154. Não foram necessárias alterações de configuração para executar build ou testes.

Limitações: não houve validação autenticada das telas com um servidor ativo. O backend atual não implementa o endpoint original `/rentals/availability/items/{itemId}/all-units`; a integração da página de unidades depende desse serviço. Build e testes verificam o código e os contratos simulados, sem consultar ou alterar dados do banco. A ausência do endpoint não foi resolvida nesta tarefa de frontend.
