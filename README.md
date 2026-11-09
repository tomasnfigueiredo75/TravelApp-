# TravelApp

Aplicação móvel de descoberta e planeamento de viagens, em português de Portugal, construída com React Native e Expo.

## Funcionalidades incluídas no código
- Registo e login locais com validação e estados de erro.
- Descoberta, pesquisa e filtro de destinos.
- Integração com a API pública REST Countries (sem chave).
- Detalhes de destino.
- Favoritos persistidos em AsyncStorage.
- Planeamento de viagens com datas e notas.
- Avaliações e comentários locais.
- Preferência de tema claro/escuro.
- Preferência e notificação local de teste.
- Documentação de histórias de utilizador e checklist de evidências.

## Requisitos
- Node.js LTS
- npm ou Yarn
- Expo Go compatível ou build de desenvolvimento
- Android Studio/emulador Android ou Xcode para iOS

## Instalação
```bash
npm install
npx expo install --fix
npx expo start
```

Para Android:
```bash
npx expo start --android
```

Para iOS (necessita macOS/Xcode):
```bash
npx expo start --ios
```

## API externa
A aplicação consulta `https://restcountries.com/v3.1/alpha` para obter países, capitais, regiões, população e bandeiras. As fotografias são URLs do Unsplash. É necessária ligação à Internet.

## Persistência
Os dados são guardados localmente com AsyncStorage. Esta implementação é adequada a um protótipo académico local; não é autenticação segura para produção. Para produção, substituir por backend com hashing de palavras-passe, gestão de sessão e políticas de segurança.

## Notificações
As notificações locais exigem permissões do sistema e devem ser testadas em dispositivo ou emulador nativo. A pré-visualização web não comprova notificações push/locais.

## Estrutura
```text
app/
  _layout.tsx
  index.tsx
src/
  data/destinations.ts
  services/storage.ts
  types.ts
docs/
  HISTORIAS_DE_UTILIZADOR.md
  ENTREGA_28_REQUISITOS.md
```

## Limitações conhecidas
- Conta, viagens, avaliações e comentários são armazenados no dispositivo, não sincronizados na nuvem.
- A API REST Countries fornece dados de países, não disponibilidade/preços turísticos.
- As avaliações são locais e não partilhadas entre utilizadores.
- A grelha de avaliação exige capturas reais e links GitHub; estes têm de ser produzidos depois de executar a app.
- O ecrã Figma deve ser criado no Figma; o código não cria automaticamente um ficheiro Figma.

Consultar `docs/ENTREGA_28_REQUISITOS.md` antes da submissão.
