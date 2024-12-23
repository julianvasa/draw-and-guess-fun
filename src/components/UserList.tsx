import { useUser } from "@/contexts/UserContext";

export const UserList = () => {
  const { users, currentDrawingUser } = useUser();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Users:</span>
      <div className="flex gap-2">
        {users.map((user) => (
          <span
            key={user.id}
            className={`px-2 py-1 text-xs rounded-full ${
              currentDrawingUser === user.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {user.name} {currentDrawingUser === user.id ? "(Drawing)" : ""}
          </span>
        ))}
      </div>
    </div>
  );
};