import type { IUser } from "../../services/types/user.types";

type Props = {
  user: IUser;
  onDelete: (id: string) => void;
};

const UserRow = ({ user, onDelete }: Props) => (
  <div className="group flex items-center gap-6 py-5 border-b border-white/5 hover:bg-white/2 transition-colors">
    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
      <i className="fa-solid fa-user text-xs"></i>
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3">
        <span className="font-medium">{user.username}</span>
        {user.role === "admin" && (
          <span className="text-orange-400 text-xs uppercase tracking-widest">
            admin
          </span>
        )}
      </div>
      <div className="text-white/40 text-sm">{user.email}</div>
    </div>

    <button
      type="button"
      onClick={() => onDelete(user.id)}
      className="text-xs text-red-400/70 hover:text-red-400 uppercase tracking-widest cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
    >
      Delete
    </button>
  </div>
);

export default UserRow;
