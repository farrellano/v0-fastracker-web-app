"use client"

import { useState } from "react"
import WebViewer from "@/components/web-viewer"
import ChatInterface from "@/components/chat-interface"
import type { FunctionResult } from "@/lib/types"
import Logo from "@/components/logo"

export default function Home() {
  const [currentSite, setCurrentSite] = useState({
    name: "Amazon",
    url: "https://www.amazon.com",
  })

  // Estado para almacenar los resultados de las funciones que se mostrarán en el WebViewer
  const [functionResults, setFunctionResults] = useState<FunctionResult[]>([])

  const changeSite = (site: { name: string; url: string }) => {
    setCurrentSite(site)
  }

  // Función para añadir un nuevo resultado de función
  const addFunctionResult = (result: FunctionResult) => {
    setFunctionResults((prev) => [...prev, result])
  }

  return (
    <main className="flex h-screen bg-gray-50">
      {/* Header principal */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-14 flex items-center px-4 z-10">
        <div className="flex items-center gap-2">
          <Logo size={28} />
          <h1 className="font-bold text-xl text-blue-600">Fastracker</h1>
        </div>
        <div className="ml-4 text-sm text-gray-500">Navegación web inteligente</div>
      </div>

      {/* Contenido principal (con margen superior para el header) */}
      <div className="flex w-full h-full pt-14">
        {/* Panel Izquierdo - Agente Conversacional (40%) */}
        <div className="w-2/5 h-full flex flex-col p-4">
          <ChatInterface currentSite={currentSite} onAddFunctionResult={addFunctionResult} />
        </div>

        {/* Panel Derecho - Visualización de resultados de funciones (60%) */}
        <div className="w-3/5 h-full flex flex-col p-4">
          <WebViewer site={currentSite} onChangeSite={changeSite} functionResults={functionResults} />
        </div>
      </div>
    </main>
  )
}
