import Button from "components/button.tsx";

export default function AdminPage() {
  return (
    <main>
      <section className="p-4 flex flex-col gap-2">
        <Button>
          <a href="/admin/players">Players</a>
        </Button>

        <Button>
          <a href="/admin/games">Games</a>
        </Button>

        <br />
        <br />

        <Button>
          <a href="/admin/players/create">Create Player</a>
        </Button>
        <Button>
          <a href="/admin/games/create">Create Game</a>
        </Button>
        <br />
        <br />
        <Button>
          <a href="/oauth/signout?success_url=/">Logout</a>
        </Button>
      </section>
    </main>
  );
}
