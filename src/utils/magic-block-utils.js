function replacer(_match, blockType, blockContent) {
  try {
    const block = JSON.parse(blockContent);

    switch (blockType) {
      case 'code':
        return block.codes.reduce((prev, curr) => {
          switch (curr.language) {
            case 'jsonc':
              curr.language = 'json';
              break;
            case 'curl':
              curr.language = 'curl';
              break;
            default:
              break;
          }

          return `${prev}\n\`\`\`${curr.language}\n${curr.code}\n\`\`\`\n`;
        }, '');

      case 'html':
        return `\n\n${block.html}`;

      case 'image':
        return block.images.reduce((prev, curr) => `${prev}\n\n<img src="${curr.image[0]}" alt="${curr.image[1]}" style="width:50%;" />`, '');

      case 'api-header':
        return `\n\n## ${block.title}\n\n`;

      case 'callout':
        return `\n\n> ${block.body}`;

      case 'embed':
        return `\n\n${block.html}`;

      case 'parameters': {
        const { rows, cols } = block;

        let table = '\n\n';
        for (let i = 0; i < cols; i++) table += `| ${block.data[`h-${i}`]}`;
        table += '|\n';
        for (let i = 0; i < cols; i++) table += '| :---';

        for (let i = 0; i < rows; i++) {
          table += '|\n';
          for (let j = 0; j < cols; j++) {
            table += `| ${block.data[`${i}-${j}`].replace(/\n/gm, '<br />')}`;
          }
        }

        table += '|\n';
        return table;
      }

      default:
        return '';
    }
  } catch (err) {
    return `\n\n<p class="invalid-block">Invalid block.<br />${err.message}</p>\n\n`;
  }
}

export default function processPathDescription(description) {
  const magicBlockRegex = /\[block:(?<Type>[^\]]*)\](?<Content>[^]+?)\[\/block\]/gms;
  const replacedMarkdown = description.replace(/ *[\\n]* *\[ *[\\n]* */gm, '[')
    .replace(/ *[\\n]* *] *[\\n]* */gm, ']')
    .replace(magicBlockRegex, replacer);
  return replacedMarkdown;
}
