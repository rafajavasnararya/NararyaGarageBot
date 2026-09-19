# API Contract
GET /api/health returns service health.
GET /api/brands returns the three business brands.
GET /api/version returns application version and runtime.
Payment provider response must contain a status field.
PAID, SUCCESS and SETTLED map to VERIFIED.
INVALID, FAILED, NOT_FOUND, EXPIRED and CANCELLED map to INVALID.
Other values map to UNKNOWN.
UNKNOWN must never be presented as a successful payment.
The bot should use signed webhooks in production.