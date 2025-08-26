# Módulo 3 - Pokémon Form

## 📌 Descrição
Projeto desenvolvido no **Módulo 3** para buscar informações de Pokémon utilizando uma **API customizada** (endpoint próprio do VTEX IO).  
O formulário permite consultar um Pokémon pelo ID, exibir informações básicas e abrir um modal com detalhes completos.  
Além disso, dispara um evento no **dataLayer** para monitoramento de métricas.

---

## 🚀 Funcionalidades
- Buscar Pokémon pelo **ID**.
- Exibir dados básicos: `id`, `nome`, `tipos`, `altura` e `peso`.
- Botão **"Ver mais informações"** que abre um modal com:
  - Habilidades
  - Atributos (stats)
  - Golpes (limitado a 30)
  - Sprite oficial
- Estilização customizada responsiva e acessível.
- Disparo de evento no **GA4 / Tag Manager** via `dataLayer`.

---