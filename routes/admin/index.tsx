import Button from "components/button.tsx";
import Section from "components/section.tsx";
import BreadCrumb from "components/breadcrumb.tsx";

export default function AdminPage() {
  return (
    <Section>
      <BreadCrumb
        items={[
          { label: "Admin" },
        ]}
      />

      <div class="border-2 border-slate-300 rounded-lg p-2">
        <h2>DB Management</h2>
        <div class="flex gap-2 mt-2">
          <Button>
            <a href="/admin/database/migrate">Migrate</a>
          </Button>
        </div>
      </div>

      <div class="border-2 border-slate-300 rounded-lg p-2">
        <h2>Rankings</h2>
        <div class="flex gap-2 mt-2">
          <Button>
            <a href="/admin/rankings">List</a>
          </Button>
          <Button>
            <a href="/admin/rankings/create">Create</a>
          </Button>
        </div>
      </div>

      <h2>Players</h2>
      <Button>
        <a href="/admin/players">List</a>
      </Button>
      <Button>
        <a href="/admin/players/create">Create</a>
      </Button>
      <hr />

      <h2>Games</h2>
      <Button>
        <a href="/admin/games">List</a>
      </Button>
      <Button>
        <a href="/admin/games/create">Create</a>
      </Button>
      <hr />

      <br />
      <br />
      <Button>
        <a href="/oauth/signout?success_url=/">Logout</a>
      </Button>
    </Section>
  );
}
