export function LogoutButton() {
  return (
    <form action="/api/auth/signout" method="post">
      <button className="btn" type="submit">Logout</button>
    </form>
  );
}
