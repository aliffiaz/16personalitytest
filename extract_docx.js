import mammoth from 'mammoth';
import fs from 'fs';

mammoth.extractRawText({path: "./16_personalities_website_content.docx"})
    .then(function(result) {
        var text = result.value; // The raw text
        var messages = result.messages; // Any messages, such as warnings during conversion
        fs.writeFileSync('./content_extracted.txt', text);
        console.log("Extraction complete. Check content_extracted.txt");
    })
    .catch(function(err) {
        console.log(err);
    });
