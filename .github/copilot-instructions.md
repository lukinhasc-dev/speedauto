# SpeedAuto - Instruções para Agentes de IA

## 📋 Visão Geral do Projeto

**SpeedAuto** é um sistema SaaS para gestão de concessionárias de veículos. Aplicação full-stack com:
- **Backend**: Node.js/Express + TypeScript + Supabase PostgreSQL
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + React Router v7
- **Autenticação**: Bcrypt + JWT (em implementação)
- **Status**: Em desenvolvimento (branch: `frontend-relatorios`)

## 🏗️ Arquitetura

### Backend (`/back-end`)

**Stack**: Express.js + Supabase + TypeScript

**Estrutura**:
```
src/
├── server.ts          # Inicialização Express, CORS, rotas
├── db.ts              # Configuração Supabase, testConnection()
├── controllers/       # Lógica de negócio (authController.ts)
├── models/            # Interfaces + queries Supabase
│   ├── User.ts        # CRUD usuários, hash bcrypt
│   ├── Veiculos.ts    # CRUD veículos com status
│   ├── Clientes.ts    # CRUD clientes
│   └── Vendas.ts      # CRUD vendas
└── routes/            # Endpoints RESTful
    ├── userRoutes.ts  # POST /login, /register
    ├── veiculosRoutes.ts
    ├── clientesRoutes.ts
    └── vendasRoutes.ts
```

**Padrão crítico - Models**: Cada entidade tem TypeScript interface + funções CRUD que usam `supabase.from('tabela').select|insert|update|delete()`.
- Exemplo: `back-end/src/models/Veiculos.ts` define `StatusVeiculo` type e operações CRUD
- Sempre retornar dados tipados: `return data as Veiculos[]`

**Autenticação**: 
- Login endpoint busca usuário, compara senha com `bcrypt.compare()`
- Senha armazenada com hash (salt 10): `await bcrypt.hash(senha, 10)`
- Resposta inclui email (token JWT ainda não implementado)

### Frontend (`/front-end`)

**Stack**: React 19 + Vite + TypeScript + Tailwind CSS

**Estrutura**:
```
src/
├── App.tsx              # React Router setup com Layout wrapper
├── api/                 # Axios clients para endpoints
│   ├── authApi.ts       # login(), register() — POST /login
│   ├── veiculosApi.ts
│   ├── clientesApi.ts
│   └── vendasApi.ts
├── components/          # Reusable UI (Layout, Sidebar, Headers)
├── pages/               # Rotas (Login, Dashboard, Veiculos, etc.)
├── types/               # Interfaces TypeScript sincronizadas com backend
└── assets/              # Logo SpeedAuto PNG
```

**Padrão crítico - Rotas**:
- `<Route path="/" element={<Login />} />` — sem Layout
- `<Route element={<Layout HeaderComponent={DashboardHeader} />}>` — dashboard protegida
- `<Route element={<Layout HeaderComponent={MainHeader} />}>` — outras páginas protegidas

**Padrão crítico - API**:
- `API_URL = 'http://localhost:5000/login'` (verificar porta em cada endpoint)
- Usar `axios.post()` com try/catch, navegar após sucesso
- Salvar token no localStorage se implementado JWT

**Tailwind customizado**:
- Cores adicionadas em `tailwind.config.js`:
  - `speedauto-sidebar` — Azul escuro para barra lateral
  - `speedauto-primary` — Azul principal
  - `speedauto-red`, `speedauto-green`, `speedauto-yellow` — Estados e alertas
  - Font family: Poppins (sem-serifa)
- Uso: `className="bg-speedauto-primary text-white font-poppins"`

## 🔄 Fluxos de Dados

### 1. Autenticação
```
Login.tsx → authApi.login(email, senha) 
  → POST http://localhost:5000/login 
  → authController.login() 
  → bcrypt.compare() → getUserByEmail() 
  → res.json({ email, message })
  → localStorage.setItem('token') → navigate('/dashboard')
```

### 2. CRUD Veículos
```
Veiculos.tsx → veiculosApi.getVeiculos() 
  → GET http://localhost:5000/veiculos 
  → getVeiculos() em back-end/src/models/Veiculos.ts
  → supabase.from('veiculos').select('*')
  → tipos sincronizados: Veiculos interface (front-end/src/types/)
```

**Sincronização de tipos**: 
- Backend define `interface Veiculos` em `models/`
- Frontend replica em `types/` (ex: `types/Veiculo.ts` — note singular/plural inconsistência)
- **Convenção**: Manter estrutura idêntica, usar nomes em inglês no backend, português no frontend se necessário

## 🛠️ Workflows Críticos

### Backend
```bash
# Desenvolvimento
npm run dev  # ts-node-dev com respawn + transpile

# Build (quando necessário)
tsc  # Compila TypeScript (sem output script configurado)
```

**Supabase**: 
- URL e KEY estão em `db.ts` (⚠️ credenciais visíveis — usar `.env` em produção)
- `testConnection()` chamado antes de `app.listen()` em `server.ts`
- Tabelas esperadas: `users`, `veiculos`, `clientes`, `vendas`

### Frontend
```bash
# Desenvolvimento
npm run dev  # Vite dev server (porta padrão 5173)

# Build production
npm run build  # tsc -b && vite build

# Lint
npm run lint  # ESLint configuration
```

**Cross-origin**: Backend configura `cors({ origin: '*' })` — permitindo requisições do front-end local.

## 📝 Convenções & Padrões

| Aspecto | Padrão | Exemplo |
|---------|--------|---------|
| **Nomes de rotas (backend)** | Minúsculas, plural | `/veiculos`, `/clientes`, `/login` |
| **Estrutura DB** | Tabelas plural, snake_case | `valor_venda`, `users`, `veiculos` |
| **Interfaces TypeScript** | PascalCase, singular (backend) ou Veiculo (front) | `interface Veiculos {}` |
| **Status enum** | Tipo union string literal | `type StatusVeiculo = 'Disponível' \| 'Vendido' \| 'Em manutenção'` |
| **Componentes React** | PascalCase, export default | `function Layout({ HeaderComponent }: LayoutProps)` |
| **Páginas React** | PascalCase, em `/pages` | `Veiculos.tsx`, `Dashboard.tsx` |
| **Cores Tailwind** | `speedauto-*` prefix | `className="bg-speedauto-primary text-white"` |
| **Fonts** | Poppins via Tailwind | `className="font-poppins"` |

## ⚠️ Desvios & Inconsistências Descobertos

1. **Singular vs Plural em Types**: Backend usa `interface Veiculos {}` (plural); Frontend usa `types/Veiculo.ts` (singular)
   - **Ação**: Normalizar em próximas adições — usar singular em ambos
   
2. **JWT ainda não implementado**: authController retorna `{ email, message }` não token
   - Backend pronto com comentário "aqui você pode gerar JWT se quiser"
   - Frontend salva no localStorage se `data.token` existir
   
3. **Credenciais Supabase hardcoded**: Estão em `db.ts` — mover para `.env` antes de produção

4. **Status inconsistente**: Backend usa `'Em manutenção'`, frontend em types usa `'Em Manutenção'` (capitalização)
   - **Ação**: Sincronizar em próxima edição

## 🔗 Pontos de Integração

- **API URL**: `http://localhost:5000` (verifique porta em variáveis de ambiente)
- **Supabase**: `https://ndnvvuqqfwxexjvylddq.supabase.co` (verificar em produção)
- **CORS**: Aberto para `*` — restringir em produção
- **Rotas desprotegidas**: `/` (Login), `/esqueci-senha`, `/admin-cadastrar`
- **Rotas com Layout**: `/dashboard`, `/veiculos`, `/vendas`, `/clientes`, `/relatorios`, `/configuracoes`

## 🎯 Próximos Passos Sugeridos

1. Implementar JWT completo em `authController.ts`
2. Adicionar middleware de autenticação nas rotas protegidas
3. Sincronizar tipos entre backend e frontend (singular/plural/capitalização)
4. Mover credenciais Supabase e URLs para `.env`
5. Configurar variáveis de ambiente no `package.json` scripts
6. Adicionar tratamento de erros global no frontend
7. Implementar páginas de Relatórios e Configurações

---

**Última atualização**: 14 de novembro de 2025  
**Branch ativo**: `frontend-relatorios`
