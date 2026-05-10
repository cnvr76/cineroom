import useAsyncFetch from "../../hooks/useAsyncFetch";
import { api } from "../../services/api";

const Stat = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col">
    <div className="text-5xl font-bold">{value}</div>
    <div className="text-xs text-white/40 uppercase mt-2">{label}</div>
  </div>
);

const Dashboard = () => {
  const { data } = useAsyncFetch(api.admin.stats);

  return (
    <div className="grid grid-cols-4 py-8 mb-16 border-y border-white/10">
      <Stat value={data?.users ?? 0} label="Users" />
      <Stat value={data?.totalMedia ?? 0} label="Total" />
      <Stat value={data?.movies ?? 0} label="Movies" />
      <Stat value={data?.tv ?? 0} label="TV Shows" />
    </div>
  );
};

export default Dashboard;
