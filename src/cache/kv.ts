import { connect, KV } from 'nats';
import dotenv from 'dotenv';

dotenv.config();

let kv: KV;

export async function initKV() {
  const nc = await connect({ servers: process.env.NATS_URL });
  const js = nc.jetstream();
  kv = await js.views.kv('permissions_cache'); 
}

export function getKV() {
  if (!kv) throw new Error('KV not initialized');
  return kv;
}
