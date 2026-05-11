const SearchBar = ({ search, setSearch }) => (
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
    <input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search listings..."
      className="input w-full pl-9"
    />
  </div>
)

export default SearchBar
