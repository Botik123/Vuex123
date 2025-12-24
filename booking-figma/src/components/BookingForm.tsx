import { useState } from 'react';
import { X, Calendar, Clock, User, Users, FileText } from 'lucide-react';
import type { Resource, Booking } from '../App';

interface BookingFormProps {
  resources: Resource[];
  initialDate?: Date;
  onSubmit: (booking: Omit<Booking, 'id'>) => void;
  onClose: () => void;
}

export function BookingForm({ resources, initialDate, onSubmit, onClose }: BookingFormProps) {
  const now = initialDate || new Date();
  now.setMinutes(0, 0, 0);

  const [formData, setFormData] = useState({
    resource_id: resources[0]?.id || '',
    title: '',
    description: '',
    date: now.toISOString().split('T')[0],
    start_time: now.toTimeString().slice(0, 5),
    end_time: (() => {
      const end = new Date(now);
      end.setHours(end.getHours() + 1);
      return end.toTimeString().slice(0, 5);
    })(),
    booked_by: '',
    participants: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resource_id || !formData.title || !formData.booked_by) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.date}T${formData.end_time}`);

    if (endDateTime <= startDateTime) {
      alert('Время окончания должно быть позже времени начала');
      return;
    }

    const participantsList = formData.participants
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    const booking: Omit<Booking, 'id'> = {
      resource_id: formData.resource_id,
      title: formData.title,
      description: formData.description,
      start_time: startDateTime,
      end_time: endDateTime,
      booked_by: formData.booked_by,
      participants: participantsList,
    };

    onSubmit(booking);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Новое бронирование</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Resource Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Ресурс <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.resource_id}
              onChange={(e) => setFormData({ ...formData, resource_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {resources.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name} ({resource.type === 'photographer' && 'Фотограф'}
                  {resource.type === 'conference_room' && 'Конференц-зал'}
                  {resource.type === 'equipment' && 'Оборудование'}
                  {resource.type === 'other' && 'Другое'})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Название <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Встреча с клиентом"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Описание</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Детали бронирования..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Дата <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Начало <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                Окончание <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Booked By */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Забронировал <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.booked_by}
                onChange={(e) => setFormData({ ...formData, booked_by: e.target.value })}
                placeholder="Ваше имя"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Участники</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.participants}
                onChange={(e) => setFormData({ ...formData, participants: e.target.value })}
                placeholder="Имена участников через запятую"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Все участники получат уведомление о бронировании
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                  i
                </div>
              </div>
              <div className="text-sm text-blue-800">
                <p>
                  Система автоматически проверит доступность ресурса в указанное время и
                  предотвратит двойное бронирование.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Создать бронирование
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
