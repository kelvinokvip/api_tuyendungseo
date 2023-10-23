function convertToAccentedStringVietnamese(text) {
    // Convert text to Telex input method
    let telexText = text.replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
      .replace(/í|ì|ỉ|ĩ|ị/gi, 'i')
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ/gi, 'o')
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ/gi, 'u')
      .replace(/ý|ỳ|ỷ|ỹ/gi, 'y')
      .replace(/đ/gi, 'd');
    // Add accents back
    let accentedText = telexText.replace(/a/gi, 'à á ả ã ạ')
      .replace(/ă/gi, 'ằ ắ ẳ ẵ ặ')
      .replace(/â/gi, 'ầ ấ ẩ ẫ ậ')
      .replace(/e/gi, 'è é ẻ ẽ ẹ')
      .replace(/ê/gi, 'ề ế ể ễ ệ')
      .replace(/i/gi, 'ì í ỉ ĩ ị')
      .replace(/o/gi, 'ò ó ỏ õ ọ')
      .replace(/ô/gi, 'ồ ố ổ ỗ ộ')
      .replace(/ơ/gi, 'ờ ớ ở ỡ ợ')
      .replace(/u/gi, 'ù ú ủ ũ ụ')
      .replace(/ư/gi, 'ừ ứ ử ữ ự')
      .replace(/y/gi, 'ỳ ý ỷ ỹ ỵ');
    
    // Generate all possible cases
    let result = [];
    for (let i = 0; i < accentedText.length; i++) {
      let char = accentedText.charAt(i);
      if (char === char.toLowerCase()) {
        result.push(accentedText.slice(0,i) + char.toUpperCase() + accentedText.slice(i+1));
        for (let j = i+1; j < accentedText.length; j++) {
          let nextChar = accentedText.charAt(j);
          if (nextChar === nextChar.toLowerCase()) {
            result.push(accentedText.slice(0,i) + char.toUpperCase() + accentedText.slice(i+1,j) + nextChar.toUpperCase() + accentedText.slice(j+1));
          }
        }
      }
    }
    console.log(result)
    return result;
  }
  

module.exports = {convertToAccentedStringVietnamese}
