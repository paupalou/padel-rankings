import db from "services/database.ts";
import { Ranking } from "types";

const filename = new URL('', import.meta.url).pathname;
const atomic = db.atomic();

for await (const res of db.list<Ranking>({ prefix: ["rankings"] })) {
  atomic.set(res.key, { ...res.value, private: true });
}


await atomic.commit();
console.debug(`executed database migration ${filename}`)
