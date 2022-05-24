export function capitalize(s: string) {
  return s[0].toUpperCase() + s.slice(1);
}

export function shortHTML(s: string, lenght: number) {
  try {
    s = s.replace(new RegExp("<(.*?)>", "g"), " ");
    s = s.replace(/&nbsp;/gi, "");
    s = s.replace(/\s/gi, " ");
    s = s.replace(/(\r\n|\n|\r)/gm, " ");
    s = s.trim();
    let end = s.length > lenght ? "..." : "";

    s = s.substring(0, lenght) + end;
  } catch (e) {
    s = "";
  }

  return s;
}

export function textLength(text: string, length = 30) {
  let _text = "";

  try {
    _text = text.substr(0, length);

    if (text.length > length) {
      _text += "...";
    }
  } catch (e) {}

  return _text;
}
