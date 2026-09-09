import { defineEntity, p } from '@mikro-orm/core'

const UserSchema = defineEntity({
  name: 'User',
  properties: {
    id: p.integer().primary(),
    email: p.string().length(256),
    password: p.string().nullable(),
    name: p.string().length(100),
    createdAt: p.datetime().onCreate(() => new Date())
  }
})

export class User extends UserSchema.class {}
UserSchema.setClass(User)
