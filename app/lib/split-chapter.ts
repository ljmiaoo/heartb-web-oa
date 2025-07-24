export function splitChapter(text: string) {
  const regex = /(^Chapter[^\n]*|^Appendix[^\n]*)/gim;
  const parts = text.split(regex).filter((f) => !!f);
  const chapters: {
    title: string;
    content: string;
    pureContent: string;
    key: number;
  }[] = [];
  const isTitle = (part: string) => regex.test(part);

  let index = 0;

  while (index < parts.length) {
    const part = parts[index];

    if (isTitle(part)) {
      const content = parts[index + 1];

      if (isTitle(content)) {
        chapters.push({
          title: part,
          content: part,
          pureContent: "",
          key: chapters.length,
        });
        index++;
      } else {
        chapters.push({
          title: part,
          content: part + content,
          pureContent: content,
          key: chapters.length,
        });
        index = index + 2;
      }
    } else {
      chapters.push({
        title: "",
        content: part,
        pureContent: part,
        key: chapters.length,
      });
      index++;
    }
  }

  return chapters;
}
