
const API = import.meta.env.PUBLIC_API_URL
export function ReadImage(file: File): Promise<string>{
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = () => {
            resolve(reader.result as string)
        }

        reader.onerror = () => {
            reject(null)
        }

        reader.readAsDataURL(file)
    })
}

interface ImageUploaded{
    data: string | null
    error: string | null
}

export async function uploadImage(file: File | null | string): Promise<ImageUploaded>{
    const formData = new FormData()
    formData.append('image', file!)
    try {
        const pet = await fetch(`${API}/api/image`, {
            method: "POST",
            body: formData
        })
        const res = await pet.json()
        console.log(res)
        return { data: `${API}/${res.file.url}`, error: null}
    } catch (error) {
        return { data: null, error: "Ha ocurrido un error al subir la imagen"}
    }
}