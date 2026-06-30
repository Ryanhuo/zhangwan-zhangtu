const STORAGE_KEY = "zhangwan-zhangtu.project-name";
const DEFAULT_PROJECT_NAME = "zhangwan-zhangtu";

function readProjectName() {
  if (typeof window === "undefined") {
    return DEFAULT_PROJECT_NAME;
  }
  return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_PROJECT_NAME;
}

export function getProjectName() {
  return readProjectName();
}

export function setProjectName(nextName: string) {
  if (typeof window === "undefined") {
    return;
  }
  const value = nextName.trim() || DEFAULT_PROJECT_NAME;
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent("zhangwan-project-name-change", { detail: value }));
}

export function subscribeProjectName(listener: (projectName: string) => void) {
  const handleChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    listener(customEvent.detail || readProjectName());
  };
  window.addEventListener("zhangwan-project-name-change", handleChange);
  return () => window.removeEventListener("zhangwan-project-name-change", handleChange);
}
