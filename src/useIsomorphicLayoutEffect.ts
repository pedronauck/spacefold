import { useEffect, useLayoutEffect } from 'react'

export const isBrowser = typeof window !== 'undefined'
const useIsomorphicLayoutEffect = isBrowser ? useLayoutEffect : useEffect

export default useIsomorphicLayoutEffect
