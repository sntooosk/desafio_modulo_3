# Módulo 3 - Pokémon Form

## 📌 Descrição
Projeto desenvolvido no **Módulo 3** para buscar informações de Pokémon utilizando uma **API customizada** (endpoint próprio do VTEX IO).  
O formulário permite consultar um Pokémon pelo ID, exibir informações básicas e abrir um modal com detalhes completos.  
Além disso, dispara um evento no **dataLayer** para monitoramento de métricas.

<img src="https://yt3.googleusercontent.com/Rf59I910bMtmjTnLxMzQslbDzb-FMxhFyLanbyM93-7vXjtVnh4a8U2OTi9hEdlgJJrlkay8-H0=s900-c-k-c0x00ffffff-no-rj" alt="Pokémon" width="200"/>

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
