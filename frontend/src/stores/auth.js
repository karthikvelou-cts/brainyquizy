import { defineStore } from "pinia";
import api from "../services/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("brainapi_token") || "",
    user: JSON.parse(localStorage.getItem("brainapi_user") || "null"),
    loading: false,
    error: "",
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },
  actions: {
    async register(payload) {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.post("/auth/register", payload);
        this.setAuth(data.token, data.user);
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async login(payload) {
      this.loading = true;
      this.error = "";
      try {
        const { data } = await api.post("/auth/login", payload);
        this.setAuth(data.token, data.user);
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },
    setAuth(token, user) {
      this.token = token;
      this.user = user;
      localStorage.setItem("brainapi_token", token);
      localStorage.setItem("brainapi_user", JSON.stringify(user));
    },
    logout() {
      this.token = "";
      this.user = null;
      localStorage.removeItem("brainapi_token");
      localStorage.removeItem("brainapi_user");
    },
  },
});
