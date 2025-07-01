// components/products-feature.tsx
export default function ProductsFeature() {
  return (
    <section className="max-w-4xl mx-auto text-center py-32 px-4 space-y-8 text-black bg-white">
      <h3 className="text-2xl font-bold">
        현재 지구에서는<br/>
        이런 물건들이 거래되고 있어요
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="w-full h-48 bg-gray-200 rounded-lg" />
        <div className="w-full h-48 bg-gray-200 rounded-lg" />
        <div className="w-full h-48 bg-gray-200 rounded-lg" />
        <div className="w-full h-48 bg-gray-200 rounded-lg" />
      </div>
    </section>
  )
}
