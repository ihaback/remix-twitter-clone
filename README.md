# Remix.js Twitter Clone

Barebones Twitter clone built with the [Remix.js Indie Stack](https://github.com/remix-run/indie-stack) and [Faker.js](https://fakerjs.dev/) to mock database data. Uses sqlite for prototyping but can easily be changed to Postgres or MySQL.

<h2><a id="features">🌟 Features</a></h2>

- Register, Sign Users
- Follow, Unfollow Users
- Read, Create, Delete Tweets
- Personal feed based on who you follow
- Browser user to Follow
- Access articles by ID

<h2><a id="table-of-contents">📚 Table of Contents</a></h2>

- [Development](#development)
  - [Installation](#installation)
  - [Set up the database](#set-up-the-database)
  - [Running the app](#running-the-app)
  - [Test user](#test-user)

<h2><a id="development">💻 Development</a></h2>

<h3><a id="installation">📦 Installation</a></h3>

```bash
npm install
```

<h3><a id="set-up-the-database">🗄️ Set up the database</a></h3>

```bash
# Generate prisma client
npx prisma generate

# Setup the database
npx prisma db push

# Seed the database
npx prisma db seed
```

<h3><a id="running-the-app">🚀 Running the app</a></h3>

```bash
# development
npm run dev

# build
npm run build

# start
npm run start
```

<h3><a id="test-user">🙋‍♂️ Test user for login</a></h3>

```js
  {
    username: "test@test.com",
    password: "password",
  }
```
