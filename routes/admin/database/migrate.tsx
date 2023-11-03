import { Handlers } from "$fresh/server.ts";

import { Data } from "types";
import { getMigrateVersion, setMigrateVersion } from "services/database.ts";
import BreadCrumb from "components/breadcrumb.tsx";
import Section from "components/section.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const currentMigrationVersion = await getMigrateVersion();
    let files: string[] = [];
    for await (const file of Deno.readDir("./migrations")) {
      files.push(file.name);
    }

    files = files.sort((a, b) => {
      if (a > b) {
        return 1;
      } else if (b > a) {
        return -1;
      }

      return 0;
    });

    if (!files) {
      return ctx.render({ migrated: undefined });
    }

    let lastMigration: string;

    if (currentMigrationVersion) {
      const lastMigrationIndex = files.findIndex((f) =>
        f === currentMigrationVersion.fileName
      );
      if (lastMigrationIndex === files.length) {
        files = [];
      } else {
        files = files.slice(lastMigrationIndex + 1);
      }
    }

    for await (const file of files) {
      await import(`migrations/${file}`);
      lastMigration = file;
    }

    if (lastMigration!) {
      await setMigrateVersion(lastMigration);
    }

    return ctx.render({ migrated: files });
  },
};

export default function MigrateDatabase(
  { data: { migrated } }: Data<{ migrated: string[] }>,
) {
  return (
    <Section>
      <BreadCrumb
        items={[
          { href: "/admin", label: "Admin" },
          { href: ".", label: "Database" },
          { label: "Migrate" },
        ]}
      />

      {migrated === undefined && <span>No migration files exists</span>}
      {migrated.length === 0 && <span>No pending migrations</span>}
      {migrated.map((migration) => (
        <span key={`migration-${migration}`}>
          Migrated file <span class="font-bold">{migration}</span>
        </span>
      ))}
    </Section>
  );
}
