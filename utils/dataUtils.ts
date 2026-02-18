
import { Profile, Task } from '../types';

export const findTask = (profiles: Profile[], taskId: string): { task: Task | null; profile: Profile | null } => {
  for (const profile of profiles) {
    const findInTasks = (tasks: Task[]): Task | null => {
      for (const task of tasks) {
        if (task.id === taskId) return task;
        const foundInSub = findInTasks(task.subTasks);
        if (foundInSub) return foundInSub;
      }
      return null;
    };
    const task = findInTasks(profile.tasks);
    if (task) return { task, profile };
    const foundInSubProfile = findTask(profile.subProfiles, taskId);
    if (foundInSubProfile.task) return foundInSubProfile;
  }
  return { task: null, profile: null };
};

export const findProfile = (profiles: Profile[], profileId: string): { profile: Profile | null } => {
    for (const profile of profiles) {
        if (profile.id === profileId) return { profile };
        const foundInSub = findProfile(profile.subProfiles, profileId);
        if (foundInSub.profile) return foundInSub;
    }
    return { profile: null };
}

export const findParentTask = (profiles: Profile[], taskId: string): { parent: Task[] | null } => {
    for (const profile of profiles) {
        const findInTasks = (tasks: Task[]): Task[] | null => {
            for (const task of tasks) {
                if (task.subTasks.some(sub => sub.id === taskId)) return task.subTasks;
                const foundInSub = findInTasks(task.subTasks);
                if (foundInSub) return foundInSub;
            }
            return null;
        }
        if (profile.tasks.some(t => t.id === taskId)) return { parent: profile.tasks };
        const foundInTasks = findInTasks(profile.tasks);
        if (foundInTasks) return { parent: foundInTasks };

        const foundInSubProfiles = findParentTask(profile.subProfiles, taskId);
        if (foundInSubProfiles.parent) return foundInSubProfiles;
    }
    return { parent: null };
}

export const findProfileAndParentTask = (profiles: Profile[], profileId: string): { parent: Profile[] | null } => {
    // This function finds the list of sibling profiles for a given profileId
    if (profiles.some(p => p.id === profileId)) {
      return { parent: profiles };
    }
    for (const profile of profiles) {
        if (profile.subProfiles.some(p => p.id === profileId)) {
            return { parent: profile.subProfiles };
        }
        const foundInSub = findProfileAndParentTask(profile.subProfiles, profileId);
        if (foundInSub.parent) return foundInSub;
    }
    return { parent: null };
}

export const findWorkspaceForProfile = (profiles: Profile[], profileId: string): Profile | null => {
  for (const workspace of profiles) {
    if (workspace.id === profileId) {
      return workspace;
    }
    const findInSubs = (currentProfile: Profile): boolean => {
      if (currentProfile.id === profileId) return true;
      return currentProfile.subProfiles.some(findInSubs);
    }
    if (findInSubs(workspace)) {
      return workspace;
    }
  }
  return profiles.length > 0 ? profiles[0] : null;
}

export const findParentProfile = (profiles: Profile[], profileId: string): Profile | null => {
  for (const p of profiles) {
    if (p.subProfiles.some(sub => sub.id === profileId)) {
      return p;
    }
    const found = findParentProfile(p.subProfiles, profileId);
    if (found) return found;
  }
  return null;
}
