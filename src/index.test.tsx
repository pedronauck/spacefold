import '@testing-library/jest-dom'

import React, { useState } from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { pub, sub, useSub } from './'

const inc = pub<number>()
const dec = pub<number>()
const counterSub = sub({
  register: [inc, dec],
})

const Counter = () => {
  const [state, setState] = useState(0)
  const sub = useSub(counterSub)

  sub.on(inc, (num) => {
    setState(state + num)
  })
  sub.on(dec, (num) => {
    setState(state - num)
  })

  return <div data-testid="state">{state}</div>
}

const Decrement = () => (
  <button data-testid="dec" onClick={() => dec.send(2)}>
    dec
  </button>
)
const Increment = () => (
  <button data-testid="inc" onClick={() => inc.send(2)}>
    inc
  </button>
)

const App = () => (
  <div>
    <Counter />
    <Increment />
    <Decrement />
  </div>
)

test('should state be: 0', () => {
  render(<App />)
  expect(screen.getByTestId('state')).toHaveTextContent('0')
})

test('should state be: 6', async () => {
  render(<App />)
  fireEvent.click(screen.getByTestId('inc'))
  fireEvent.click(screen.getByTestId('inc'))
  fireEvent.click(screen.getByTestId('dec'))
  fireEvent.click(screen.getByTestId('inc'))
  fireEvent.click(screen.getByTestId('inc'))
  expect(screen.getByTestId('state')).toHaveTextContent('6')
})

test('should not dispatch non register events', async () => {
  const ev = pub()
  const err = console.error
  console.error = jest.fn()

  const App = () => {
    const sub = useSub(counterSub)

    sub.on(ev, () => {
      console.log('helo')
    })

    return (
      <div>
        <button onClick={() => ev.send()}></button>
      </div>
    )
  }

  let exception
  try {
    render(<App />)
  } catch (err) {
    exception = (err as any).message
  }

  const expected = 'This publisher is not register on your subscriber'
  expect(exception).toEqual(expected)
  console.error = err
})

const logPromise = pub<string>()
const promiseSub = sub({
  register: [logPromise],
})

test('should handle promises on listener', async () => {
  function log(val: string) {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve(val)
      }, 1000)
    })
  }

  const App = () => {
    const [state, setState] = useState('Hello')
    const sub = useSub(promiseSub)

    sub.on(logPromise, async (val) => {
      const res = await log(val)
      setState(res)
    })

    return (
      <>
        <div data-testid="state">{state}</div>
        <button data-testid="button" onClick={() => logPromise.send('Hi')}>
          Say hi
        </button>
      </>
    )
  }

  render(<App />)
  expect(screen.getByTestId('state')).toHaveTextContent('Hello')
  fireEvent.click(screen.getByTestId('button'))
  await waitFor(() =>
    expect(screen.getByTestId('state')).toHaveTextContent('Hi')
  )
})
