export const AddTextBreaks = (text, width, font_size, styles) => {
  const canvas_ = document.createElement("canvas");
  let context = canvas_.getContext("2d");
  context.font = font_size + "px " + styles.fontfamily; //Helvetica Neue, Helvetica, Sans-Serif, Arial, Trebuchet MS";
  text = text.trim();
  text = text.replace(/<em>/gm, ' <em> ').replace(/<\/em>/gm, ' </em> ').replace(/<strong>/gm, ' <strong> ').replace(/<\/strong>/gm, ' </strong> ').replace(/~~/gm, ' ~~ ')

  let general_link_pattern = /<a href="(.*?)">(.*?)<\/a>/g;
  let a_start_pattern = /<a href="(.*?)">/;
  let a_end_pattern = /<\/a>/;
  const links = text.match(general_link_pattern);
  if (links !== null && links.length > 0) {
    for (let i = 0; i < links.length; i++) {
      let links_with_space = links[i];
      const a_starts = links_with_space.match(a_start_pattern);
      links_with_space = links_with_space.replace(a_starts[0], ` ${a_starts[0]} `);
      const a_ends = links_with_space.match(a_end_pattern);
      links_with_space = links_with_space.replace(a_ends[0], ` ${a_ends[0]} `);

      text = text.replace(links[i], links_with_space)
    }
  }

  //get existing lines before breaking:
  let lines = text.toString().split("\n");
  //for each line, get width of all words
  let font_style = '', t_font_style = '', new_strs = [], new_widths = [];
  let isAtag = false;
  for (let line = 0; line < lines.length; line++) {
    let words = lines[line].toString().split(" ");

    let idx = 1, w = 0, curr_w = 0;
    while (words.length > 1 && idx <= words.length) {
      curr_w = 0;
      let curr = words[idx - 1];
      if (curr === '<em>') {
        t_font_style = t_font_style.replace('italic ', '');
        t_font_style += 'italic ';
      }
      else if (curr === '<strong>') {
        t_font_style = t_font_style.replace('bold ', '');
        t_font_style += 'bold ';
      }
      else if (curr === '~~') {
      }
      else if (curr === '</strong>') {
        t_font_style = t_font_style.replace('bold ', '');
      }
      else if (curr === '</em>') {
        t_font_style = t_font_style.replace('italic ', '');
      }
      else if (curr === '<a') {
        let href_pattern = /href="(.*?)">/;
        const links = words[idx].match(href_pattern);
        if (links !== null && links.length > 0) {
          isAtag = true;
          idx++;
        }
      }
      else if (isAtag && curr === '</a>') {
      }
      else {
        curr_w = context.measureText(curr + " ").width;
        w += curr_w;
      }

      if (font_style !== t_font_style) {
        context.font = t_font_style + font_size + "px " + styles.fontfamily; //Helvetica Neue, Helvetica, Sans-Serif, Arial, Trebuchet MS";
      }
      // str = str.replace(/<em>/gm, '').replace(/<\/em>/gm, '').replace(/<strong>/gm, '').replace(/<\/strong>/gm, '').replace(/~~/gm, '')

      if (w >= width) {
        let new_word = words.slice(0, idx - 1).join(" ");
        new_strs.push(new_word);
        new_widths.push(w - curr_w);

        words = words.splice(idx - 1);
        w = 0;
        idx = 1;
      } else {
        idx += 1;
      }
      font_style = t_font_style;
    }

    let new_word = words.join(" ");
    new_strs.push(new_word);
    new_widths.push(context.measureText(new_word).width);
  }

  let nn = new_strs.join('\n');
  nn = nn.replace(/ <em> /gm, '<em>').replace(/ <\/em> /gm, '</em>').replace(/ <strong> /gm, '<strong>').replace(/ <\/strong> /gm, '</strong>').replace(/ ~~ /gm, '~~')
  nn = nn.replace(/ <a /g, '<a ').replace(/<\/a> /g, '</a>');

  // console.log('new_strs', nn.split('\n'), new_widths)
  return [nn.split('\n'), new_widths];
}
