import { z } from 'zod'

const validateSchema = z.object({
  username: z.string().nonempty({ message: "Nombre requerido" }),
  lastname: z.string().nonempty({message: "Apellido requerido"}),
  email: z.string().email({message: "Correo no válido"}).nonempty({ message: "Correo requerido"}),
  password: z.string().min(6, {message: "Contraseña debe tener mínimo 6 caracteres"}),
  confirmPassword: z.string().nonempty({message: "Confirmar contraseña requerido"})
})

export type User = z.infer<typeof validateSchema>

export const validateUser = (data: User) => {
    const errors: { [key: string]: string } = {}
    try {
        validateSchema.parse(data)
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "La contraseña confirmada debe coincidir"
        }
    } catch (e) {
        if (e instanceof z.ZodError) {
            e.errors.forEach(err => {
                errors[err.path[0]] = err.message
            })
        }
    }

    return { errors, data }
}