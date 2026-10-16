import { env } from '../config/env.js';

// In-memory store. Swap for a real database (DATABASE_URL) when persistence ships.
const submissions = [];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LENGTHS = { name: 120, email: 254, company: 160, message: 5000 };

/**
 * Validate a contact payload and return a map of field-level errors.
 * Empty map means the payload is valid.
 */
function validate(body) {
  const errors = {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';

  if (!name) {
    errors.name = 'Name is required.';
  } else if (name.length > MAX_LENGTHS.name) {
    errors.name = `Name must be under ${MAX_LENGTHS.name} characters.`;
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email address.';
  } else if (email.length > MAX_LENGTHS.email) {
    errors.email = `Email must be under ${MAX_LENGTHS.email} characters.`;
  }

  if (company.length > MAX_LENGTHS.company) {
    errors.company = `Company must be under ${MAX_LENGTHS.company} characters.`;
  }

  if (!message) {
    errors.message = 'Message is required.';
  } else if (message.length > MAX_LENGTHS.message) {
    errors.message = `Message must be under ${MAX_LENGTHS.message} characters.`;
  }

  return { errors, clean: { name, email, company, message } };
}

const contactController = {
  /**
   * POST /api/contact
   * Accepts a project inquiry from the landing page form.
   */
  create(req, res) {
    const { errors, clean } = validate(req.body ?? {});

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ ok: false, errors });
    }

    const record = {
      id: `inq_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`,
      ...clean,
      receivedAt: new Date().toISOString(),
    };

    submissions.push(record);

    if (env.NODE_ENV !== 'test') {
      console.log(
        `[opticore-api] new inquiry ${record.id} from ${record.email}` +
          (record.company ? ` (${record.company})` : '')
      );
    }

    // TODO: persist to DATABASE_URL and dispatch a notification email here.

    return res.status(201).json({
      ok: true,
      id: record.id,
      message: 'Thanks. Your inquiry has been received and our team will reply within two business days.',
    });
  },
};

export default contactController;
