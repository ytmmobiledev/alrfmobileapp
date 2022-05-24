import { error } from "./toast";
import { string } from "../locales";

export function objectControl(
  object: object,
  disables: any = [],
  alert: boolean = true
) {
  try {
    for (const [key, value] of Object.entries(object)) {
      if (disables.includes(key)) continue;

      if (!value) {
        if (string[key]) {
          alert ? error(string[key] + " " + string.zorunlualan) : null;
        } else {
          alert ? error(key + " " + string.zorunlualan) : null;
        }

        return key;
      }
    }
  } catch (e) {}

  return false;
}

export function isEmptyObject(object: any) {
  let empty = true;
  try {
    if (!object) {
      throw "";
    }

    const _object = Object.entries(object);

    empty = !(Array.isArray(_object) && _object.length);
  } catch (e) {}

  return empty;
}
