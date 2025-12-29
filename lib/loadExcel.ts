import * as XLSX from "xlsx";
import path from "path";

export type KnowledgeRow = {
  text: string;
};

export function loadKnowledge(): KnowledgeRow[] {
  const filePath = path.join(process.cwd(), "data", "knowledge.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json<KnowledgeRow>(sheet);

  return data.filter(row => row.text?.trim());
}
