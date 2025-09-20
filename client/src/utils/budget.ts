/* utils/budget.ts
   Return the *sum of each control‑group’s most expensive level*.
   (Same logic the Optimiser tab already uses.)
*/

/** 
 * A single control level, with an optional cost. 
 * If `cost` is missing or undefined, we treat it as 0.
 */
interface Level {
    cost?: number;
  }

/** 
 * A group of controls, each having multiple levels. 
 */
interface ControlGroup {
    levels: Level[];
  }
  
  /** 
   * The overall scenario, which may have zero or more control groups.
   */
  interface Scenario {
    control_groups?: ControlGroup[];
  }
   

export function getScenarioCostCap(scenario: Scenario | null | undefined): number {
    if (!scenario?.control_groups?.length) return 10;     
  
    const maxPerGroup = scenario.control_groups.map(group =>
      Math.max(...group.levels.map(level => level.cost ?? 0))
    );
  
    const total = maxPerGroup.reduce((sum, val) => sum + val, 0);
    return Math.ceil(total * 1.2);  
  }
  