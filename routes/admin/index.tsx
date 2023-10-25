import Button from "components/button.tsx";

export default function AdminPage() {
  return (
    <main>
      <section className="p-4 flex flex-col gap-2">
        <h2> Rankings </h2>
        <Button>
          <a href="/admin/rankings">List</a>
        </Button>
        <Button>
          <a href="/admin/rankings/create">Create</a>
        </Button>
        <hr />

        <h2> Players </h2>
        <Button>
          <a href="/admin/players">List</a>
        </Button>
        <Button>
          <a href="/admin/players/create">Create</a>
        </Button>
        <hr />

        <h2> Games </h2>
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
      </section>
    </main>
  );
}
