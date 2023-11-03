const time = new Date().valueOf();
const topic = prompt("Describes the migration");

await Deno.create(`migrations/${time}-${topic?.replaceAll(" ", "_")}.ts`);
