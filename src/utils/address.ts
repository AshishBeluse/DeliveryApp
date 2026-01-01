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
  let str = s.trim();
  // Remove escaped backslashes and quotes
  str = str.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  
  if (!str.startsWith('{') || !str.endsWith('}')) return null;

  const get = (key: string) => {
    // Match key:value with proper handling of escaped quotes and commas
    const regex = new RegExp(`${key}\\s*:\\s*([^,}]+(?:\\{[^}]*\\}[^,}]*)*)`, 'i');
    const m = str.match(regex);
    if (!m) return '';
    let value = m[1].trim();
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Remove escaped quotes
    value = value.replace(/\\"/g, '"').replace(/\\'/g, "'");
    return clean(value);
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
    // Handle escaped JSON strings (double-encoded)
    let str = raw.trim();
    
    // Remove escaped quotes and backslashes
    if (str.startsWith('"') && str.endsWith('"')) {
      try {
        str = JSON.parse(str);
      } catch {}
    }
    
    // try JSON first
    try {
      const parsed = JSON.parse(str);
      if (parsed && typeof parsed === 'object') {
        // If it's still a string, parse again
        if (typeof parsed === 'string') {
          try {
            const doubleParsed = JSON.parse(parsed);
            if (doubleParsed && typeof doubleParsed === 'object') {
              return doubleParsed as AddrObj;
            }
          } catch {}
        }
        return parsed as AddrObj;
      }
    } catch {}

    // try loose object string "{key:value}" (handles escaped format)
    const loose = parseLooseAddressString(str);
    if (loose) return loose;

    // plain string address -> treat as line1
    return { addressLine1: str };
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
