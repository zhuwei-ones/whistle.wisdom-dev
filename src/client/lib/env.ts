export function isProject() {
  if (typeof window.onesConfig === "object") {
    return true;
  }

  return false;
}
