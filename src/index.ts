import { useUnmount } from './useUnmount'

type Arr = readonly any[]
type Callback<T extends Arr> = (...args: [...T]) => void | Promise<void>

export interface Subscriber {
  unsubscribe: () => void
}

export interface Pub<T extends Arr = any> {
  id: symbol
  listeners: Set<Callback<T>>
  subscribe(cb: Callback<T>): Subscriber
  send(...args: [...T]): void
}

export function pub(): Pub
export function pub<T>(): Pub<[T]>
export function pub<T1, T2>(): Pub<[T1, T2]>
export function pub<T1, T2, T3>(): Pub<[T1, T2, T3]>
export function pub<T1, T2, T3, T4>(): Pub<[T1, T2, T3, T4]>
export function pub<T extends Arr>(): Pub<T> {
  const id = Symbol()
  const listeners = new Set<Callback<T>>()
  return {
    id,
    listeners,
    send(...args: [...T]) {
      for (const listener of listeners) {
        listener(...args)
      }
    },
    subscribe(cb) {
      listeners.add(cb)
      return {
        unsubscribe() {
          listeners.delete(cb)
        },
      }
    },
  }
}

interface SubOpts {
  register: Pub[]
}

export type Sub = ReturnType<typeof sub>

export function sub(opts: SubOpts) {
  const id = Symbol()
  const subs = new Set<Subscriber>()

  function on<T extends Arr>(pub: Pub<T>, cb: Callback<T>) {
    if (opts.register.every((i) => i.id !== pub.id)) {
      throw new Error('This publisher is not register on your subscriber')
    }

    const sub = pub.subscribe(async (...args) => {
      await cb(...args)
    })

    subs.add(sub)
  }

  function off() {
    for (const sub of subs) {
      sub.unsubscribe()
    }
  }

  return {
    id,
    on,
    off,
  }
}

export function useSub({ on, off }: Sub) {
  useUnmount(() => {
    off()
  })

  return { on }
}
