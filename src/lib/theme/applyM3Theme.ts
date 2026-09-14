export const SEED_COLOR = "#5B4B8A";

const light: Record<string, string> = {
  "--md-sys-color-primary": "#5B4B8A",
  "--md-sys-color-on-primary": "#ffffff",
  "--md-sys-color-primary-container": "#e6ddff",
  "--md-sys-color-on-primary-container": "#1a0f3d",
  "--md-sys-color-secondary": "#625b70",
  "--md-sys-color-on-secondary": "#ffffff",
  "--md-sys-color-tertiary": "#7e525d",
  "--md-sys-color-on-tertiary": "#ffffff",
  "--md-sys-color-error": "#ba1a1a",
  "--md-sys-color-on-error": "#ffffff",
  "--md-sys-color-surface": "#fdf8ff",
  "--md-sys-color-on-surface": "#1c1b1f",
  "--md-sys-color-surface-container": "#f3edf7",
  "--md-sys-color-surface-container-high": "#ece6f0",
  "--md-sys-color-surface-variant": "#e7e0ec",
  "--md-sys-color-on-surface-variant": "#49454e",
  "--md-sys-color-outline": "#7a757f",
  "--md-sys-color-outline-variant": "#cac4d0",
  "--md-sys-color-inverse-surface": "#313033",
  "--md-sys-color-inverse-on-surface": "#f4eff4",
};

const dark: Record<string, string> = {
  "--md-sys-color-primary": "#cbbdff",
  "--md-sys-color-on-primary": "#32275a",
  "--md-sys-color-primary-container": "#473571",
  "--md-sys-color-on-primary-container": "#e6ddff",
  "--md-sys-color-secondary": "#cbc2db",
  "--md-sys-color-on-secondary": "#332d41",
  "--md-sys-color-tertiary": "#f0b7c4",
  "--md-sys-color-on-tertiary": "#4a2530",
  "--md-sys-color-error": "#ffb4ab",
  "--md-sys-color-on-error": "#690005",
  "--md-sys-color-surface": "#141318",
  "--md-sys-color-on-surface": "#e6e1e6",
  "--md-sys-color-surface-container": "#201f24",
  "--md-sys-color-surface-container-high": "#2b292f",
  "--md-sys-color-surface-variant": "#49454e",
  "--md-sys-color-on-surface-variant": "#cac4d0",
  "--md-sys-color-outline": "#948f99",
  "--md-sys-color-outline-variant": "#49454e",
  "--md-sys-color-inverse-surface": "#e6e1e6",
  "--md-sys-color-inverse-on-surface": "#313033",
};

export function buildCssVars(isDark: boolean): Record<string, string> {
  return isDark ? dark : light;
}
