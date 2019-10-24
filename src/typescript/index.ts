const identityTransform = <Unguarded, Guarded>(unguarded: Unguarded): Guarded =>
  (unguarded as unknown) as Guarded

const generate = <Unguarded, Guarded>(
  transform: (unguarded: Unguarded) => Guarded = identityTransform,
) => {
  interface Internal {
    internal: Guarded
  }

  class GuardedClass implements Internal {
    constructor(guarded: Guarded) {
      this.internal = guarded
    }

    internal: Guarded
  }

  const createFromUnguarded = (unguarded: Unguarded) => {
    return new GuardedClass(transform(unguarded))
  }

  const typeGuard = (unguarded: unknown): unguarded is GuardedClass => {
    return unguarded instanceof GuardedClass
  }

  return { createFromUnguarded, typeGuard }
}

type UnguardedA = {
  a: string
}

type GuardedA = {
  A: string
}

const transformA = (unguarded: UnguardedA) => {
  return { A: unguarded.a }
}

const generateA = generate(transformA)

const accessGuardedA = (possiblyGuarded: unknown) => {
  if (generateA.typeGuard(possiblyGuarded)) {
    return possiblyGuarded.internal.A
  }

  return 'Oh darn it'
}

const unguardedA = { a: 'a' }

console.log('unguardedA', unguardedA) // { a: 'a' }
console.log('accessGuardedA(unguardedA)', accessGuardedA(unguardedA)) // 'Oh darn it'

const guardedA = generateA.createFromUnguarded(unguardedA)

console.log('guardedA', guardedA) // { internal: { A: 'a' } }
console.log('accessGuardedA(guardedA)', accessGuardedA(guardedA)) // 'a'