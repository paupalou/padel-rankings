import db from "services/database.ts";
import { Ranking } from "types";

const filename = new URL('', import.meta.url).pathname;
const atomic = db.atomic();

export default {
   run: async () => {
    for await (const res of db.list<Ranking>({ prefix: ["rankings"] })) {
      atomic.set(res.key, { ...res.value, private: true });
    }

    await atomic.commit();
    return `executed database migration ${filename}`
  }
}
