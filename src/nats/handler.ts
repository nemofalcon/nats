import { connect, StringCodec } from 'nats';
import { grant, revoke, check, list } from '../service';
import { initKV } from '../cache/kv';
import { logInfo, logError } from '../logger/logger';

const sc = StringCodec();

export async function start() {
  await initKV();
  const nc = await connect({ servers: process.env.NATS_URL });

  nc.subscribe('permissions.grant', {
    callback: async (err, msg) => {
      const data = JSON.parse(sc.decode(msg.data));
      logInfo('Grant called', data);
      const res = await grant(data);
      msg.respond(sc.encode(JSON.stringify(res)));
    }
  });

  nc.subscribe('permissions.revoke', {
    callback: async (err, msg) => {
      const data = JSON.parse(sc.decode(msg.data));
      logInfo('Revoke called', data);
      const res = await revoke(data);
      msg.respond(sc.encode(JSON.stringify(res)));
    }
  });

  nc.subscribe('permissions.check', {
    callback: async (err, msg) => {
      const data = JSON.parse(sc.decode(msg.data));
      logInfo('Check called', data);
      const res = await check(data);
      msg.respond(sc.encode(JSON.stringify(res)));
    }
  });

  nc.subscribe('permissions.list', {
    callback: async (err, msg) => {
      const data = JSON.parse(sc.decode(msg.data));
      logInfo('List called', data);
      const res = await list(data);
      msg.respond(sc.encode(JSON.stringify(res)));
    }
  });

  logInfo('Permission microservice started');
}
