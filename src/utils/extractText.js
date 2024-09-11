import Tesseract from 'tesseract.js';

export const extractText = async (path) => {
    try {
        const result = await Tesseract.recognize(
            path,
            'eng',
            {
                logger: (m) => { /*console.log(m) */ }
            }
        );
        //console.log(result.data.text);
        
        const  text = result.data.text;
        return text; 
    } catch (error) {
        console.error('Error:', error);
        return null; 
    }
}
