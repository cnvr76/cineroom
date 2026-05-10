type Props = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

const TabButton = ({ active, onClick, children }: Props) => (
  <button
    type="button"
    onClick={onClick}
    className={`pb-3 -mb-px border-b-2 text-sm uppercase tracking-widest transition-colors cursor-pointer ${
      active
        ? "border-orange-400 text-white"
        : "border-transparent text-white/40 hover:text-white/70"
    }`}
  >
    {children}
  </button>
);

export default TabButton;
