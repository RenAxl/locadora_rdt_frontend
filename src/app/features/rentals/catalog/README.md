# Catálogo de consulta

## Correção de compilação — 2026-10-07

O catálogo passou a operar somente como consulta de itens, conforme escolha explícita do usuário. Foram preservados a listagem com cards, os filtros de nome e categoria, o detalhe, os preços, as imagens e a indicação de item inativo. A paginação foi ajustada para dez itens por página.

Após a mudança da pasta para `features/rentals/catalog`, o import relativo de ItemDTO deixou de apontar para stocks. CatalogService agora utiliza `src/app/features/stocks/items/dtos/item-dto`.

As dependências de RentalCartService, RentalService e RentalItem não existem neste checkout. Como a seleção e a finalização de locação foram retiradas do escopo pelo usuário, seus imports, métodos, controles, estilos e referências foram removidos. Não foram criados services substitutos nem contratos de backend.

## Arquivos ajustados

- `services/catalog.service.ts`: import de ItemDTO corrigido.
- `catalog.module.ts`: removidos RentalCartSummaryComponent e os imports não utilizados de DialogModule e TooltipModule.
- `pages/catalog-list/catalog-list.component.html`: removido o resumo de seleção.
- `pages/catalog-item-details/catalog-item-details.component.ts`: removidas as dependências, variáveis e ações de locação; mantidas as consultas do item e da imagem, a limpeza de subscriptions e o retorno ao catálogo.
- `pages/catalog-item-details/catalog-item-details.component.html`: removidos o resumo e os controles de seleção/finalização.
- `pages/catalog-item-details/catalog-item-details.component.css`: removidas somente as regras dos controles excluídos.

Removidos os três arquivos de `components/rental-cart-summary`: TypeScript, HTML e CSS.

Criados este README e `pages/catalog-item-details/catalog-item-details.component.spec.ts`.

O CSS de CatalogItemCardComponent permaneceu idêntico. Nenhum arquivo fora de catalog foi modificado nesta correção. O registro da rota principal e as alterações de sidebar que já estavam no diretório de trabalho foram preservados.

## Padrão de customers

Mantidos HttpClient, Observable, Pagination, PageResponse, DTO de leitura único e conversão explícita pelo mapper, seguindo CustomerService e CustomerListComponent. O detalhe segue CustomerFormComponent e CustomerDetailsModalComponent quanto à leitura por id, aos métodos simples e à limpeza de imagens/subscriptions. CatalogModule segue a organização de CustomersModule, com apenas os imports necessários à interface atual.

CatalogService reutiliza ItemDTO, ItemMapper e Item existentes em stocks. O caminho `/catalog` é composto a partir de API.BASE, porque a configuração compartilhada ainda não possui API.CATALOG e está fora do escopo desta alteração. As rotas internas continuam usando AuthGuard e CATALOG_READ. Os cards e o paginator são diferenças necessárias em relação à tabela de customers e permanecem preservados.

## Validação

```bash
npm run build
npm run build -- --configuration development
CHROME_BIN=/usr/bin/google-chrome npm test -- --watch=false --browsers=ChromeHeadless
```

Os dois builds passaram, com CatalogModule incluído no bundle da aplicação. A configuração de desenvolvimento corresponde à utilizada por ng serve neste projeto.

Os **99 testes passaram**, incluindo 13 testes de catalog: quatro de service, cinco de listagem e quatro de detalhe. Os novos testes verificam o render do detalhe sem ações de locação, item não encontrado, falha da imagem sem perda do detalhe e retorno à listagem. Eles importam CatalogModule real, sem stubs dos services de locação ausentes.

Não foi realizado um fluxo autenticado contra o backend real. A validação de consultas e telas nos testes utiliza os mocks existentes de HttpClient/service. Nenhuma dependência foi instalada e nenhum arquivo de configuração foi alterado.
