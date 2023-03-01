function getStringBetween(str, start, end) {
  let res;

  if (end) {
    res = str.match(new RegExp(`${start}(.*)${end}`, 'i'));
  } else {
    res = str.match(new RegExp(`${start}(.*)`, 'i'));
  }

  if (res) {
    return res[1];
  }

  return null;
}

function removeCommas(str) {
  const strTrimmed = str.trim();
  const lastCommaIndex = strTrimmed.lastIndexOf(',');
  const firstCommaIndex = strTrimmed.indexOf(',');
  let strLastCommaRemoved;
  let strFirstLastCommaRemoved;

  if (lastCommaIndex === strTrimmed.length - 1) {
    strLastCommaRemoved = str.substring(0, lastCommaIndex);
  }

  if (firstCommaIndex === 0) {
    strFirstLastCommaRemoved = strLastCommaRemoved.substring(1);
  }

  return strFirstLastCommaRemoved.trim();
}

export default function authorsParser(authors) {
  const separator = '***';
  const nameField = 'name';
  const titleField = 'title';
  const imageField = 'image';

  return authors.split(separator).map((author) => {
    const hasName = !!author.match(new RegExp(nameField, 'i'));
    const hasTitle = !!author.match(new RegExp(titleField, 'i'));
    const hasImage = !!author.match(new RegExp(imageField, 'i'));
    let name;
    let title;
    let image;

    if (hasName && hasTitle) {
      name = removeCommas(getStringBetween(author, `${nameField}:`, `${titleField}:`));
    } else if (hasName && hasImage) {
      name = removeCommas(getStringBetween(author, `${nameField}:`, `${imageField}:`));
    } else if (hasName) {
      name = removeCommas(getStringBetween(author, `${nameField}:`));
    }

    if (hasTitle && hasImage) {
      title = removeCommas(getStringBetween(author, `${titleField}:`, `${imageField}:`));
    } else if (hasTitle) {
      title = removeCommas(getStringBetween(author, `${titleField}:`));
    }

    if (hasImage) {
      image = removeCommas(getStringBetween(author, `${imageField}:`));
    }

    return {
      [nameField]: name,
      [titleField]: title,
      [imageField]: image,
    };
  });
}
