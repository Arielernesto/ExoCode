import { z } from 'zod'

const validateSchema = z.object({
  email: z.string().email({message: "Correo no válido"}).nonempty({ message: "Correo requerido"}),
  password: z.string().min(6, {message: "Contraseña debe tener mínimo 6 caracteres"}),
})

export type UserLogin = z.infer<typeof validateSchema>

export const validateUserLogin = (data: UserLogin) => {
    const errors: { [key: string]: string | boolean } = { status: false }
    try {
        validateSchema.parse(data)
    } catch (e) {
        if (e instanceof z.ZodError) {
            e.errors.forEach(err => {
                errors[err.path[0]] = err.message
            })
            errors.status = true
        }
    }

    return { errors, data }
}