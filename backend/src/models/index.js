const User = require('./User');
const Service = require('./Service');
const Provider = require('./Provider');
const Booking = require('./Booking');
const Review = require('./Review');
const Payment = require('./Payment');
const Role = require('./Role');
const Address = require('./Address');
const ServiceCategory = require('./ServiceCategory');
const BookingStatusHistory = require('./BookingStatusHistory');
const Coupon = require('./Coupon');
const Notification = require('./Notification');
const SupportTicket = require('./SupportTicket');
const Upload = require('./Upload');
const PasswordReset = require('./PasswordReset');

// ─── Role ↔ User ────────────────────────────────────────────────────────────
Role.hasMany(User, { foreignKey: 'role_id' });
User.belongsTo(Role, { foreignKey: 'role_id' });

// ─── User ↔ Provider ─────────────────────────────────────────────────────────
User.hasOne(Provider, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Provider.belongsTo(User, { foreignKey: 'user_id' });

// ─── ServiceCategory ↔ Service ───────────────────────────────────────────────
ServiceCategory.hasMany(Service, { foreignKey: 'category_id' });
Service.belongsTo(ServiceCategory, { foreignKey: 'category_id' });

// ─── Service ↔ Provider ──────────────────────────────────────────────────────
Service.hasMany(Provider, { foreignKey: 'service_id' });
Provider.belongsTo(Service, { foreignKey: 'service_id' });

// ─── User (Customer) ↔ Booking ───────────────────────────────────────────────
User.hasMany(Booking, { foreignKey: 'customer_id', as: 'CustomerBookings' });
Booking.belongsTo(User, { as: 'Customer', foreignKey: 'customer_id' });

// ─── Provider ↔ Booking ──────────────────────────────────────────────────────
Provider.hasMany(Booking, { foreignKey: 'provider_id' });
Booking.belongsTo(Provider, { foreignKey: 'provider_id' });

// ─── Service ↔ Booking ───────────────────────────────────────────────────────
Service.hasMany(Booking, { foreignKey: 'service_id' });
Booking.belongsTo(Service, { foreignKey: 'service_id' });

// ─── Address ↔ User ──────────────────────────────────────────────────────────
User.hasMany(Address, { foreignKey: 'user_id' });
Address.belongsTo(User, { foreignKey: 'user_id' });

// ─── Booking ↔ Review ────────────────────────────────────────────────────────
Booking.hasOne(Review, { foreignKey: 'booking_id' });
Review.belongsTo(Booking, { foreignKey: 'booking_id' });

// ─── User (Customer) ↔ Review ────────────────────────────────────────────────
User.hasMany(Review, { foreignKey: 'customer_id', as: 'CustomerReviews' });
Review.belongsTo(User, { as: 'Customer', foreignKey: 'customer_id' });

// ─── Provider ↔ Review ───────────────────────────────────────────────────────
Provider.hasMany(Review, { foreignKey: 'provider_id' });
Review.belongsTo(Provider, { foreignKey: 'provider_id' });

// ─── Booking ↔ Payment ───────────────────────────────────────────────────────
Booking.hasOne(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

// ─── Booking ↔ BookingStatusHistory ─────────────────────────────────────────
Booking.hasMany(BookingStatusHistory, { foreignKey: 'booking_id' });
BookingStatusHistory.belongsTo(Booking, { foreignKey: 'booking_id' });

// ─── User ↔ Notification ─────────────────────────────────────────────────────
User.hasMany(Notification, { foreignKey: 'user_id' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// ─── User ↔ SupportTicket ────────────────────────────────────────────────────
User.hasMany(SupportTicket, { foreignKey: 'user_id' });
SupportTicket.belongsTo(User, { foreignKey: 'user_id' });

// ─── User ↔ Upload ───────────────────────────────────────────────────────────
User.hasMany(Upload, { foreignKey: 'user_id' });
Upload.belongsTo(User, { foreignKey: 'user_id' });

// ─── User ↔ PasswordReset ────────────────────────────────────────────────────
User.hasMany(PasswordReset, { foreignKey: 'user_id' });
PasswordReset.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  User,
  Service,
  Provider,
  Booking,
  Review,
  Payment,
  Role,
  Address,
  ServiceCategory,
  BookingStatusHistory,
  Coupon,
  Notification,
  SupportTicket,
  Upload,
  PasswordReset,
};
