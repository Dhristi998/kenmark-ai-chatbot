import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

type KnowledgeItem = {
  keyword: string;
  answer: string;
};

export function loadExcelKnowledge(): KnowledgeItem[] {
  try {
    const filePath = path.join(process.cwd(), "data", "knowledge.xlsx");

    // 🛑 Guard: file must exist
    if (!fs.existsSync(filePath)) {
      console.warn("Excel file not found");
      return [];
    }

    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    return XLSX.utils.sheet_to_json(sheet) as KnowledgeItem[];
  } catch (error) {
    console.error("Excel load error:", error);
    return []; // NEVER crash API
  }
}
