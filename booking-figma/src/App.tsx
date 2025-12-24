import { useState } from 'react';
import { Calendar } from './components/Calendar';
import { ResourceList } from './components/ResourceList';
import { BookingForm } from './components/BookingForm';
import { ResourceManagement } from './components/ResourceManagement';
import { CalendarDays, Settings, List } from 'lucide-react';

export interface Resource {
  id: string;
  name: string;
  type: 'photographer' | 'conference_room' | 'equipment' | 'other';
  description: string;
  responsible_person: string;
}

export interface Booking {
  id: string;
  resource_id: string;
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  booked_by: string;
  participants: string[];
}

function App() {
  const [activeView, setActiveView] = useState<'calendar' | 'resources' | 'management'>('calendar');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Моковые данные - ресурсы
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      name: 'Фотограф Иван',
      type: 'photographer',
      description: 'Профессиональный фотограф для корпоративных мероприятий',
      responsible_person: 'Менеджер HR',
    },
    {
      id: '2',
      name: 'Конференц-зал А',
      type: 'conference_room',
      description: 'Большой зал на 30 человек с проектором',
      responsible_person: 'Администрация',
    },
    {
      id: '3',
      name: 'Камера Sony A7',
      type: 'equipment',
      description: 'Профессиональная камера для фото и видео',
      responsible_person: 'IT отдел',
    },
    {
      id: '4',
      name: 'Конференц-зал Б',
      type: 'conference_room',
      description: 'Малый зал на 10 человек',
      responsible_person: 'Администрация',
    },
  ]);

  // Моковые данные - бронирования
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      resource_id: '2',
      title: 'Встреча с клиентом',
      description: 'Презентация нового проекта',
      start_time: new Date(2024, 11, 25, 10, 0),
      end_time: new Date(2024, 11, 25, 12, 0),
      booked_by: 'Алексей Петров',
      participants: ['Алексей Петров', 'Мария Иванова'],
    },
    {
      id: '2',
      resource_id: '1',
      title: 'Фотосессия новых сотрудников',
      description: 'Фото для корпоративного сайта',
      start_time: new Date(2024, 11, 26, 14, 0),
      end_time: new Date(2024, 11, 26, 16, 0),
      booked_by: 'HR отдел',
      participants: ['Екатерина Смирнова', 'Новые сотрудники'],
    },
  ]);

  const handleCreateBooking = (booking: Omit<Booking, 'id'>) => {
    // Проверка на конфликт времени
    const hasConflict = bookings.some(
      (b) =>
        b.resource_id === booking.resource_id &&
        ((booking.start_time >= b.start_time && booking.start_time < b.end_time) ||
          (booking.end_time > b.start_time && booking.end_time <= b.end_time) ||
          (booking.start_time <= b.start_time && booking.end_time >= b.end_time))
    );

    if (hasConflict) {
      alert('⚠️ Конфликт бронирования! Ресурс занят в выбранное время.');
      return;
    }

    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
    };

    setBookings([...bookings, newBooking]);
    setShowBookingForm(false);
    alert('✅ Бронирование успешно создано! Участники получат уведомление.');
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter((b) => b.id !== id));
  };

  const handleAddResource = (resource: Omit<Resource, 'id'>) => {
    const newResource: Resource = {
      ...resource,
      id: Date.now().toString(),
    };
    setResources([...resources, newResource]);
  };

  const handleUpdateResource = (id: string, resource: Partial<Resource>) => {
    setResources(resources.map((r) => (r.id === id ? { ...r, ...resource } : r)));
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
    setBookings(bookings.filter((b) => b.resource_id !== id));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Система бронирования ресурсов</h1>
              <p className="text-gray-600 text-sm mt-1">
                Управление общими ресурсами организации
              </p>
            </div>
            <button
              onClick={() => setShowBookingForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Новое бронирование
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveView('calendar')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                activeView === 'calendar'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarDays className="w-5 h-5" />
              Календарь
            </button>
            <button
              onClick={() => setActiveView('resources')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                activeView === 'resources'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-5 h-5" />
              Ресурсы
            </button>
            <button
              onClick={() => setActiveView('management')}
              className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                activeView === 'management'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-5 h-5" />
              Управление
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'calendar' && (
          <Calendar
            bookings={bookings}
            resources={resources}
            selectedResource={selectedResource}
            onResourceSelect={setSelectedResource}
            onDateClick={handleDateClick}
            onDeleteBooking={handleDeleteBooking}
          />
        )}

        {activeView === 'resources' && (
          <ResourceList resources={resources} bookings={bookings} />
        )}

        {activeView === 'management' && (
          <ResourceManagement
            resources={resources}
            onAddResource={handleAddResource}
            onUpdateResource={handleUpdateResource}
            onDeleteResource={handleDeleteResource}
          />
        )}
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          resources={resources}
          initialDate={selectedDate}
          onSubmit={handleCreateBooking}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}

export default App;
