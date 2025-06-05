import { useState, useEffect } from 'react';
import CreateForm from './CreateForm';
import DataTable from './DataTable';
import EditModal from './EditModal';

const CrudPage = ({ 
  title, 
  service, 
  fields, 
  columns,
  relationshipFields = {},
  emptyMessage,
  emptyDescription
}) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
  const [editingId, setEditingId] = useState(null);
  const [editingItem, setEditingItem] = useState(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
  const [relationshipData, setRelationshipData] = useState({});
  const [loadingRelationships, setLoadingRelationships] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadItems();
    loadRelationshipData();
  }, []);

  const loadRelationshipData = async () => {
    if (Object.keys(relationshipFields).length === 0) return;
    
    setLoadingRelationships(true);
    try {
      const promises = Object.entries(relationshipFields).map(async ([fieldName, config]) => {
        const data = await config.service();
        return [fieldName, data];
      });
      
      const results = await Promise.all(promises);
      const relationshipMap = Object.fromEntries(results);
      setRelationshipData(relationshipMap);
    } catch (error) {
      console.error('Erro ao carregar dados de relacionamento:', error);
    } finally {
      setLoadingRelationships(false);
    }
  };

  const handleProductSelect = (productId, isEditing = false) => {
    const product = relationshipData.id_produto?.find(p => p.id === parseInt(productId));
    if (product && product.preco_unitario) {
      if (isEditing) {
        setEditingItem(prev => ({
          ...prev,
          id_produto: productId,
          preco_unitario: prev.preco_unitario || product.preco_unitario
        }));
      } else {
        setNewItem(prev => ({
          ...prev,
          id_produto: productId,
          preco_unitario: prev.preco_unitario || product.preco_unitario
        }));
      }
    } else {
      if (isEditing) {
        setEditingItem(prev => ({ ...prev, id_produto: productId }));
      } else {
        setNewItem(prev => ({ ...prev, id_produto: productId }));
      }
    }
  };

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await service.list();
      setItems(data);
    } catch (error) {
      console.error('Erro ao carregar itens:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (e) => {
    e.preventDefault();
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = ['nome', 'id_cliente', 'id_vendedor', 'id_pedido', 'id_produto', 'quantidade', 'preco_unitario'];
    const fieldsToCheck = requiredFields.filter(field => fields.includes(field));
    
    const hasAllRequiredFields = fieldsToCheck.every(field => {
      const value = newItem[field];
      return value && value.toString().trim();
    });
    
    if (!hasAllRequiredFields) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      // Converter valores numéricos conforme necessário
      const processedItem = { ...newItem };
      
      // Converter campos numéricos
      if (processedItem.preco_unitario) processedItem.preco_unitario = parseFloat(processedItem.preco_unitario);
      if (processedItem.valor_total) processedItem.valor_total = parseFloat(processedItem.valor_total);
      if (processedItem.quantidade) processedItem.quantidade = parseInt(processedItem.quantidade);
      if (processedItem.estoque) processedItem.estoque = parseInt(processedItem.estoque);
      if (processedItem.id_cliente) processedItem.id_cliente = parseInt(processedItem.id_cliente);
      if (processedItem.id_vendedor) processedItem.id_vendedor = parseInt(processedItem.id_vendedor);
      if (processedItem.id_pedido) processedItem.id_pedido = parseInt(processedItem.id_pedido);
      if (processedItem.id_produto) processedItem.id_produto = parseInt(processedItem.id_produto);
      
      await service.create(processedItem);
      setNewItem(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
      loadItems();
    } catch (error) {
      console.error('Erro ao criar item:', error);
      alert('Erro ao criar item: ' + error.message);
    }
  };

  const startEditing = (id, item) => {
    setEditingId(id);
    setEditingItem(item);
  };

  const saveEditing = async () => {
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = ['nome', 'id_cliente', 'id_vendedor', 'id_pedido', 'id_produto', 'quantidade', 'preco_unitario'];
    const fieldsToCheck = requiredFields.filter(field => fields.includes(field));
    
    const hasAllRequiredFields = fieldsToCheck.every(field => {
      const value = editingItem[field];
      return value && value.toString().trim();
    });
    
    if (!hasAllRequiredFields) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      // Converter valores numéricos conforme necessário
      const processedItem = { ...editingItem };
      
      // Converter campos numéricos
      if (processedItem.preco_unitario) processedItem.preco_unitario = parseFloat(processedItem.preco_unitario);
      if (processedItem.valor_total) processedItem.valor_total = parseFloat(processedItem.valor_total);
      if (processedItem.quantidade) processedItem.quantidade = parseInt(processedItem.quantidade);
      if (processedItem.estoque) processedItem.estoque = parseInt(processedItem.estoque);
      if (processedItem.id_cliente) processedItem.id_cliente = parseInt(processedItem.id_cliente);
      if (processedItem.id_vendedor) processedItem.id_vendedor = parseInt(processedItem.id_vendedor);
      if (processedItem.id_pedido) processedItem.id_pedido = parseInt(processedItem.id_pedido);
      if (processedItem.id_produto) processedItem.id_produto = parseInt(processedItem.id_produto);
      
      await service.update(editingId, processedItem);
      setEditingId(null);
      setEditingItem(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
      loadItems();
    } catch (error) {
      console.error('Erro ao editar item:', error);
      alert('Erro ao editar item: ' + error.message);
    }
  };

  const deleteItem = async (id) => {
      try {
        await service.delete(id);
        loadItems();
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item: ' + error.message);
      }
  };

  const closeModal = () => {
    setEditingId(null);
    setEditingItem(fields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header Section */}
      <div className="bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 sticky top-0 z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
            {title}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mt-4 shadow-lg"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Create Form */}
        <CreateForm
          title="Criar Novo Item"
          fields={fields}
          formData={newItem}
          onChange={setNewItem}
          onSubmit={createItem}
          relationshipFields={relationshipFields}
          relationshipData={relationshipData}
          loadingRelationships={loadingRelationships}
          onProductSelect={handleProductSelect}
        />

        {/* Data Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-18h2a2 2 0 012 2v11a2 2 0 01-2 2H9m0-18v18"></path>
              </svg>
            </div>
            Registros Cadastrados
          </h2>
          
          <DataTable
            data={items}
            columns={columns}
            onEdit={startEditing}
            onDelete={deleteItem}
            loading={loading}
            emptyMessage={emptyMessage}
            emptyDescription={emptyDescription}
          />
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={!!editingId}
          onClose={closeModal}
          title="Editar Item"
          fields={fields}
          formData={editingItem}
          onChange={setEditingItem}
          onSave={saveEditing}
          relationshipFields={relationshipFields}
          relationshipData={relationshipData}
          loadingRelationships={loadingRelationships}
          onProductSelect={handleProductSelect}
        />
      </div>
    </div>
  );
};

export default CrudPage;
