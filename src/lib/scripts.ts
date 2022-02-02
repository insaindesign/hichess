const srcId = (src: string) => {
  const matches = src.match(/([A-Za-z])+/g) || [];
  return matches.join('_');
}

export const loadScript = (src: string): Promise<Window> => new Promise((resolve, reject) => {
  const id = srcId(src);
  const existingScript = document.getElementById(id);
  if (!existingScript) {
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.onload = () => resolve(window);
    script.onerror = () => {
      reject();
      document.body.removeChild(script);
    };
    document.body.appendChild(script);
  } else {
    resolve(window);
  }
});