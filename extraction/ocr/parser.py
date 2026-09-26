from typing import Dict, Any

class OCRParser:
    def extract_text_and_layout(self, file_path: str) -> Dict[str, Any]:
        """
        Runs OCR on the document and returns text alongside bounding box layout metadata.
        """
        # TODO: Implement Tesseract / EasyOCR logic
        return {
            "raw_text": "Sample Extracted Text",
            "layout_regions": []
        }

ocr_parser = OCRParser()
