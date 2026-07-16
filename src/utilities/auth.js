export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

// =============================================================================
// NAMETAG PASSWORD VALIDATION (mirrors Laravel PasswordRules.php +
// config/password_policy.php + NotCommonPassword.php)
// =============================================================================

export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 15,

  DENYLIST: [
    "password@123",
    "admin@123",
    "password123",
    "admin123",
    "password1",
    "admin1",
    "welcome@123",
    "welcome123",
    "qwerty@123",
    "qwerty123",
    "letmein123",
    "login@123",
    "user@123",
    "test@123",
    "nametag@123",
    "ethio@123",
    "p@ssw0rd",
    "passw0rd",
    "changeme",
    "changeme123",
  ],

  FORBIDDEN_BASES: [
    "password",
    "admin",
    "welcome",
    "qwerty",
    "letmein",
    "login",
    "user",
    "guest",
    "test",
    "nametag",
    "ethio",
    "telebirr",
    "master",
    "root",
    "default",
    "account",
    "secret",
  ],

  MESSAGES: {
    REQUIRED: "Password is required.",
    MIN_LENGTH: "Password must be at least 8 characters.",
    MAX_LENGTH: "Password must not exceed 15 characters.",
    UPPERCASE: "Password must include at least one uppercase letter.",
    LOWERCASE: "Password must include at least one lowercase letter.",
    NUMBER: "Password must include at least one number.",
    SPECIAL: "Password must include at least one special character.",
    CONFIRM_REQUIRED: "Password confirmation is required.",
    CONFIRM_MISMATCH: "Password confirmation does not match.",
    TOO_COMMON:
      "This password is too common or easy to guess. Please choose a more unique password.",
    MATCHES_USERNAME:
      "Password cannot be the same as or contain your username.",
    POLICY:
      "Password must be 8 to 15 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
  },
};

const { MIN_LENGTH, MAX_LENGTH, DENYLIST, FORBIDDEN_BASES, MESSAGES } =
  PASSWORD_POLICY;

export const passwordChecks = {
  minLength: (password) => password.length >= MIN_LENGTH,
  maxLength: (password) => password.length <= MAX_LENGTH,
  hasUppercase: (password) => /[A-Z]/.test(password),
  hasLowercase: (password) => /[a-z]/.test(password),
  hasNumber: (password) => /[0-9]/.test(password),
  hasSpecial: (password) => /[^A-Za-z0-9]/.test(password),
  hasLetter: (password) => /[A-Za-z]/.test(password),
};

export function isDenylisted(password) {
  const normalized = password.toLowerCase();
  return DENYLIST.some((blocked) => normalized === blocked.toLowerCase());
}

export function matchesForbiddenBasePattern(password) {
  const normalized = password.toLowerCase();

  return FORBIDDEN_BASES.some((base) => {
    const baseLower = base.toLowerCase();
    if (!normalized.startsWith(baseLower)) return false;

    const remainder = normalized.slice(baseLower.length);
    if (remainder === "") return true;

    return /^[^a-z]*$/.test(remainder);
  });
}

export function matchesUsername(password, username) {
  if (!username || typeof username !== "string") return false;

  const normalizedPassword = password.toLowerCase();
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername) return false;

  return (
    normalizedPassword === normalizedUsername ||
    normalizedPassword.includes(normalizedUsername)
  );
}

function validatePasswordCore(password, username) {
  const errors = [];

  if (!password || password.trim() === "") {
    errors.push(MESSAGES.REQUIRED);
    return errors;
  }

  if (!passwordChecks.minLength(password)) errors.push(MESSAGES.MIN_LENGTH);
  if (!passwordChecks.maxLength(password)) errors.push(MESSAGES.MAX_LENGTH);
  if (!passwordChecks.hasUppercase(password)) errors.push(MESSAGES.UPPERCASE);
  if (!passwordChecks.hasLowercase(password)) errors.push(MESSAGES.LOWERCASE);
  if (!passwordChecks.hasNumber(password)) errors.push(MESSAGES.NUMBER);
  if (!passwordChecks.hasSpecial(password)) errors.push(MESSAGES.SPECIAL);

  if (isDenylisted(password) || matchesForbiddenBasePattern(password)) {
    errors.push(MESSAGES.TOO_COMMON);
  }

  if (matchesUsername(password, username)) {
    errors.push(MESSAGES.MATCHES_USERNAME);
  }

  return errors;
}

export function validateRegistrationPassword(password, username) {
  return validatePasswordCore(password, username);
}

export function validateNewPassword(password, passwordConfirmation, username) {
  const errors = validatePasswordCore(password, username);

  if (!passwordConfirmation || passwordConfirmation.trim() === "") {
    errors.push(MESSAGES.CONFIRM_REQUIRED);
  } else if (password !== passwordConfirmation) {
    errors.push(MESSAGES.CONFIRM_MISMATCH);
  }

  return errors;
}

export function validateOptionalPassword(password, username) {
  if (!password || password.trim() === "") return [];
  return validatePasswordCore(password, username);
}

export function isPasswordValid(password, options = {}) {
  const {
    passwordConfirmation,
    username,
    mode = "registration",
  } = options;

  let errors = [];

  if (mode === "optional") {
    errors = validateOptionalPassword(password, username);
  } else if (mode === "newPassword") {
    errors = validateNewPassword(password, passwordConfirmation, username);
  } else {
    errors = validateRegistrationPassword(password, username);
  }

  return errors.length === 0;
}

/** react-hook-form validate helper — returns `true` or first error message. */
export function validatePasswordField(password, username, mode = "registration") {
  const errors =
    mode === "optional"
      ? validateOptionalPassword(password, username)
      : validateRegistrationPassword(password, username);

  return errors[0] || true;
}

/** react-hook-form validate helper for confirm password field. */
export function validateConfirmPasswordField(password, passwordConfirmation) {
  if (!passwordConfirmation || passwordConfirmation.trim() === "") {
    return MESSAGES.CONFIRM_REQUIRED;
  }
  if (password !== passwordConfirmation) {
    return MESSAGES.CONFIRM_MISMATCH;
  }
  return true;
}
