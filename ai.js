import Together from "together-ai";
import dotenv from "dotenv";
import { User } from "./model.js";
dotenv.config();

const together = new Together({
  apiKey: process.env["TOGETHER_API_KEY"], // This is the default and can be omitted
});

export const aiResponse = async (content, userId) => {
  console.log(content);
  let lineUser = await User.findOne({ userId });

  if (!lineUser) {
    lineUser = new User({
      userId,
      messages: [
        {
          role: "user",
          content: "ネクシ工場は、Career Survival Inc.が開発した製造業向けAIアシスタントで、MISTRAL-70Bというオープンソースの大規模言語モデルを活用しています。主な機能は以下の通りです： 1. 需要予測: 歴史データや市場動向を分析し、正確な需要予測を提供。2. 予知保全: IoTセンサーを使用して機器の状態を監視し、故障を予測。3. 自動品質管理: 高解像度カメラとセンサーを使用して製品をリアルタイムで検査。4. エネルギー最適化: 消費パターンを分析し、エネルギー効率を向上。5. 労働力管理: シフト計画を最適化し、スキルギャップを解消。6. システム統合とデータ処理: 既存のERP、MES、SCADAシステムと統合し、データのプライバシーとセキュリティを確保。7. 日本製造業向けのカスタマイズ: カイゼンやリーン製造などの原則をAIモデルに組み込み、日本のビジネス慣習に適応。ネクシ工場の導入により、最大20%の運用コスト削減、30%以上の不良品率削減、労働力の最適化、エネルギーコストの15%削減が可能です。`\n"+
          content,
        },
      ],
    });
  } else {
    lineUser.messages.push({
      role: "user",
      content,
    });
  }

  // Now, `messages` includes all previous conversations for context
  const messages = lineUser.messages;

  const response = await together.chat.completions.create({
    messages,
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  });

  // Append the system's response to the user's message history
  lineUser.messages.push({
    role: "assistant",
    content: response?.choices?.[0].message?.content,
  });

  await lineUser.save();
  console.log(response);
  return response;
};
