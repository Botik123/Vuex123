import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Clock, User, Users } from 'lucide-react';
import type { Resource, Booking } from '../App';

interface CalendarProps {
  bookings: Booking[];
  resources: Resource[];
  selectedResource: string | null;
  onResourceSelect: (resourceId: string | null) => void;
  onDateClick: (date: Date) => void;
  onDeleteBooking: (id: string) => void;
}

export function Calendar({
  bookings,
  resources,
  selectedResource,
  onResourceSelect,
  onDateClick,
  onDeleteBooking,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [deletingBookingInfo, setDeletingBookingInfo] = useState<{title: string, resourceName?: string} | null>(null);

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8:00 - 21:00

  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getBookingsForDateAndResource = (date: Date, hour: number) => {
    return bookings.filter((booking) => {
      if (selectedResource && booking.resource_id !== selectedResource) {
        return false;
      }

      const bookingDate = new Date(booking.start_time);
      const isSameDay =
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear();

      const bookingHour = bookingDate.getHours();
      const endHour = new Date(booking.end_time).getHours();

      return isSameDay && bookingHour <= hour && hour < endHour;
    });
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const filteredBookings = selectedResource
    ? bookings.filter((b) => b.resource_id === selectedResource)
    : bookings;

  const getResourceById = (id: string) => resources.find((r) => r.id === id);

  const handleDeleteClick = (bookingId: string, bookingTitle: string, resourceName?: string) => {
    setBookingToDelete(bookingId);
    setDeletingBookingInfo({ title: bookingTitle, resourceName });
  };

  const confirmDelete = () => {
    if (bookingToDelete) {
      onDeleteBooking(bookingToDelete);
      setBookingToDelete(null);
      setDeletingBookingInfo(null);
    }
  };

  const cancelDelete = () => {
    setBookingToDelete(null);
    setDeletingBookingInfo(null);
  };

  return (
    <>
      {/* Модальное окно подтверждения удаления */}
      {bookingToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Подтверждение удаления</h3>
            <p className="text-gray-600 mb-2">
              Вы уверены, что хотите удалить бронирование
              <span className="font-medium"> "{deletingBookingInfo?.title}"</span>?
            </p>
            {deletingBookingInfo?.resourceName && (
              <p className="text-gray-600 mb-4">
                Ресурс: <span className="font-medium">{deletingBookingInfo.resourceName}</span>
              </p>
            )}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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

      <div className="bg-white rounded-lg shadow">
        {/* Calendar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goToPreviousWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNextWeek}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <h2 className="text-gray-900 min-w-[250px]">
                {formatDateRange(weekDays[0], weekDays[6])}
              </h2>
              <button
                onClick={goToToday}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Сегодня
              </button>
            </div>
          </div>

          {/* Resource Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600">Фильтр по ресурсу:</span>
            <button
              onClick={() => onResourceSelect(null)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                !selectedResource
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Все
            </button>
            {resources.map((resource) => (
              <button
                key={resource.id}
                onClick={() => onResourceSelect(resource.id)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedResource === resource.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {resource.name}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Day Headers */}
            <div className="grid grid-cols-8 border-b border-gray-200">
              <div className="p-3 bg-gray-50"></div>
              {weekDays.map((day, index) => {
                const isToday =
                  day.toDateString() === new Date().toDateString();
                return (
                  <div
                    key={index}
                    className={`p-3 text-center border-l border-gray-200 ${
                      isToday ? 'bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-xs text-gray-600">
                      {day.toLocaleDateString('ru-RU', { weekday: 'short' })}
                    </div>
                    <div
                      className={`text-lg mt-1 ${
                        isToday ? 'text-blue-600' : 'text-gray-900'
                      }`}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            {hours.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-gray-200">
                <div className="p-3 text-sm text-gray-600 bg-gray-50 border-r border-gray-200">
                  {hour}:00
                </div>
                {weekDays.map((day, dayIndex) => {
                  const dayBookings = getBookingsForDateAndResource(day, hour);
                  const isFirstHourOfBooking = dayBookings.filter((booking) => {
                    return new Date(booking.start_time).getHours() === hour;
                  });

                  return (
                    <div
                      key={dayIndex}
                      onClick={() => {
                        const clickDate = new Date(day);
                        clickDate.setHours(hour, 0, 0, 0);
                        onDateClick(clickDate);
                      }}
                      className="relative border-l border-gray-200 min-h-[60px] hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      {isFirstHourOfBooking.map((booking) => {
                        const resource = getResourceById(booking.resource_id);
                        const startHour = new Date(booking.start_time).getHours();
                        const endHour = new Date(booking.end_time).getHours();
                        const duration = endHour - startHour;

                        return (
                          <div
                            key={booking.id}
                            onClick={(e) => e.stopPropagation()}
                            className="absolute inset-x-1 top-1 bg-blue-100 border-l-4 border-blue-600 rounded p-2 text-xs group"
                            style={{ height: `calc(${duration * 60}px - 8px)` }}
                          >
                            <div className="flex items-start justify-between gap-1">
                              <div className="flex-1 min-w-0">
                                <div className="text-blue-900 truncate">
                                  {booking.title}
                                </div>
                                <div className="text-blue-700 text-xs mt-1 truncate">
                                  {resource?.name}
                                </div>
                                <div className="flex items-center gap-1 text-blue-600 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(booking.start_time).toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                  -
                                  {new Date(booking.end_time).toLocaleTimeString('ru-RU', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteClick(booking.id, booking.title, resource?.name)}
                                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Bookings List */}
        {filteredBookings.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h3 className="text-gray-900 mb-4">Ближайшие бронирования</h3>
            <div className="space-y-3">
              {filteredBookings
                .sort((a, b) => a.start_time.getTime() - b.start_time.getTime())
                .slice(0, 5)
                .map((booking) => {
                  const resource = getResourceById(booking.resource_id);
                  return (
                    <div
                      key={booking.id}
                      className="bg-white p-4 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-gray-900">{booking.title}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {resource?.name}
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(booking.start_time).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'short',
                              })}{' '}
                              {new Date(booking.start_time).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              -
                              {new Date(booking.end_time).toLocaleTimeString('ru-RU', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {booking.booked_by}
                            </div>
                            {booking.participants.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {booking.participants.length}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteClick(booking.id, booking.title, resource?.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}