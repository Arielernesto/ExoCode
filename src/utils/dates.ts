export function convertDate(date: number | undefined){
    if (!date) return "Desconocida"

    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
    const dateParsed = new Date(date)
    return `${dateParsed.getDate()} de ${months[dateParsed.getMonth()]} del ${dateParsed.getFullYear()}`
  }