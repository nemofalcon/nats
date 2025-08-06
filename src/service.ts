import { getKV } from './cache/kv';
import { grantPermission, revokePermission, listPermissions } from './db/sql';
import { createError, ErrorCode } from './types/errors';

export async function grant(data: any) {
  const { apiKey, module, action } = data;
  if (!apiKey || !module || !action) {
    return createError(ErrorCode.INVALID_PAYLOAD, 'Missing required fields');
  }

  try {
    await grantPermission(apiKey, module, action);
    const kv = getKV();
    const perms = await listPermissions(apiKey);
    await kv.put(apiKey, new TextEncoder().encode(JSON.stringify(perms)));
    return { status: 'ok' };
  } catch (err) {
    return createError(ErrorCode.DB_ERROR, 'Failed to grant permission');
  }
}

export async function revoke(data: any) {
  const { apiKey, module, action } = data;
  if (!apiKey || !module || !action) {
    return createError(ErrorCode.INVALID_PAYLOAD, 'Missing required fields');
  }

  try {
    await revokePermission(apiKey, module, action);
    const kv = getKV();
    const perms = await listPermissions(apiKey);
    await kv.put(apiKey, new TextEncoder().encode(JSON.stringify(perms)));
    return { status: 'ok' };
  } catch (err) {
    return createError(ErrorCode.DB_ERROR, 'Failed to revoke permission');
  }
}

export async function check(data: any) {
  const { apiKey, module, action } = data;
  if (!apiKey || !module || !action) {
    return createError(ErrorCode.INVALID_PAYLOAD, 'Missing required fields');
  }

  try {
    const kv = getKV();
    let perms;

    try {
      const entry = await kv.get(apiKey);
      if (entry) {
        perms = JSON.parse(new TextDecoder().decode(entry.value));
      } else {
        perms = await listPermissions(apiKey);
        await kv.put(apiKey, new TextEncoder().encode(JSON.stringify(perms)));
      }
    } catch {
      perms = await listPermissions(apiKey);
      await kv.put(apiKey, new TextEncoder().encode(JSON.stringify(perms)));
    }

    const allowed = perms.some((p: any) => p.module === module && p.action === action);
    return { allowed };
  } catch (err) {
    return createError(ErrorCode.CACHE_ERROR, 'Check failed');
  }
}

export async function list(data: any) {
  const { apiKey } = data;
  if (!apiKey) {
    return createError(ErrorCode.INVALID_PAYLOAD, 'apiKey is required');
  }

  try {
    const kv = getKV();
    let perms;

    const entry = await kv.get(apiKey);
    if (entry) {
      perms = JSON.parse(new TextDecoder().decode(entry.value));
    } else {
      perms = await listPermissions(apiKey);
      await kv.put(apiKey, new TextEncoder().encode(JSON.stringify(perms)));
    }

    return { permissions: perms };
  } catch (err) {
    return createError(ErrorCode.CACHE_ERROR, 'Failed to list permissions');
  }
}
