/**
 * Singleton to track current dark mode state
 * This allows us to maintain dark mode state outside React components
 */
class ThemeManager {
  private static instance: ThemeManager;
  private _isDarkMode: boolean = false;
  private listeners: Set<(isDark: boolean) => void> = new Set();

  private constructor() {}

  public static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  public get isDarkMode(): boolean {
    return this._isDarkMode;
  }

  public set isDarkMode(value: boolean) {
    if (this._isDarkMode !== value) {
      this._isDarkMode = value;
      this.notifyListeners();
    }
  }

  public subscribe(listener: (isDark: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this._isDarkMode));
  }
}

export default ThemeManager;
