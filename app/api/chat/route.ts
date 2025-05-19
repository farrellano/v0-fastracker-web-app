import { StreamingTextResponse, type Message } from "ai"

// Esta es una implementación simulada de una API de chat
// En una aplicación real, aquí se conectaría con un modelo de IA como OpenAI
export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  // Simulamos la respuesta del asistente
  const responseText = await simulateAssistantResponse(messages)

  // Verificamos si necesitamos llamar a una función
  const functionCall = detectFunctionCall(lastMessage.content)

  // Creamos la respuesta
  const response = functionCall
    ? {
        role: "assistant",
        content: responseText,
        functionCall,
      }
    : {
        role: "assistant",
        content: responseText,
      }

  // Convertimos la respuesta a un stream
  const stream = new ReadableStream({
    async start(controller) {
      // Enviamos la respuesta como un stream
      controller.enqueue(JSON.stringify(response))
      controller.close()
    },
  })

  return new StreamingTextResponse(stream)
}

// Función para simular la respuesta del asistente
async function simulateAssistantResponse(messages: Message[]): Promise<string> {
  const lastMessage = messages[messages.length - 1]
  const userMessage = lastMessage.content.toLowerCase()

  // Simulamos un pequeño retraso para que parezca que está pensando
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (userMessage.includes("buscar")) {
    const searchTerm = userMessage.replace("buscar", "").trim()
    return `Estoy buscando "${searchTerm}" para ti. Aquí tienes los resultados.`
  }

  if (userMessage.includes("filtrar") || userMessage.includes("filtro")) {
    return `He aplicado los filtros solicitados. Aquí están los resultados filtrados.`
  }

  if (userMessage.includes("comparar")) {
    return `He preparado una comparación de los productos solicitados. Puedes ver los detalles lado a lado.`
  }

  if (userMessage.includes("detalles") || userMessage.includes("producto")) {
    return `Aquí tienes los detalles completos del producto solicitado.`
  }

  return `Puedo ayudarte a buscar productos, aplicar filtros, ver detalles o comparar productos. ¿Qué te gustaría hacer?`
}

// Función para detectar si necesitamos llamar a una función basada en el mensaje del usuario
function detectFunctionCall(message: string): { name: string; arguments: Record<string, any> } | null {
  const messageLower = message.toLowerCase()

  if (messageLower.includes("buscar")) {
    const query = messageLower.replace("buscar", "").trim()
    return {
      name: "search_products",
      arguments: {
        query: query || "productos",
        filters: {},
      },
    }
  }

  if (messageLower.includes("filtrar") || messageLower.includes("filtro")) {
    const filters: Record<string, any> = {}

    if (messageLower.includes("precio")) {
      if (messageLower.includes("menor")) {
        filters.maxPrice = 100
      } else if (messageLower.includes("mayor")) {
        filters.minPrice = 100
      } else {
        filters.minPrice = 50
        filters.maxPrice = 200
      }
    }

    if (messageLower.includes("marca")) {
      filters.brand = "Nike"
    }

    return {
      name: "apply_filters",
      arguments: {
        filters,
      },
    }
  }

  if (messageLower.includes("comparar")) {
    return {
      name: "compare_products",
      arguments: {
        productIds: [1, 2, 3],
      },
    }
  }

  if (messageLower.includes("detalles") || messageLower.includes("producto")) {
    return {
      name: "get_product_details",
      arguments: {
        productId: 1,
      },
    }
  }

  return null
}
