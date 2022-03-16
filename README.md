# use-pubsub

[![GitHub release](https://img.shields.io/github/release/pedronauck/use-pubsub.svg)]()
[![Build Status](https://travis-ci.org/pedronauck/use-pubsub.svg?branch=master)](https://travis-ci.org/pedronauck/use-pubsub)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ebdcc3e942b14363a96438b41c770b32)](https://www.codacy.com/app/pedronauck/use-pubsub?utm_source=github.com&utm_medium=referral&utm_content=pedronauck/use-pubsub&utm_campaign=Badge_Grade)

## 📜 Table of content

- [Why](#--why)
- [Solution](#--solution)
- [Demos](#--demos)
- [Usage](#--usage-demo)

## 🧐 &nbsp; Why

React has a declarative API and a unidirectional data flow, this is beatiful and changes a lot the way we write our frontend application, in fact, this changes everything. But, like a lot of things, React has good and bad parts. One of the bad ones, is that sometimes just make a simple communication between modules (internal or external), became hard to do that using props or states and in a lot of cases you will need a context/provider, some state management library or - in worst cases - prop dilling.

Because of that I've beeing used a very simple implementation of an old pattern called Pub/Sub inside my application when I have this type of problem.

#### ⚠️ Disclaimer

| This is not intended to replace your state management library or something else. Use this with caution or you can became your system very hard to debug.

## 💻 &nbsp; Usage

- **Small**. 1.3kb minified!
- **Extremely Simple**. Just publishers and subscribers like old ways

Install as project dependency:

```bash
$ yarn add use-pubsub
```

Now you can start to create your publishers and subscribers

```tsx
import { pub, sub, useSub } from 'use-pubsub'

const sayHi = pub<string>()

const loggerSub = sub({
  // This is extremaly important, you need to register your events inside your
  // subscriber in order to be able to listen to them
  register: [sayHi],
})

const App = () => {
  const sub = useSub(loggerSub)

  sub.on(sayHi, (text) => {
    console.log(text) // Hi
  })

  return (
    <div>
      <button onClick={() => sayHi.send('Hi')}>Say Hi</button>
    </div>
  )
}
```

Yes, simple as that, just a subscriber and a publisher!

## 🕺 &nbsp; Contribute

1.  [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2.  Install dependencies using Yarn: `yarn install`
3.  Make the necessary changes and ensure that the tests are passing using `yarn test`
4.  Send a pull request 🙌
