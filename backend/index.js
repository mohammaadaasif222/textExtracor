const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const fs = require('fs');
const { Document, Packer, Paragraph } = require('docx');
const cors = require('cors')

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(cors('origin', '*'))
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const imagePath = req.file.path;

    try {
        // Perform OCR
        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
        console.log(text);

        // Generate Word document
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: text,
                        spacing: { after: 200 },
                    }),
                ],
            }],
        });

        const buffer = await Packer.toBuffer(doc);
        console.log(buffer);
        const outputPath = 'output.docx';
        fs.writeFileSync(outputPath, buffer);

        res.download(outputPath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
            fs.unlinkSync(outputPath); // Delete the file after sending it
            fs.unlinkSync(imagePath);  // Delete the uploaded image file
        });
    } catch (error) {
        console.error('Error processing image:', error);
        res.status(500).send('Error processing image');
        fs.unlinkSync(imagePath);  // Delete the uploaded image file in case of error
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
