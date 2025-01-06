import { useUser } from "@/contexts/UserContext";

export const ActiveUsersList = () => {
  const { users, currentDrawingUser } = useUser();

  return (
    <div className="w-48 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-sm font-semibold mb-3">Active Users</h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className={`px-3 py-2 text-sm rounded-md ${
              currentDrawingUser === user.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary"
            }`}
          >
            {user.name} {currentDrawingUser === user.id ? "(Drawing)" : ""}
          </div>
        ))}
      </div>
    </div>
  );
};