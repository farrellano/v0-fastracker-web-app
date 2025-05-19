"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  Search,
  Filter,
  ShoppingCart,
  BarChart3,
  AlertCircle,
  Lightbulb,
  ThumbsUp,
  TrendingUp,
  Star,
  Sparkles,
} from "lucide-react"
import type { FunctionResult } from "@/lib/types"
import Logo from "./logo"

interface Site {
  name: string
  url: string
}

interface WebViewerProps {
  site: Site
  onChangeSite: (site: Site) => void
  functionResults: FunctionResult[]
}

export default function WebViewer({ site, onChangeSite, functionResults }: WebViewerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newSiteName, setNewSiteName] = useState("")
  const [newSiteUrl, setNewSiteUrl] = useState("")
  const [activeTab, setActiveTab] = useState<string>("results")

  const handleChangeSite = () => {
    if (newSiteName && newSiteUrl) {
      onChangeSite({
        name: newSiteName,
        url: newSiteUrl.startsWith("http") ? newSiteUrl : `https://${newSiteUrl}`,
      })
      setIsDialogOpen(false)
      setNewSiteName("")
      setNewSiteUrl("")
    }
  }

  // Obtener el resultado más reciente para mostrar por defecto
  const latestResult = functionResults.length > 0 ? functionResults[functionResults.length - 1] : null

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-white rounded-t-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2">
          <Logo size={24} />
          <h2 className="font-medium">{site.name}</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Cambiar sitio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar sitio web</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="site-name" className="text-sm font-medium">
                  Nombre del sitio
                </label>
                <Input
                  id="site-name"
                  value={newSiteName}
                  onChange={(e) => setNewSiteName(e.target.value)}
                  placeholder="Ej: Falabella"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="site-url" className="text-sm font-medium">
                  URL del sitio
                </label>
                <Input
                  id="site-url"
                  value={newSiteUrl}
                  onChange={(e) => setNewSiteUrl(e.target.value)}
                  placeholder="Ej: www.falabella.com"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleChangeSite}>Confirmar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Container */}
      <div className="flex-1 bg-white rounded-b-2xl shadow-md border border-gray-100 overflow-hidden">
        <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <div className="border-b px-4">
            <TabsList className="h-12">
              <TabsTrigger value="results" className="data-[state=active]:bg-blue-50">
                Resultados
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-blue-50">
                Historial
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="results" className="flex-1 p-4 overflow-auto">
            {latestResult ? (
              <ResultDisplay result={latestResult} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <Search className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-lg font-medium">No hay resultados para mostrar</p>
                <p className="text-sm">Usa el chat para realizar búsquedas o acciones</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {functionResults.length > 0 ? (
                  functionResults
                    .map((result) => (
                      <Card
                        key={result.id}
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveTab("results")}
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getIconForResultType(result.type)}
                              <CardTitle className="text-base">{result.title}</CardTitle>
                            </div>
                            <CardDescription className="text-xs">{formatTimestamp(result.timestamp)}</CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <ResultSummary result={result} />
                        </CardContent>
                      </Card>
                    ))
                    .reverse()
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 py-12">
                    <BarChart3 className="h-12 w-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No hay historial</p>
                    <p className="text-sm">El historial de resultados aparecerá aquí</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Componente para mostrar un resultado
function ResultDisplay({ result }: { result: FunctionResult }) {
  switch (result.type) {
    case "search":
      return <SearchResults result={result} />
    case "filter":
      return <FilteredResults result={result} />
    case "product":
      return <ProductDetails result={result} />
    case "chart":
      return <ProductComparison result={result} />
    case "error":
      return <ErrorResult result={result} />
    default:
      return <GenericResult result={result} />
  }
}

// Componente para la interpretación de IA
function AIInsight({
  insights,
  recommendations = [],
  type = "default",
}: {
  insights: string[]
  recommendations?: string[]
  type?: "search" | "filter" | "product" | "chart" | "default"
}) {
  // Determinar el icono según el tipo
  const getIcon = () => {
    switch (type) {
      case "search":
        return <Search className="h-5 w-5 text-purple-500" />
      case "filter":
        return <Filter className="h-5 w-5 text-green-500" />
      case "product":
        return <Star className="h-5 w-5 text-amber-500" />
      case "chart":
        return <TrendingUp className="h-5 w-5 text-blue-500" />
      default:
        return <Lightbulb className="h-5 w-5 text-purple-500" />
    }
  }

  return (
    <div className="mt-6 bg-purple-50 rounded-xl p-4 border border-purple-100">
      <div className="flex items-center gap-2 mb-3">
        {getIcon()}
        <h3 className="font-medium text-purple-800">Interpretación de IA</h3>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-2">Análisis:</h4>
          <ul className="space-y-1.5">
            {insights.map((insight, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-purple-900">
                <Sparkles className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-purple-700 mb-2">Recomendaciones:</h4>
            <ul className="space-y-1.5">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-purple-900">
                  <ThumbsUp className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para mostrar resultados de búsqueda
function SearchResults({ result }: { result: FunctionResult }) {
  const { total, page, totalPages, products } = result.data

  // Generar insights basados en los resultados de búsqueda
  const generateSearchInsights = () => {
    const query = result.title.replace("Búsqueda: ", "")
    const priceRange =
      products.length > 0
        ? {
            min: Math.min(...products.map((p: any) => p.price)),
            max: Math.max(...products.map((p: any) => p.price)),
            avg: products.reduce((sum: number, p: any) => sum + p.price, 0) / products.length,
          }
        : null

    const highestRated =
      products.length > 0
        ? products.reduce((prev: any, current: any) => (prev.rating > current.rating ? prev : current))
        : null

    const insights = [
      `He encontrado ${total} resultados para "${query}", con precios que varían entre $${priceRange?.min.toFixed(2)} y $${priceRange?.max.toFixed(2)}.`,
      `El precio promedio de los productos es $${priceRange?.avg.toFixed(2)}, lo que indica un rango de precios ${priceRange?.avg > 100 ? "premium" : "accesible"}.`,
      `La mayoría de los productos tienen una valoración superior a 4 estrellas, lo que sugiere buena calidad general.`,
    ]

    const recommendations = [
      `El producto "${highestRated?.name}" tiene la mejor valoración (${highestRated?.rating}★) y podría ser la mejor opción de calidad.`,
      `Considera aplicar filtros de precio para refinar estos resultados según tu presupuesto.`,
      `Basado en las tendencias actuales, los productos ${query} más populares son los que combinan buen precio y alta valoración.`,
    ]

    return { insights, recommendations }
  }

  const { insights, recommendations } = generateSearchInsights()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{result.title}</h2>
        <span className="text-sm text-gray-500">{total} resultados</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product: any) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-yellow-500">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                  <span className="ml-1 text-gray-500">{product.rating}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Interpretación de IA */}
      <AIInsight insights={insights} recommendations={recommendations} type="search" />

      <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
        <span>
          Página {page} de {totalPages}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={page === 1}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled={page === totalPages}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}

// Componente para mostrar resultados filtrados
function FilteredResults({ result }: { result: FunctionResult }) {
  const { total, products, appliedFilters, sortBy } = result.data

  // Generar insights basados en los resultados filtrados
  const generateFilterInsights = () => {
    const filterCount = Object.keys(appliedFilters).length
    const priceFilter = appliedFilters.minPrice || appliedFilters.maxPrice

    const insights = [
      `He aplicado ${filterCount} filtro${filterCount !== 1 ? "s" : ""} a tu búsqueda, reduciendo los resultados a ${total} productos.`,
      priceFilter
        ? `El filtro de precio ha sido especialmente efectivo, mostrando productos que se ajustan a tu presupuesto.`
        : `Los filtros aplicados han priorizado productos de alta calidad y relevancia.`,
      `Los resultados filtrados muestran una tendencia hacia ${sortBy ? `productos ordenados por ${sortBy}` : "productos populares"}.`,
    ]

    const recommendations = [
      `Basado en los filtros aplicados, te recomiendo explorar los primeros 2-3 resultados que mejor coinciden con tus criterios.`,
      `Considera ${appliedFilters.brand ? "explorar otras marcas similares" : "añadir un filtro de marca"} para resultados más específicos.`,
      `Para una experiencia de compra óptima, puedes refinar aún más estos resultados con filtros adicionales de características específicas.`,
    ]

    return { insights, recommendations }
  }

  const { insights, recommendations } = generateFilterInsights()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{result.title}</h2>
        <span className="text-sm text-gray-500">{total} resultados</span>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg text-sm">
        <div className="font-medium mb-1">Filtros aplicados:</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(appliedFilters).map(([key, value]) => (
            <span key={key} className="bg-white px-2 py-1 rounded-md border border-blue-200">
              {formatFilterKey(key)}: {formatFilterValue(key, value as any)}
            </span>
          ))}
          {sortBy && (
            <span className="bg-white px-2 py-1 rounded-md border border-blue-200">Ordenado por: {sortBy}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product: any) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="flex-1 p-4">
                <h3 className="font-medium line-clamp-1">{product.name}</h3>
                <div className="flex items-baseline mt-1">
                  <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center mt-1 text-sm text-yellow-500">
                  {"★".repeat(Math.floor(product.rating))}
                  {"☆".repeat(5 - Math.floor(product.rating))}
                  <span className="ml-1 text-gray-500">{product.rating}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Interpretación de IA */}
      <AIInsight insights={insights} recommendations={recommendations} type="filter" />
    </div>
  )
}

// Componente para mostrar detalles de un producto
function ProductDetails({ result }: { result: FunctionResult }) {
  const { name, price, rating, reviews, description, specifications, images } = result.data

  // Generar insights basados en los detalles del producto
  const generateProductInsights = () => {
    const priceCategory = price < 100 ? "económico" : price < 200 ? "rango medio" : "premium"
    const ratingQuality =
      rating >= 4.5 ? "excelente" : rating >= 4.0 ? "muy buena" : rating >= 3.5 ? "buena" : "aceptable"

    const insights = [
      `Este producto tiene una valoración ${ratingQuality} de ${rating}★ basada en ${reviews} reseñas de usuarios.`,
      `Con un precio de $${price.toFixed(2)}, se posiciona en la categoría ${priceCategory} para este tipo de productos.`,
      `Las especificaciones indican que es un producto de ${specifications.find((s: any) => s.name === "Material")?.value || "calidad estándar"} con garantía incluida.`,
    ]

    const recommendations = [
      `Basado en la relación calidad-precio, este producto ${rating / price > 0.04 ? "ofrece un excelente valor" : "está dentro del rango esperado"}.`,
      `Te recomendaría ${rating > 4.2 ? "considerar seriamente este producto" : "explorar algunas alternativas"} antes de tomar una decisión final.`,
      `Si decides comprar, revisa las políticas de devolución y garantía para asegurar una compra sin preocupaciones.`,
    ]

    return { insights, recommendations }
  }

  const { insights, recommendations } = generateProductInsights()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center h-64">
            <img src={images[0] || "/placeholder.svg"} alt={name} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((image: string, index: number) => (
              <div key={index} className="bg-gray-100 rounded-lg p-2 flex items-center justify-center h-20">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${name} - vista ${index + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="md:w-1/2 space-y-4">
          <h1 className="text-2xl font-bold">{name}</h1>

          <div className="flex items-center gap-2">
            <div className="text-yellow-500">
              {"★".repeat(Math.floor(rating))}
              {"☆".repeat(5 - Math.floor(rating))}
            </div>
            <span className="text-gray-500">
              {rating} ({reviews} reseñas)
            </span>
          </div>

          <div className="text-3xl font-bold">${price.toFixed(2)}</div>

          <p className="text-gray-700">{description}</p>

          <div className="space-y-2">
            <h3 className="font-medium">Especificaciones:</h3>
            <div className="grid grid-cols-2 gap-2">
              {specifications.map((spec: any, index: number) => (
                <div key={index} className="flex">
                  <span className="font-medium text-gray-600 mr-2">{spec.name}:</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full">Agregar al carrito</Button>
          </div>
        </div>
      </div>

      {/* Interpretación de IA */}
      <AIInsight insights={insights} recommendations={recommendations} type="product" />
    </div>
  )
}

// Componente para mostrar comparación de productos
function ProductComparison({ result }: { result: FunctionResult }) {
  const { products } = result.data

  // Obtener todas las especificaciones únicas
  const allSpecs = products.reduce((specs: string[], product: any) => {
    return [...new Set([...specs, ...Object.keys(product.specifications)])]
  }, [])

  // Generar insights basados en la comparación
  const generateComparisonInsights = () => {
    // Encontrar el producto con mejor valoración
    const bestRated = [...products].sort((a, b) => b.rating - a.rating)[0]

    // Encontrar el producto más económico
    const mostAffordable = [...products].sort((a, b) => a.price - b.price)[0]

    // Encontrar el producto con mejor relación calidad-precio
    const bestValue = [...products].sort((a, b) => b.rating / b.price - a.rating / a.price)[0]

    const insights = [
      `He comparado ${products.length} productos con precios que varían entre $${Math.min(...products.map((p) => p.price)).toFixed(2)} y $${Math.max(...products.map((p) => p.price)).toFixed(2)}.`,
      `El producto "${bestRated.name}" tiene la mejor valoración con ${bestRated.rating}★, mientras que "${mostAffordable.name}" es el más económico a $${mostAffordable.price.toFixed(2)}.`,
      `En términos de relación calidad-precio, "${bestValue.name}" ofrece el mejor equilibrio entre valoración y costo.`,
    ]

    const recommendations = [
      `Si buscas la mejor calidad sin importar el precio, te recomiendo "${bestRated.name}".`,
      `Si tu prioridad es el presupuesto, "${mostAffordable.name}" es tu mejor opción.`,
      `Para un equilibrio óptimo entre calidad y precio, considera "${bestValue.name}" como la opción más inteligente.`,
    ]

    return { insights, recommendations }
  }

  const { insights, recommendations } = generateComparisonInsights()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{result.title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 text-left font-medium text-gray-500 border-b"></th>
              {products.map((product: any) => (
                <th key={product.id} className="p-3 text-left font-medium border-b min-w-[200px]">
                  {product.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-3 border-b font-medium text-gray-500">Imagen</td>
              {products.map((product: any) => (
                <td key={`${product.id}-image`} className="p-3 border-b">
                  <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b font-medium text-gray-500">Precio</td>
              {products.map((product: any) => (
                <td key={`${product.id}-price`} className="p-3 border-b font-bold">
                  ${product.price.toFixed(2)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-3 border-b font-medium text-gray-500">Valoración</td>
              {products.map((product: any) => (
                <td key={`${product.id}-rating`} className="p-3 border-b">
                  <div className="flex items-center text-yellow-500">
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                    <span className="ml-1 text-gray-500">{product.rating}</span>
                  </div>
                </td>
              ))}
            </tr>
            {allSpecs.map((spec) => (
              <tr key={spec}>
                <td className="p-3 border-b font-medium text-gray-500">{spec}</td>
                {products.map((product: any) => (
                  <td key={`${product.id}-${spec}`} className="p-3 border-b">
                    {product.specifications[spec] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interpretación de IA */}
      <AIInsight insights={insights} recommendations={recommendations} type="chart" />
    </div>
  )
}

// Componente para mostrar errores
function ErrorResult({ result }: { result: FunctionResult }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-red-50 text-red-500 rounded-full p-4 mb-4">
        <AlertCircle className="h-12 w-12" />
      </div>
      <h2 className="text-xl font-semibold text-red-600 mb-2">{result.title}</h2>
      <p className="text-gray-600 max-w-md">{result.data.error}</p>
      <Button variant="outline" className="mt-6">
        Intentar de nuevo
      </Button>
    </div>
  )
}

// Componente para mostrar resultados genéricos
function GenericResult({ result }: { result: FunctionResult }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{result.title}</h2>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">{JSON.stringify(result.data, null, 2)}</pre>
    </div>
  )
}

// Componente para mostrar un resumen del resultado en el historial
function ResultSummary({ result }: { result: FunctionResult }) {
  switch (result.type) {
    case "search":
      return <p className="text-sm text-gray-600">{result.data.total} productos encontrados</p>
    case "filter":
      return <p className="text-sm text-gray-600">{result.data.total} productos filtrados</p>
    case "product":
      return (
        <p className="text-sm text-gray-600">
          ${result.data.price.toFixed(2)} • {result.data.rating} ★
        </p>
      )
    case "chart":
      return <p className="text-sm text-gray-600">{result.data.products.length} productos comparados</p>
    case "error":
      return <p className="text-sm text-red-500">{result.data.error}</p>
    default:
      return <p className="text-sm text-gray-600">Resultado de operación</p>
  }
}

// Función para obtener el icono según el tipo de resultado
function getIconForResultType(type: FunctionResult["type"]) {
  switch (type) {
    case "search":
      return <Search className="h-4 w-4 text-blue-500" />
    case "filter":
      return <Filter className="h-4 w-4 text-green-500" />
    case "product":
      return <ShoppingCart className="h-4 w-4 text-purple-500" />
    case "chart":
      return <BarChart3 className="h-4 w-4 text-orange-500" />
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />
    default:
      return <Globe className="h-4 w-4 text-gray-500" />
  }
}

// Función para formatear una marca de tiempo
function formatTimestamp(timestamp: Date): string {
  return new Intl.DateTimeFormat("es", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp)
}

// Función para formatear la clave de un filtro
function formatFilterKey(key: string): string {
  const keyMap: Record<string, string> = {
    minPrice: "Precio mínimo",
    maxPrice: "Precio máximo",
    category: "Categoría",
    brand: "Marca",
    rating: "Valoración",
    sort: "Ordenar por",
  }
  return keyMap[key] || key
}

// Función para formatear el valor de un filtro
function formatFilterValue(key: string, value: any): string {
  if (key.includes("Price")) {
    return `$${value}`
  }
  if (key === "rating") {
    return `${value}★+`
  }
  return value.toString()
}
