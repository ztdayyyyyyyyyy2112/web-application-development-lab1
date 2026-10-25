# Exercise 2 verification (slide checkpoint at 120 minutes)

- Initial data: Goethe, Einstein, da Vinci, Newton, Maxwell, Sidis.
- Query by case-insensitive name (`einSTEIN` finds Einstein).
- Minimum IQ: 200 limits output to eligible people.
- Sort by IQ descending then Age ascending; original SMART_PEOPLE array does not mutate.
- Typing 1 character updates result count without useEffect syncing a second filtered state.
- Delete Goethe -> result count drops (when filter includes Goethe); Reset restores data and inputs.
- Inspect React DevTools Profiler for rendering behavior; don't claim measured passes without an actual profile.
