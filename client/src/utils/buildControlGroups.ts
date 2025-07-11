// src/utils/buildControlGroups.ts

import type { ControlGroup }  from "../components/ControlGroupsTable";
import type { ControlLevel }  from "../components/ControlLevelsTable";

/**
 * Take your up‑to‑date flat cost/indCost settings
 * (controlLevels) and fold them into the grouped shape
 * the backend expects.
 */
export function buildControlGroups(
  groups: ControlGroup[],
  levels: ControlLevel[]
): ControlGroup[] {
  // Map group.id → shallow copy of that group (but clear its levels)
  const map = new Map<string, ControlGroup>();
  groups.forEach((g) =>
    map.set(g.id, { ...g, levels: [] })
  );

  // For each row in controlLevels, push into its group
  levels.forEach((lvl) => {
    const g = map.get(lvl.groupId);
    if (!g) return;
    g.levels.push({
      level:     lvl.level,
      name:      lvl.name,
      cost:      lvl.cost,
      ind_cost:  lvl.indCost,
      flow:      lvl.flow,
    });
  });

  // Optionally sort each group’s levels
  map.forEach((g) =>
    g.levels.sort((a, b) => a.level - b.level)
  );

  return Array.from(map.values());
}
