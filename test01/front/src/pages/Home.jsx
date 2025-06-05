import { Link } from 'react-router-dom';

const Home = () => {
  const features = [
    {
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      title: "Clientes",
      description: "Gerencie informações de clientes",
      path: "/clientes",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
      title: "Produtos",
      description: "Controle seu catálogo de produtos",
      path: "/produtos",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
      title: "Pedidos",
      description: "Gerencie pedidos e vendas",
      path: "/pedidos",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      title: "Vendedores",
      description: "Administre sua equipe de vendas",
      path: "/vendedores",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 tracking-tight">
              Sistema de Pedidos
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Gerencie seus clientes, produtos, pedidos e vendedores de forma eficiente e moderna. 
              Uma solução completa para o seu negócio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/clientes" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Começar Agora
              </Link>
              <Link 
                to="/pedidos" 
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-lg hover:bg-gray-700/50 hover:border-gray-500 transition-all duration-200 font-semibold text-lg"
              >
                Ver Pedidos
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center text-gray-100 mb-12">
          Funcionalidades Principais
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.path}
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-700/80 transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50 group hover:shadow-lg transform hover:-translate-y-1"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={feature.icon}></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-y border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-300 text-lg">Controle Total</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-gray-300 text-lg">Disponibilidade</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
                ∞
              </div>
              <div className="text-gray-300 text-lg">Escalabilidade</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
