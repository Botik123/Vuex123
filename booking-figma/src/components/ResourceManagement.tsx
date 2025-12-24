import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Camera, DoorOpen, Laptop, Package } from 'lucide-react';
import type { Resource } from '../App';

interface ResourceManagementProps {
  resources: Resource[];
  onAddResource: (resource: Omit<Resource, 'id'>) => void;
  onUpdateResource: (id: string, resource: Partial<Resource>) => void;
  onDeleteResource: (id: string) => void;
}

export function ResourceManagement({
  resources,
  onAddResource,
  onUpdateResource,
  onDeleteResource,
}: ResourceManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
  const [deletingResourceInfo, setDeletingResourceInfo] = useState<{name: string, type: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'other' as Resource['type'],
    description: '',
    responsible_person: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'other',
      description: '',
      responsible_person: '',
    });
    setEditingResource(null);
    setShowForm(false);
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      name: resource.name,
      type: resource.type,
      description: resource.description,
      responsible_person: resource.responsible_person,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.responsible_person) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (editingResource) {
      onUpdateResource(editingResource.id, formData);
    } else {
      onAddResource(formData);
    }

    resetForm();
  };

  const handleDeleteClick = (id: string, name: string, type: string) => {
    setResourceToDelete(id);
    setDeletingResourceInfo({ name, type });
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      onDeleteResource(resourceToDelete);
      setResourceToDelete(null);
      setDeletingResourceInfo(null);
    }
  };

  const cancelDelete = () => {
    setResourceToDelete(null);
    setDeletingResourceInfo(null);
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'photographer':
        return <Camera className="w-5 h-5" />;
      case 'conference_room':
        return <DoorOpen className="w-5 h-5" />;
      case 'equipment':
        return <Laptop className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getResourceTypeName = (type: Resource['type']) => {
    switch (type) {
      case 'photographer':
        return 'Фотограф';
      case 'conference_room':
        return 'Конференц-зал';
      case 'equipment':
        return 'Оборудование';
      default:
        return 'Другое';
    }
  };

  return (
    <>
      {/* Модальное окно подтверждения удаления */}
      {resourceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Удалить ресурс</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Вы уверены, что хотите удалить ресурс
              <span className="font-medium"> "{deletingResourceInfo?.name}"</span>?
            </p>
            
            {deletingResourceInfo && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Тип:</span>
                  <span className="font-medium">{getResourceTypeName(deletingResourceInfo.type as Resource['type'])}</span>
                </div>
              </div>
            )}
            
            <p className="text-sm text-red-600 mb-6">
              ⚠️ Все связанные бронирования также будут удалены.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-gray-900">Управление ресурсами</h2>
              <p className="text-gray-600 text-sm mt-1">
                Добавляйте, редактируйте и удаляйте общие ресурсы организации
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Добавить ресурс
            </button>
          </div>
        </div>

        {/* Resources Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Ресурс
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Тип
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Описание
                  </th>
                  <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Ответственный
                  </th>
                  <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {resources.map((resource) => (
                  <tr key={resource.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="text-gray-400">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div className="text-gray-900">{resource.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {getResourceTypeName(resource.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {resource.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {resource.responsible_person}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(resource)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(resource.id, resource.name, resource.type)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {resources.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-gray-900 mb-2">Нет ресурсов</h3>
                <p className="text-gray-600 mb-4">
                  Начните с добавления первого ресурса
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Добавить ресурс
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-gray-900">
                  {editingResource ? 'Редактировать ресурс' : 'Новый ресурс'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Название <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Конференц-зал А"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Тип <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as Resource['type'] })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="photographer">Фотограф</option>
                    <option value="conference_room">Конференц-зал</option>
                    <option value="equipment">Оборудование</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">Описание</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Детальное описание ресурса..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Ответственное лицо <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.responsible_person}
                    onChange={(e) =>
                      setFormData({ ...formData, responsible_person: e.target.value })
                    }
                    placeholder="Администрация"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingResource ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}