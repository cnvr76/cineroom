import { useState } from "react";
import useAsyncFetch from "../../hooks/useAsyncFetch";
import useAsyncCall from "../../hooks/useAsyncCall";
import { api } from "../../services/api";
import type { IUser } from "../../services/types/user.types";
import SearchBar, { type SearchState } from "../widgets/SearchBar";
import UserRow from "./UserRow";

const UsersTab = () => {
  const { data, isLoading, refetch } = useAsyncFetch<IUser[]>(api.user.list);
  const { execute: deleteUser, isLoading: isDeleting } = useAsyncCall<{
    deleted: boolean;
  }>();

  const [searchState, setSearchState] = useState<SearchState<IUser>>({
    results: undefined,
    isSearching: false,
    isActive: false,
    error: undefined,
  });

  const usersToShow = searchState.isActive ? searchState.results : data;
  const isPending = isLoading || searchState.isSearching;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    await deleteUser(() => api.admin.users.delete(id));
    refetch();
    if (searchState.isActive) {
      setSearchState((prev) => ({
        ...prev,
        results: prev.results?.filter((u) => u.id !== id),
      }));
    }
  };

  return (
    <section className="flex flex-col gap-4">
      <SearchBar
        searchFn={api.admin.users.search}
        onChange={setSearchState}
        placeholder="Search by username or email..."
      />

      {searchState.error && (
        <div className="text-red-400 text-sm">{searchState.error.message}</div>
      )}

      {isPending && (
        <div className="text-white/40 text-sm py-4">Loading...</div>
      )}

      {!isPending && (
        <div className="flex flex-col">
          {usersToShow?.map((u) => (
            <UserRow key={u.id} user={u} onDelete={handleDelete} />
          ))}
          {usersToShow?.length === 0 && (
            <div className="text-white/40 text-sm py-8 text-center">
              {searchState.isActive ? "No users found" : "No users yet"}
            </div>
          )}
        </div>
      )}

      {isDeleting && <div className="text-white/40 text-xs">Deleting...</div>}
    </section>
  );
};

export default UsersTab;
