import type { AvailableFunction } from "./types"

// Funciones simuladas que el asistente puede llamar
export const availableFunctions: AvailableFunction[] = [
  {
    name: "search_products",
    description: "Busca productos en el sitio web actual",
    parameters: {
      query: {
        type: "string",
        description: "Término de búsqueda",
      },
      filters: {
        type: "object",
        description: "Filtros opcionales para la búsqueda",
        properties: {
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
          category: { type: "string" },
          brand: { type: "string" },
        },
      },
    },
    execute: async ({ query, filters }) => {
      // Simulación de búsqueda
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        total: 128,
        page: 1,
        totalPages: 13,
        products: [
          {
            id: 1,
            name: `${query} Premium`,
            price: 129.99,
            rating: 4.5,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 2,
            name: `${query} Standard`,
            price: 79.99,
            rating: 4.2,
            image: "/placeholder.svg?height=100&width=100",
          },
          { id: 3, name: `${query} Basic`, price: 49.99, rating: 3.8, image: "/placeholder.svg?height=100&width=100" },
          { id: 4, name: `${query} Pro`, price: 199.99, rating: 4.7, image: "/placeholder.svg?height=100&width=100" },
          { id: 5, name: `${query} Ultra`, price: 249.99, rating: 4.9, image: "/placeholder.svg?height=100&width=100" },
        ],
      }
    },
  },
  {
    name: "apply_filters",
    description: "Aplica filtros a los resultados actuales",
    parameters: {
      filters: {
        type: "object",
        description: "Filtros para aplicar",
        properties: {
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
          category: { type: "string" },
          brand: { type: "string" },
          rating: { type: "number" },
          sort: { type: "string", enum: ["price_asc", "price_desc", "rating", "newest"] },
        },
      },
    },
    execute: async ({ filters }) => {
      // Simulación de filtrado
      await new Promise((resolve) => setTimeout(resolve, 800))

      const sortText =
        filters.sort === "price_asc"
          ? "precio ascendente"
          : filters.sort === "price_desc"
            ? "precio descendente"
            : filters.sort === "rating"
              ? "mejor valorados"
              : "más recientes"

      return {
        total: 42,
        page: 1,
        totalPages: 5,
        appliedFilters: filters,
        sortBy: sortText,
        products: [
          {
            id: 1,
            name: "Producto Filtrado 1",
            price: filters.minPrice || 59.99,
            rating: 4.5,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 2,
            name: "Producto Filtrado 2",
            price: (filters.minPrice || 59.99) + 20,
            rating: 4.2,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 3,
            name: "Producto Filtrado 3",
            price: (filters.minPrice || 59.99) + 40,
            rating: 4.8,
            image: "/placeholder.svg?height=100&width=100",
          },
          {
            id: 4,
            name: "Producto Filtrado 4",
            price: (filters.minPrice || 59.99) + 60,
            rating: 4.0,
            image: "/placeholder.svg?height=100&width=100",
          },
        ],
      }
    },
  },
  {
    name: "get_product_details",
    description: "Obtiene detalles de un producto específico",
    parameters: {
      productId: {
        type: "number",
        description: "ID del producto",
      },
    },
    execute: async ({ productId }) => {
      // Simulación de obtención de detalles
      await new Promise((resolve) => setTimeout(resolve, 1200))

      return {
        id: productId,
        name: `Producto Detallado ${productId}`,
        price: 99.99 + productId * 10,
        rating: 4.5,
        reviews: 128,
        description:
          "Este es un producto de alta calidad con características premium. Incluye garantía de 2 años y envío gratuito.",
        specifications: [
          { name: "Material", value: "Aluminio" },
          { name: "Dimensiones", value: "10 x 15 x 5 cm" },
          { name: "Peso", value: "250g" },
          { name: "Color", value: "Negro" },
        ],
        images: [
          "/placeholder.svg?height=300&width=300",
          "/placeholder.svg?height=300&width=300",
          "/placeholder.svg?height=300&width=300",
        ],
      }
    },
  },
  {
    name: "compare_products",
    description: "Compara varios productos",
    parameters: {
      productIds: {
        type: "array",
        description: "IDs de los productos a comparar",
        items: {
          type: "number",
        },
      },
    },
    execute: async ({ productIds }) => {
      // Simulación de comparación
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        products: productIds.map((id) => ({
          id,
          name: `Producto ${id}`,
          price: 99.99 + id * 10,
          rating: (4 + (id % 10) / 10).toFixed(1),
          specifications: {
            Material: id % 2 === 0 ? "Aluminio" : "Plástico",
            Dimensiones: "10 x 15 x 5 cm",
            Peso: `${200 + id * 50}g`,
            Color: id % 3 === 0 ? "Negro" : id % 3 === 1 ? "Blanco" : "Azul",
            Garantía: id % 2 === 0 ? "2 años" : "1 año",
          },
          image: "/placeholder.svg?height=100&width=100",
        })),
      }
    },
  },
]

// Función para ejecutar una función por nombre
export async function executeFunction(name: string, args: any) {
  const func = availableFunctions.find((f) => f.name === name)
  if (!func) {
    throw new Error(`Función "${name}" no encontrada`)
  }

  try {
    return await func.execute(args)
  } catch (error) {
    console.error(`Error ejecutando función ${name}:`, error)
    throw error
  }
}
