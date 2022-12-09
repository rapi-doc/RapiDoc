import { marked } from 'marked';

function replacerBlocks(_match, textBefore, blockType, blockContent, textAfter) {
  let replaced = '';

  if (textBefore) replaced += `${marked(textBefore)}\n\n`;

  try {
    const block = JSON.parse(decodeURIComponent(blockContent));

    switch (blockType) {
      case 'code':
        replaced += marked(block.codes.reduce((prev, curr) => {
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

          return `${prev}\n\`\`\`${curr.language}\n${decodeURIComponent(curr.code)}\n\`\`\`\n`;
        }, ''));
        break;

      case 'html':
        replaced += `\n\n${block.html}\n\n`;
        break;

      case 'image':
        replaced += block.images.reduce((prev, curr) => `${prev}\n\n<img src="${curr.image[0]}" alt="${curr.image[1]}" style="width:50%;" />`, '');
        break;

      case 'api-header':
        replaced += marked(`## ${block.title}`);
        break;

      case 'callout':
        replaced += `<blockquote class=${block.type}><h3>${block.title ?? ''}</h3>${marked(block.body)}</blockquote>`;
        break;

      case 'embed':
        replaced += `\n\n${block.html}\n\n`;
        break;

      case 'parameters': {
        const { rows, cols } = block;

        let table = '\n\n';
        for (let i = 0; i < cols; i++) {
          if (block.data[`h-${i}`]) table += `| ${block.data[`h-${i}`]}`;
          else table += '|';
        }

        table += '|\n';

        for (let i = 0; i < cols; i++) table += '| :---';

        for (let i = 0; i < rows; i++) {
          table += '|\n';
          for (let j = 0; j < cols; j++) {
            if (block.data[`${i}-${j}`]) table += `| ${block.data[`${i}-${j}`].replace(/\n/gm, '<br />')}`;
            else table += '|';
          }
        }

        table += '|\n';
        replaced += marked(table);
      }
        break;

      default:
        replaced += '';
        break;
    }

    if (textAfter) replaced += marked(textAfter);
  } catch (err) {
    replaced += `\n\n<blockquote class="warning"><h3>Work in progress</h3>[block:${blockType}]${blockContent}[/block]</blockquote>\n\n`;
    if (textAfter) replaced += marked(textAfter);
  }

  return replaced;
}

export default function processPathDescription(description) {
  const magicBlockRegex = /(?<TextBefore>[^[\]]*)\[block:(?<Type>[^\]]*)\](?<Content>.+?)\[\/block\](?<TextAfter>[^[\]]*)/gms;
  const replacedMarkdown = description.replace(magicBlockRegex, replacerBlocks);

  return replacedMarkdown;
}
