import { useConstant } from './useConstant'
import { useUnmount } from './useUnmount'

type Arr = readonly any[]
type Callback<T extends Arr> = (...args: [...T]) => void | Promise<void>

export interface Subscriber {
  unsubscribe: () => void
}

export interface Pub<T extends Arr = any> {
  id: Symbol
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

  function useListen() {
    const on = useConstant(() => {
      return function <T extends Arr>(pub: Pub<T>, cb: Callback<T>) {
        if (opts.register.every((i) => i.id !== pub.id)) {
          throw new Error('This publisher is not register on your subscriber')
        }

        const sub = pub.subscribe(async (...args) => {
          await cb(...args)
        })

        subs.add(sub)
      }
    })

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

  return {
    id,
    useListen,
  }
}

export function useSub(sub: Sub) {
  const { useListen } = sub
  const listen = useListen()

  useUnmount(() => {
    listen.off()
  })

  return listen
}
