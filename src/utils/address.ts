type AddrObj = {
  latitude?: number;
  longitude?: number;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  label?: string;
  lat?: number;
  lng?: number;
};

const clean = (v: unknown) =>
  String(v ?? '')
    .replace(/"/g, '')
    .trim();

function parseLooseAddressString(s: string): AddrObj | null {
  const str = s.trim();
  if (!str.startsWith('{') || !str.endsWith('}')) return null;

  const get = (key: string) => {
    const m = str.match(new RegExp(`${key}\\s*:\\s*([^,}]+)`, 'i'));
    return m ? clean(m[1]) : '';
  };

  const lat = Number(get('latitude') || get('lat'));
  const lng = Number(get('longitude') || get('lng'));

  const obj: AddrObj = {
    latitude: Number.isFinite(lat) ? lat : undefined,
    longitude: Number.isFinite(lng) ? lng : undefined,
    addressLine1: get('addressLine1') || undefined,
    addressLine2: get('addressLine2') || undefined,
    city: get('city') || undefined,
    state: get('state') || undefined,
    zip: get('zip') || undefined,
    label: get('label') || undefined,
  };

  if (
    !obj.addressLine1 &&
    !obj.addressLine2 &&
    !obj.city &&
    !obj.state &&
    !obj.zip &&
    !obj.latitude &&
    !obj.longitude
  ) {
    return null;
  }
  return obj;
}

export function getAddressObj(raw: unknown): AddrObj | null {
  if (!raw) return null;

  // object already
  if (typeof raw === 'object') return raw as AddrObj;

  // string
  if (typeof raw === 'string') {
    // try JSON first
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed as AddrObj;
    } catch {}

    // try loose object string "{key:value}"
    const loose = parseLooseAddressString(raw);
    if (loose) return loose;

    // plain string address -> treat as line1
    return { addressLine1: raw };
  }

  return null;
}

export function formatDeliveryAddress(raw: unknown): string {
  const o = getAddressObj(raw);
  if (!o) return 'No Address';

  const line1 = clean(o.addressLine1);
  const line2 = clean(o.addressLine2);
  const city = clean(o.city);
  const state = clean(o.state);
  const zip = clean(o.zip);
  const label = clean(o.label);

  const cityLine = [city, state, zip].filter(Boolean).join(', ');

  const parts = [line1, line2, cityLine, label].filter(
    p => p && p !== 'null' && p !== 'undefined',
  );
  return parts.length ? parts.join('\n') : 'No Address';
}

export function extractLatLng(raw: unknown): {
  latitude?: number;
  longitude?: number;
} {
  const o = getAddressObj(raw);
  if (!o) return {};

  const lat = Number(o.latitude ?? o.lat);
  const lng = Number(o.longitude ?? o.lng);

  return {
    latitude: Number.isFinite(lat) ? lat : undefined,
    longitude: Number.isFinite(lng) ? lng : undefined,
  };
}
