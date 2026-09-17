export type NormalizedRole = 'admin' | 'it_center' | 'shift_head' | 'sttl_head' | 'czl_head' | 'dispatcher' | 'user';

// These four roles all share the same page access defaults below —
// they replace the single consolidated laboratory_manager role with per-position labels.
export const MANAGER_TIER_ROLES: NormalizedRole[] = ['shift_head', 'sttl_head', 'czl_head', 'dispatcher'];
export const isManagerTierRole = (role: NormalizedRole) => (MANAGER_TIER_ROLES as string[]).includes(role);

export type PageAccess = {
  dashboard: boolean;
  // Паспорта section, kept separate from `settings` on purpose: the passport form lives on
  // the template page, and Начальник смены needs it without access to all of Настройки.
  passports: boolean;
  settings: boolean;
};

const PAGE_ACCESS_STORAGE_KEY = 'page_access';

export const normalizeRole = (rawRole: string | null): NormalizedRole => {
  const value = String(rawRole || '').trim().toLowerCase();
  if (value === 'admin' || value === 'админ') return 'admin';
  if (value === 'it_center' || value === 'it-center' || value === 'it center') return 'it_center';
  if (value === 'shift_head' || value === 'начальник смены') return 'shift_head';
  if (value === 'sttl_head' || value === 'начальник сттл') return 'sttl_head';
  if (value === 'czl_head' || value === 'начальник цзл') return 'czl_head';
  if (value === 'dispatcher' || value === 'диспетчер') return 'dispatcher';
  return 'user';
};

export const getDefaultPageAccess = (role: NormalizedRole): PageAccess => {
  if (role === 'admin' || role === 'it_center') {
    return {
      dashboard: true,
      passports: true,
      settings: true,
    };
  }

  if (isManagerTierRole(role)) {
    return {
      dashboard: true,
      passports: true,
      settings: true,
    };
  }

  // `passports` defaults to true for every role — the section used to be shown to all
  // authenticated users, so defaulting it off would silently take it away.
  return {
    dashboard: true,
    passports: true,
    settings: false,
  };
};

export const normalizePageAccess = (rawPageAccess: any, role: NormalizedRole): PageAccess => {
  const defaults = getDefaultPageAccess(role);
  if (!rawPageAccess || typeof rawPageAccess !== 'object') {
    return defaults;
  }

  return {
    dashboard: typeof rawPageAccess.dashboard === 'boolean' ? rawPageAccess.dashboard : defaults.dashboard,
    passports: typeof rawPageAccess.passports === 'boolean' ? rawPageAccess.passports : defaults.passports,
    settings: typeof rawPageAccess.settings === 'boolean' ? rawPageAccess.settings : defaults.settings,
  };
};

export const getStoredPageAccess = (role?: NormalizedRole): PageAccess => {
  const resolvedRole = role || normalizeRole(localStorage.getItem('role'));
  const defaults = getDefaultPageAccess(resolvedRole);
  const rawValue = localStorage.getItem(PAGE_ACCESS_STORAGE_KEY);

  if (!rawValue) {
    return defaults;
  }

  try {
    return normalizePageAccess(JSON.parse(rawValue), resolvedRole);
  } catch {
    return defaults;
  }
};

export const storePageAccess = (pageAccess: PageAccess) => {
  localStorage.setItem(PAGE_ACCESS_STORAGE_KEY, JSON.stringify(pageAccess));
};

export const clearStoredPageAccess = () => {
  localStorage.removeItem(PAGE_ACCESS_STORAGE_KEY);
};

export const getFirstAccessibleRoute = (pageAccess: PageAccess) => {
  if (pageAccess.dashboard) return '/';
  if (pageAccess.passports) return '/pasporta';
  if (pageAccess.settings) return '/nastroyka';
  return null;
};
