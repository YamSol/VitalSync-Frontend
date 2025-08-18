# VitalSync Frontend - Detalhamento do Projeto

## 1. Stack Tecnológica
- **Linguagem:** TypeScript
- **Framework:** React (com Vite)
- **Estilização:** Tailwind CSS
- **Gerenciamento de Estado:** Context API (ou Zustand, se necessário)
- **Roteamento:** React Router
- **Validação de Formulários:** React Hook Form + Yup
- **Consumo de API:** Axios

## 2. Estrutura de Pastas Sugerida
```
src/
  components/
  pages/
  hooks/
  services/
  types/
  assets/
  styles/
  App.tsx
  main.tsx
```

## 3. Requisitos Funcionais

### Login
- Página única de login (usuário: médico)
- Campos: e-mail, senha
- Autenticação via API (JWT)
- Redireciona para dashboard após login

### Dashboard
- Lista de pacientes (Nome, Freq. Card., Sat. de Oxig., Pressão Arterial, Temperatura)
- Cada linha clicável → redireciona para `/paciente/<id>`
- Botão "Registrar Paciente" → `/registrar-paciente`
- Atualização automática (polling ou WebSocket, se disponível)
- Design responsivo

### Página do Paciente
- Exibe: Nome, Foto, Dados Atuais (sinais vitais), Número de transmissões recebidas
- Médias: últimas 24h, 7 dias, mês
- Outras informações relevantes (idade, condição, histórico)
- Gráficos (opcional)

### Registrar Paciente
- Formulário: Nome, Foto (upload opcional), Idade, Condição, outros campos importantes
- Validação de campos obrigatórios
- Envio para API

## 4. Requisitos Não Funcionais
- Responsividade
- Acessibilidade básica
- Feedback visual (loaders, mensagens de erro/sucesso)
- Código limpo, modular e reutilizável

## 5. Design
- Visual limpo, profissional, com cores suaves (azul, branco, cinza)
- Dashboard estilo cards ou tabela
- Botões destacados para ações principais
- Fotos de pacientes em miniatura (avatar)
- Utilizar componentes prontos do Tailwind para agilidade

## 6. Integração com Backend
- Endpoints para login, listar pacientes, detalhes do paciente, registrar paciente
- Autenticação via token (armazenar em localStorage ou cookie seguro)
- Tratamento de erros de API

## 7. Extras/Opcional
- Gráficos de evolução dos sinais vitais
- Filtros e busca na lista de pacientes
- Logout
- Tema escuro/claro

---

## Primeiros Passos
1. Inicializar projeto com Vite + React + TypeScript
2. Instalar Tailwind CSS
3. Configurar estrutura de pastas
4. Criar página de Login
5. Criar página de Dashboard
6. Criar página de Detalhes do Paciente
7. Criar página de Registro de Paciente

Cada etapa será detalhada e implementada em partes, com commits intermediários.
