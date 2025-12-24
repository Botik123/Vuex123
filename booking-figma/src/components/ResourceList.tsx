import { Camera, DoorOpen, Laptop, Package, Clock } from 'lucide-react';
import type { Resource, Booking } from '../App';

interface ResourceListProps {
  resources: Resource[];
  bookings: Booking[];
}

export function ResourceList({ resources, bookings }: ResourceListProps) {
  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'photographer':
        return <Camera className="w-6 h-6" />;
      case 'conference_room':
        return <DoorOpen className="w-6 h-6" />;
      case 'equipment':
        return <Laptop className="w-6 h-6" />;
      default:
        return <Package className="w-6 h-6" />;
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

  const getUpcomingBookingsCount = (resourceId: string) => {
    const now = new Date();
    return bookings.filter(
      (b) => b.resource_id === resourceId && new Date(b.start_time) > now
    ).length;
  };

  const getNextBooking = (resourceId: string) => {
    const now = new Date();
    const upcoming = bookings
      .filter((b) => b.resource_id === resourceId && new Date(b.start_time) > now)
      .sort((a, b) => a.start_time.getTime() - b.start_time.getTime());
    
    return upcoming[0] || null;
  };

  const isCurrentlyBooked = (resourceId: string) => {
    const now = new Date();
    return bookings.some(
      (b) =>
        b.resource_id === resourceId &&
        new Date(b.start_time) <= now &&
        new Date(b.end_time) > now
    );
  };

  const groupedResources = resources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<Resource['type'], Resource[]>);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">{resources.length}</div>
              <div className="text-sm text-gray-600">Всего ресурсов</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <DoorOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">
                {resources.filter((r) => r.type === 'conference_room').length}
              </div>
              <div className="text-sm text-gray-600">Конференц-залы</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Camera className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">
                {resources.filter((r) => r.type === 'photographer').length}
              </div>
              <div className="text-sm text-gray-600">Фотографы</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Laptop className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl text-gray-900">
                {resources.filter((r) => r.type === 'equipment').length}
              </div>
              <div className="text-sm text-gray-600">Оборудование</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resource Groups */}
      {Object.entries(groupedResources).map(([type, resourcesInGroup]) => (
        <div key={type} className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-gray-400">
                {getResourceIcon(type as Resource['type'])}
              </div>
              <h2 className="text-gray-900">
                {getResourceTypeName(type as Resource['type'])}
              </h2>
              <span className="text-sm text-gray-500">
                ({resourcesInGroup.length})
              </span>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resourcesInGroup.map((resource) => {
                const upcomingCount = getUpcomingBookingsCount(resource.id);
                const nextBooking = getNextBooking(resource.id);
                const isBusy = isCurrentlyBooked(resource.id);

                return (
                  <div
                    key={resource.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-gray-900">{resource.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {resource.description}
                        </p>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs ${
                          isBusy
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {isBusy ? 'Занят' : 'Свободен'}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>
                          {upcomingCount > 0
                            ? `${upcomingCount} предстоящих`
                            : 'Нет бронирований'}
                        </span>
                      </div>

                      {nextBooking && (
                        <div className="bg-blue-50 rounded p-2 mt-2">
                          <div className="text-xs text-blue-600">Следующее:</div>
                          <div className="text-sm text-blue-900 mt-1">
                            {nextBooking.title}
                          </div>
                          <div className="text-xs text-blue-700 mt-1">
                            {new Date(nextBooking.start_time).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            в{' '}
                            {new Date(nextBooking.start_time).toLocaleTimeString('ru-RU', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Ответственный: {resource.responsible_person}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      {resources.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">Нет ресурсов</h3>
          <p className="text-gray-600">
            Добавьте ресурсы в разделе "Управление"
          </p>
        </div>
      )}
    </div>
  );
}
