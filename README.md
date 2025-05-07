# Organiz.er API

Há um tempo a Rocketseat fez um evento onde desenvolveram uma aplicação fullstack chamada Plann.er. Eu acompanhei o evento e achei a ideia do projeto bem divertida, além do design da aplicação web ser incrível. E claro, eu fiquei com muita vontade de desenvolver.

Dei o nome de Organiz.er para a aplicação porque apesar de ser 100% inspirado no projeto da Rocketseat, além do layout disponibilizado no Figma, todo restante foi desenvolvido e projetado por mim.

A aplicação consiste em uma RESTful API de um sistema de gerenciador de viagem. O usuário pode se cadastrar, criar viagens, convidar novos participantes, criar novas atividades, entre outras funcionalidades. O projeto foi criado com Node.js, utilizando Fastify, Typescript, Vitest, Prisma, Zod, Nodemailer, entre outras ótimas tecnologias. Utiliza autenticação baseado em JWT, junto com um sistema de refresh token para revalidação de acesso. Os participantes convidados não precisam ter conta para serem convidados, sendo esse processo feito e validado por envio de e-mail para confirmação do participante utilizando Nodemailer.

#

### 🔨 Guia de instalação

Para visualizar o projeto é necessário possuir o NodeJS instalado em sua máquina. Você pode fazer um clone do repositório e executar os seguintes comandos no terminal para visualizar o projeto:

Clone o projeto

```
  git clone https://github.com/gctoledo/organizer-api
```

Entre no diretório do projeto

```
  cd organizer-api
```

Instale as dependências

```
  npm install
```

Inicie o servidor

```
  npm run start:dev
```

## 📦 Tecnologias usadas:

- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
- ![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white)
- ![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
- ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
