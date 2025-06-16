// Define the shape of the enhanced location state object.
import { createComputed, createSignal, Signal } from "../core/signals";

type LocationState = {
  pathname: string;
  search: string;
  hash: string;
  // A pre-parsed URLSearchParams object for easy query string access.
  params: URLSearchParams;
};

// Helper function to get the current parsed location state.
const getLocationState = (): LocationState => ({
  pathname: window.location.pathname,
  search: window.location.search,
  hash: window.location.hash,
  params: new URLSearchParams(window.location.search),
});

/**
 * A reactive signal that holds a parsed version of `window.location`.
 * It includes a `URLSearchParams` object for easy access to query strings.
 *
 * @example
 * const page = useSelector(() => locationSignal.get().params.get('page'));
 */
export const locationSignal = createSignal<LocationState>(getLocationState());

// Internal helper to update the location signal.
const updateLocation = () => {
  locationSignal.set(getLocationState());
};

// Listen to browser navigation events.
window.addEventListener("popstate", updateLocation);

/**
 * Navigates to a new URL, pushing an entry onto the history stack.
 * @param to The new path (e.g., '/about?id=123').
 */
export function navigate(to: string) {
  window.history.pushState({}, "", to);
  // pushState does not fire a 'popstate' event, so we trigger the update manually.
  updateLocation();
}

/**
 * Replaces the current entry in the history stack with a new URL.
 * @param to The new path to replace the current one with.
 */
export function replace(to: string) {
  window.history.replaceState({}, "", to);
  // replaceState also does not fire 'popstate', so we update manually.
  updateLocation();
}

/**
 * Creates a reactive signal of named parameters from a URL path.
 *
 * @param pattern The URL pattern to match against (e.g., '/users/:id').
 * @returns A computed signal containing an object of the matched parameters.
 *
 * @example
 * const params = createParams('/users/:id');
 * const userId = useSelector(() => params.get().id);
 */
export function createParams(pattern: string): Signal<Record<string, string>> {
  const patternParts = pattern.split("/").filter((p) => p);

  return createComputed(() => {
    const pathParts = locationSignal
      .get()
      .pathname.split("/")
      .filter((p) => p);
    const params: Record<string, string> = {};

    // If the number of segments doesn't match, this pattern is not a match.
    if (patternParts.length !== pathParts.length) {
      return {};
    }

    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(":")) {
        // This is a dynamic segment, so we capture its value.
        const paramName = patternPart.slice(1);
        params[paramName] = decodeURIComponent(pathPart);
      } else if (patternPart !== pathPart) {
        // If a static part doesn't match, this pattern is not valid for the current path.
        return {};
      }
    }
    return params;
  });
}
