"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FunctionResult } from "@/lib/types"
import { executeFunction } from "@/lib/functions"
import { useChat } from "ai/react"
import Logo from "./logo"

interface Site {
  name: string
  url: string
}

interface ChatInterfaceProps {
  currentSite: Site
  onAddFunctionResult: (result: FunctionResult) => void
}

export default function ChatInterface({ currentSite, onAddFunctionResult }: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isExecutingFunction, setIsExecutingFunction] = useState(false)

  // Usar useChat de la AI SDK
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "system",
        content: `Eres un asistente de Fastracker que ayuda a navegar y automatizar acciones en ${currentSite.name}. 
        Puedes buscar productos, aplicar filtros, ver detalles y comparar productos.
        Cuando el usuario te pida realizar una acción, debes llamar a la función correspondiente.`,
      },
      {
        id: "greeting",
        role: "assistant",
        content: `¡Hola! Soy tu asistente de Fastracker. Estoy listo para ayudarte a navegar por ${currentSite.name}. ¿Qué te gustaría hacer hoy?`,
      },
    ],
    onResponse: (response) => {
      // Procesar la respuesta para detectar llamadas a funciones
      if (response.functionCall) {
        handleFunctionCall(response.functionCall)
      }
    },
  })

  const quickSuggestions = [
    "Buscar zapatillas Nike",
    "Filtrar por precio menor a $100",
    "Ver productos en oferta",
    "Comparar los primeros 3 resultados",
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Actualizar mensaje de sistema cuando cambia el sitio
    // En una implementación real, habría que manejar esto de otra manera
  }, [currentSite])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Manejar llamadas a funciones
  const handleFunctionCall = async (functionCall: { name: string; arguments: Record<string, any> }) => {
    try {
      setIsExecutingFunction(true)

      // Ejecutar la función
      const result = await executeFunction(functionCall.name, functionCall.arguments)

      // Crear un resultado para mostrar en el WebViewer
      const functionResult: FunctionResult = {
        id: Date.now().toString(),
        type: getFunctionResultType(functionCall.name),
        title: getFunctionTitle(functionCall.name, functionCall.arguments),
        data: result,
        timestamp: new Date(),
      }

      // Enviar el resultado al WebViewer
      onAddFunctionResult(functionResult)
    } catch (error) {
      console.error("Error ejecutando función:", error)

      // Enviar error al WebViewer
      onAddFunctionResult({
        id: Date.now().toString(),
        type: "error",
        title: `Error en ${functionCall.name}`,
        data: { error: (error as Error).message },
        timestamp: new Date(),
      })
    } finally {
      setIsExecutingFunction(false)
    }
  }

  // Determinar el tipo de resultado basado en el nombre de la función
  const getFunctionResultType = (functionName: string): FunctionResult["type"] => {
    switch (functionName) {
      case "search_products":
        return "search"
      case "apply_filters":
        return "filter"
      case "get_product_details":
        return "product"
      case "compare_products":
        return "chart"
      default:
        return "list"
    }
  }

  // Generar un título descriptivo para el resultado
  const getFunctionTitle = (functionName: string, args: Record<string, any>): string => {
    switch (functionName) {
      case "search_products":
        return `Búsqueda: ${args.query}`
      case "apply_filters":
        return `Resultados filtrados`
      case "get_product_details":
        return `Detalles del producto #${args.productId}`
      case "compare_products":
        return `Comparación de productos`
      default:
        return `Resultado de ${functionName}`
    }
  }

  const handleQuickSuggestion = (suggestion: string) => {
    // Simular envío del mensaje de sugerencia
    const fakeEvent = {
      preventDefault: () => {},
    } as React.FormEvent<HTMLFormElement>

    handleInputChange({ target: { value: suggestion } } as React.ChangeEvent<HTMLInputElement>)
    setTimeout(() => handleSubmit(fakeEvent), 100)
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <Logo size={24} />
        <h2 className="font-semibold text-lg">Asistente Fastracker</h2>
        {isExecutingFunction && (
          <div className="ml-auto flex items-center gap-2 text-sm text-blue-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Ejecutando función...</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          {messages.map(
            (message) =>
              message.role !== "system" && (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-2 max-w-[85%] animate-in fade-in-0 zoom-in-95 duration-300",
                    message.role === "user" ? "ml-auto" : "mr-auto",
                  )}
                >
                  <div className={cn("flex items-start gap-2.5", message.role === "user" && "flex-row-reverse")}>
                    <div
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                        message.role === "user" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {message.role === "user" ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    <div
                      className={cn(
                        "p-3 rounded-2xl text-sm",
                        message.role === "user"
                          ? "bg-blue-500 text-white rounded-tr-none"
                          : "bg-gray-100 text-gray-800 rounded-tl-none",
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ),
          )}
          {isLoading && (
            <div className="flex gap-2 max-w-[85%] mr-auto">
              <div className="flex items-start gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 shrink-0">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="p-3 rounded-2xl bg-gray-100 text-gray-800 rounded-tl-none">
                  <div className="flex gap-1 items-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Suggestions */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {quickSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              className="whitespace-nowrap"
              onClick={() => handleQuickSuggestion(suggestion)}
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Escribe un comando o pregunta..."
            className="flex-1"
            disabled={isLoading || isExecutingFunction}
          />
          <Button type="submit" size="icon" disabled={isLoading || isExecutingFunction || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
