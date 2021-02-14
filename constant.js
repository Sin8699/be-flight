const ROLE_USER = {
  GUEST: 'GUEST',
  ADMIN: 'ADMIN',
};

const TYPE_SEAT = {
  VIP: 'VIP',
  NORMAL: 'NORMAL',
};

const STATUS_TICKET = {
  PAID: 'paid',
  UNPAID: 'unpaid',
  CANCELED: 'canceled',
};

const ROLE = [ROLE_USER.ADMIN, ROLE_USER.GUEST];

module.exports = {
  ROLE,
  ROLE_USER,
  TYPE_SEAT,
  STATUS_TICKET,
};
