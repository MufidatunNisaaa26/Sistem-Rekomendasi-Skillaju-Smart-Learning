import { request } from "./apiClient";

export const profileService = {
  getSavedProfiles() {
    return request("/custom-users");
  },

  saveProfile(profilePayload) {
    return request("/custom-users", {
      method: "POST",
      body: JSON.stringify(profilePayload),
    });
  },

  deleteProfile(userName) {
    return request(`/custom-users/${encodeURIComponent(userName)}`, {
      method: "DELETE",
    });
  },

  deleteAllProfiles() {
    return request("/custom-users", {
      method: "DELETE",
    });
  },
};
