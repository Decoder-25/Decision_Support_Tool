/* utils/budget.ts
   Return the *sum of each control‑group’s most expensive level*.
   (Same logic the Optimiser tab already uses.)
*/
export function getScenarioCostCap(scenario: any): number {
    if (!scenario?.control_groups?.length) return 10;     // safe fallback
  
    const maxPerGroup = scenario.control_groups.map((g: any) =>
      Math.max(...g.levels.map((l: any) => l.cost || 0))
    );
  
    const total = maxPerGroup.reduce((a: number, b: number) => a + b, 0);
    return Math.ceil(total * 1.2);   // +20 % head‑room for the slider
  }
  