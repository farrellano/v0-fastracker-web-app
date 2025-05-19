// Tipos para los resultados de funciones
export interface FunctionResult {
  id: string
  type: "search" | "filter" | "product" | "list" | "chart" | "error"
  title: string
  data: any
  timestamp: Date
}

// Tipos para los mensajes del chat
export interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  functionCall?: {
    name: string
    arguments: Record<string, any>
  }
}

// Definición de las funciones disponibles para el asistente
export interface AvailableFunction {
  name: string
  description: string
  parameters: Record<string, any>
  execute: (args: any) => Promise<any>
}
